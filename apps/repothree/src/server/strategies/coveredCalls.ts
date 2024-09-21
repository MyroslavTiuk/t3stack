import { getUnixTime } from "date-fns";
import { orderBy, sortBy } from "lodash";
import {
  type PrismaClient,
  TradingStrategy,
  OptionType,
  Position,
} from "trackgreeks-database";
import { type StrategyWithTransactions } from "./strategies";

export async function buildCoveredCalls(
  prisma: PrismaClient,
  userId: string,
  symbol?: string
) {
  await prisma.strategy.deleteMany({
    where: {
      userId,
      tradingStrategy: TradingStrategy.CoveredCall,
      equityTransactions: {
        some: symbol ? { symbol } : {},
      },
    },
  });

  const defaultStrategies = await prisma.strategy.findMany({
    where: {
      userId,
      tradingStrategy: {
        in: [
          TradingStrategy.BuyAndHold,
          TradingStrategy.ShortAndHold,
          TradingStrategy.BuyAndSell,
          TradingStrategy.ShortAndBuy,
        ],
      },
      OR: [
        {
          equityTransactions: {
            some: symbol ? { symbol } : {},
          },
        },
        {
          optionTransactions: {
            some: symbol ? { underlyingSymbol: symbol } : {},
          },
        },
      ],
    },
    include: {
      optionTransactions: true,
      equityTransactions: true,
    },
  });

  const shortCalls = defaultStrategies.filter(
    (strategy) =>
      strategy.optionTransactions.length > 0 &&
      strategy.optionTransactions[0].optionType === OptionType.Call &&
      (strategy.tradingStrategy === TradingStrategy.ShortAndHold ||
        strategy.tradingStrategy === TradingStrategy.ShortAndBuy)
  );

  const longEquityStrategies = defaultStrategies.filter(
    (strategy) =>
      strategy.equityTransactions.length > 0 &&
      (strategy.tradingStrategy === TradingStrategy.BuyAndHold ||
        strategy.tradingStrategy === TradingStrategy.BuyAndSell)
  );

  const coveredCalls: {
    optionTransactionIds: string[];
    equityTransactionIds: string[];
    startDate: Date;
    endDate: Date | null;
    tradingStrategy: TradingStrategy;
    startDateEpoch: number;
    endDateEpoch: number | null;
  }[] = [];
  shortCalls.forEach((shortCall) => {
    longEquityStrategies.forEach((longEquity) => {
      if (
        shortCall.optionTransactions[0].underlyingSymbol ===
          longEquity.equityTransactions[0].symbol &&
        calculateQuantityAtDate(
          longEquity,
          shortCall.optionTransactions[0].transactionDate
        ) >=
          100 * shortCall.optionTransactions[0].quantity
      ) {
        const transactions = orderBy(
          [...shortCall.optionTransactions, ...longEquity.equityTransactions],
          "transactionDate"
        );
        coveredCalls.push({
          optionTransactionIds: shortCall.optionTransactions.map(
            (transaction) => transaction.id
          ),
          equityTransactionIds: longEquity.equityTransactions.map(
            (transaction) => transaction.id
          ),
          startDate: transactions[0].transactionDate,
          endDate: shortCall.endDate,
          tradingStrategy: TradingStrategy.CoveredCall,
          startDateEpoch: getUnixTime(transactions[0].transactionDate),
          endDateEpoch: shortCall.endDate
            ? getUnixTime(shortCall.endDate)
            : null,
        });
      }
    });
  });

  const writes = coveredCalls.map(async (strategy) => {
    return prisma.strategy.create({
      data: {
        userId,
        tradingStrategy: strategy.tradingStrategy,
        startDate: strategy.startDate,
        endDate: strategy.endDate,
        startDateEpoch: getUnixTime(strategy.startDate),
        endDateEpoch: strategy.endDate ? getUnixTime(strategy.endDate) : null,
        optionTransactions: {
          connect: strategy.optionTransactionIds.map((id) => ({ id })),
        },
        equityTransactions: {
          connect: strategy.equityTransactionIds.map((id) => ({ id })),
        },
      },
    });
  });
  await Promise.all(writes);
}

function calculateQuantityAtDate(equity: StrategyWithTransactions, date: Date) {
  const sortedTransactions = sortBy(equity.equityTransactions, [
    "transactionDate",
  ]).filter((transaction) => transaction.transactionDate <= date);
  return sortedTransactions.reduce(
    (acc, transaction) =>
      transaction.position === Position.Long
        ? (acc += transaction.quantity)
        : (acc -= transaction.quantity),
    0
  );
}
