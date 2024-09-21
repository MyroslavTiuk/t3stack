import axios from "axios";
import { add, format, getUnixTime, getYear } from "date-fns";
import {
  type PrismaClient,
  type TDAmeritradeToken,
  TransactionSource,
  Position,
  OptionType,
  OpenClose,
  OptionAction,
} from "opcalc-database";
import { isValid } from "date-fns";
import { TRPCError } from "@trpc/server";
import type {
  PostTdTokenResp,
  TdAmeritradeTransaction,
} from "./tdAmeritrade.types";
import { env } from "~/env.mjs";
import { filter, sum, map, maxBy, compact } from "lodash";
import { buildDefaultStrategies } from "../strategies/strategies";

export const TD_AMERITRADE_URL = "https://api.tdameritrade.com/v1";

const MAX_TD_TRANSACTION_RESP_COUNT = 5000;

export class TdAmeritrade {
  prisma: PrismaClient;
  userId: string;
  token: TDAmeritradeToken | null;

  constructor(userId: string, prisma: PrismaClient) {
    this.prisma = prisma;
    this.userId = userId;
    this.token = null;
  }

  async getAccessToken() {
    if (this.token) {
      return this.token;
    }
    const token = await this.prisma.tDAmeritradeToken.findUnique({
      where: {
        userId: this.userId,
      },
    });

    if (!token) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "could not TD Ameritrade token in database",
      });
    }
    const isTokenExpired = new Date() > new Date(token.expiresIn);
    if (!isTokenExpired) {
      this.token = token;
      return token;
    }

    return await this.refreshAccessToken(token);
  }

  async refreshAccessToken(token: TDAmeritradeToken) {
    const params: URLSearchParams = new URLSearchParams({
      grant_type: "refresh_token",
      access_type: "offline",
      refresh_token: token.refreshToken,
      client_id: env.NEXT_PUBLIC_TD_AMERITRADE_API_KEY,
    });

    const { data } = await axios.post<PostTdTokenResp>(
      `${TD_AMERITRADE_URL}/oauth2/token`,
      params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const updatedToken = await this.prisma.tDAmeritradeToken.update({
      where: {
        id: token.id,
      },
      data: {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresIn: add(new Date(), {
          seconds: data.expires_in - 1,
        }),
        refreshTokenExpiresIn: add(new Date(), {
          seconds: data.refresh_token_expires_in - 1,
        }),
      },
    });

    this.token = updatedToken;
    return updatedToken;
  }

  async fullImport(startImportYear: number | null = null) {
    const lastImportYear = new Date().getFullYear();
    const firstImportYear = startImportYear ?? 2000;
    const numberOfYears = lastImportYear - firstImportYear + 1;
    const dateRanges = Array.from({ length: numberOfYears }, (_, i) => ({
      startDate: `${i + firstImportYear}-01-01`,
      endDate: `${i + firstImportYear}-12-31`,
    }));
    // collect expiry transactions first so we make sure the option transactions are created first and we can use them to look up the correct option information
    const collectedExpiryTransactions: TdAmeritradeTransaction[] = [];

    await Promise.all(
      dateRanges.map(async (dateRange) => {
        let startDate = dateRange.startDate;
        // eslint-disable-next-line no-constant-condition
        while (true) {
          const { count, lastTransactionDate, expiryTransactions } =
            await this.importTransactions(startDate, dateRange.endDate);
          collectedExpiryTransactions.push(...expiryTransactions);
          if (count < MAX_TD_TRANSACTION_RESP_COUNT || !lastTransactionDate) {
            break;
          }

          const formattedLatestDate = format(lastTransactionDate, "yyyy-MM-dd");
          startDate = formattedLatestDate;
        }
      })
    );

    await this.createExpiryTransactions(collectedExpiryTransactions);

    const token = await this.getAccessToken();
    await this.prisma.tDAmeritradeToken.update({
      where: { id: token.id },
      data: {
        lastSync: new Date(),
      },
    });

    await buildDefaultStrategies(this.prisma, this.userId);
  }

  async importTransactions(startDate = "", endDate = "") {
    const token = await this.getAccessToken();
    const { data: transactions } = await axios.get<TdAmeritradeTransaction[]>(
      `${TD_AMERITRADE_URL}/accounts/${token.mainAccountId}/transactions?startDate=${startDate}&endDate=${endDate}`,
      {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      }
    );

    const newTransactions = filter(
      transactions,
      (transaction: TdAmeritradeTransaction) => {
        if (!token.lastSync) {
          return true;
        }
        return new Date(transaction.transactionDate) > token.lastSync;
      }
    );
    const interestingTransactions = filter(
      newTransactions,
      (transaction) =>
        transaction.type === "TRADE" ||
        transaction.description === "REMOVAL OF OPTION DUE TO EXPIRATION" ||
        transaction.description === "REMOVAL OF OPTION DUE TO ASSIGNMENT"
    );
    if (interestingTransactions.length === 0) {
      return {
        count: 0,
        lastTransactionDate: undefined,
        expiryTransactions: [],
      };
    }

    await Promise.all([
      this.createOptionTransactions(interestingTransactions),
      this.createEquityTransactions(interestingTransactions),
    ]);

    const expiryTransactions = this.getExpiryTransactions(
      interestingTransactions
    );
    const lastTransaction = maxBy(
      interestingTransactions,
      (transaction) => new Date(transaction.transactionDate)
    );
    const lastTransactionDate = lastTransaction
      ? new Date(lastTransaction.transactionDate)
      : undefined;

    return {
      count: transactions.length,
      lastTransactionDate,
      expiryTransactions,
    };
  }

  async createOptionTransactions(transactions: TdAmeritradeTransaction[]) {
    const optionTransactions = compact(
      map(transactions, (transaction) => {
        const { fees, transactionItem } = transaction;
        const { instrument } = transactionItem;
        if (
          instrument.assetType !== "OPTION" ||
          !["BUY", "SELL"].includes(transactionItem.instruction) ||
          !instrument.underlyingSymbol ||
          !instrument.optionExpirationDate ||
          !isValid(new Date(instrument.optionExpirationDate))
        ) {
          return null;
        }
        const totalFees = sum([
          fees.rFee +
            fees.additionalFee +
            fees.cdscFee +
            fees.regFee +
            fees.otherCharges +
            fees.commission +
            fees.optRegFee +
            fees.secFee,
        ]);

        const strikePrice =
          instrument.optionStrikePrice ??
          parseStrikePriceFromDescription(instrument.description);
        if (!strikePrice) {
          return null;
        }

        function getOpenClose() {
          if (transactionItem.positionEffect === "OPENING") {
            return OpenClose.Open;
          }
          if (transactionItem.positionEffect === "CLOSING") {
            return OpenClose.Close;
          }
          return null;
        }

        return {
          userId: this.userId,
          source: TransactionSource.TdAmeritrade,
          sourceTransactionId: String(transaction.transactionId),
          underlyingSymbol: instrument.underlyingSymbol,
          transactionDate: new Date(transaction.transactionDate),
          netPrice: transaction.netAmount,
          quantity: transactionItem.amount,
          action:
            transactionItem.instruction === "BUY"
              ? OptionAction.Buy
              : OptionAction.Sell,
          openClose: getOpenClose(),
          optionType:
            instrument.putCall === "CALL" ? OptionType.Call : OptionType.Put,
          expirationDate: new Date(instrument.optionExpirationDate),
          strikePrice,
          fees: totalFees,
          description: instrument?.description ?? null,
          dateAdded: new Date(),
          cusip: instrument.cusip ?? null,
          transactionDateEpoch: getUnixTime(
            new Date(transaction.transactionDate)
          ),
          expirationDateEpoch: getUnixTime(
            new Date(instrument.optionExpirationDate)
          ),
          dateAddedEpoch: getUnixTime(new Date()),
        };
      })
    );

    await this.prisma.optionTransaction.createMany({
      data: optionTransactions,
    });
  }

  async createEquityTransactions(transactions: TdAmeritradeTransaction[]) {
    const equityTransactions = compact(
      map(transactions, (transaction) => {
        const { fees, transactionItem } = transaction;
        const { instrument } = transactionItem;

        if (
          instrument.assetType !== "EQUITY" ||
          !["BUY", "SELL"].includes(transactionItem.instruction) ||
          !instrument.symbol
        ) {
          return null;
        }
        const totalFees = sum([
          fees.rFee +
            fees.additionalFee +
            fees.cdscFee +
            fees.regFee +
            fees.otherCharges +
            fees.commission +
            fees.optRegFee +
            fees.secFee,
        ]);

        function getOpenClose() {
          if (transactionItem.positionEffect === "OPENING") {
            return OpenClose.Open;
          }
          if (transactionItem.positionEffect === "CLOSING") {
            return OpenClose.Close;
          }
          return null;
        }

        return {
          userId: this.userId,
          source: TransactionSource.TdAmeritrade,
          sourceTransactionId: String(transaction.transactionId),
          symbol: instrument.symbol,
          transactionDate: new Date(transaction.transactionDate),
          netPrice: transaction.netAmount,
          quantity: transactionItem.amount,
          position:
            transactionItem.instruction === "BUY"
              ? Position.Long
              : Position.Short,
          openClose: getOpenClose(),
          fees: totalFees,
          description: instrument?.description ?? null,
          dateAdded: new Date(),
          transactionDateEpoch: getUnixTime(
            new Date(transaction.transactionDate)
          ),
          dateAddedEpoch: getUnixTime(new Date()),
        };
      })
    );

    await this.prisma.equityTransaction.createMany({
      data: equityTransactions,
    });
  }

  getExpiryTransactions(transactions: TdAmeritradeTransaction[]) {
    return compact(
      map(transactions, (transaction) => {
        if (
          transaction.description === "REMOVAL OF OPTION DUE TO EXPIRATION" ||
          transaction.description === "REMOVAL OF OPTION DUE TO ASSIGNMENT"
        ) {
          return transaction;
        }
      })
    );
  }

  async createExpiryTransactions(transactions: TdAmeritradeTransaction[]) {
    const optionTransactions = compact(
      await Promise.all(
        map(transactions, async (transaction) => {
          const { fees, transactionItem } = transaction;
          const { instrument } = transactionItem;
          if (!instrument.cusip) {
            return null;
          }

          const optionTransaction =
            await this.prisma.optionTransaction.findFirst({
              where: {
                userId: this.userId,
                cusip: instrument.cusip,
              },
            });

          if (!optionTransaction) {
            return null;
          }

          const totalFees = sum([
            fees.rFee +
              fees.additionalFee +
              fees.cdscFee +
              fees.regFee +
              fees.otherCharges +
              fees.commission +
              fees.optRegFee +
              fees.secFee,
          ]);

          return {
            userId: this.userId,
            source: TransactionSource.TdAmeritrade,
            sourceTransactionId: String(transaction.transactionId),
            underlyingSymbol: optionTransaction.underlyingSymbol,
            transactionDate: new Date(transaction.transactionDate),
            netPrice: transaction.netAmount,
            quantity: transactionItem.amount,
            action:
              transaction.description === "REMOVAL OF OPTION DUE TO EXPIRATION"
                ? OptionAction.Expire
                : OptionAction.Assign,
            openClose: OpenClose.Close,
            optionType: optionTransaction.optionType,
            expirationDate: optionTransaction.expirationDate,
            strikePrice: optionTransaction.strikePrice,
            fees: totalFees,
            description: optionTransaction.description,
            dateAdded: new Date(),
            transactionDateEpoch: getUnixTime(
              new Date(transaction.transactionDate)
            ),
            expirationDateEpoch: optionTransaction.expirationDateEpoch,
            dateAddedEpoch: getUnixTime(new Date()),
          };
        })
      )
    );

    await this.prisma.optionTransaction.createMany({
      data: optionTransactions,
    });
  }

  async syncTransactions() {
    const token = await this.getAccessToken();
    const firstImportYear = token.lastSync ? getYear(token.lastSync) : null;
    await this.fullImport(firstImportYear);

    await this.prisma.tDAmeritradeToken.update({
      where: { id: token.id },
      data: {
        lastSync: new Date(),
      },
    });
  }
}

function parseStrikePriceFromDescription(description?: string) {
  if (!description) {
    return null;
  }
  const splitDescription = description.split(" ");
  const strikePrice = splitDescription[4];
  if (isNaN(Number(strikePrice))) {
    return null;
  }
  return Number(strikePrice);
}
