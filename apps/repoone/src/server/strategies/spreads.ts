import { getUnixTime } from "date-fns";
import { compact, flatMap, groupBy, map, orderBy, sortBy } from "lodash";
import {
  OptionType,
  TradingStrategy,
  type PrismaClient,
} from "opcalc-database";
import { computeQuantity, type StrategyWithTransactions } from "./strategies";

export async function buildSpreads(
  prisma: PrismaClient,
  userId: string,
  underlyingSymbol?: string
) {
  await prisma.strategy.deleteMany({
    where: {
      userId,
      tradingStrategy: {
        in: [
          TradingStrategy.LongCallSpread,
          TradingStrategy.LongPutSpread,
          TradingStrategy.ShortCallSpread,
          TradingStrategy.ShortPutSpread,
        ],
      },
      optionTransactions: {
        some: underlyingSymbol ? { underlyingSymbol } : {},
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
      optionTransactions: {
        some: underlyingSymbol ? { underlyingSymbol } : {},
      },
    },
    include: {
      optionTransactions: true,
      equityTransactions: true,
    },
  });

  const optionStrategies = defaultStrategies.filter(
    (strategy) => strategy.optionTransactions.length > 0
  );

  const bySymbolExpiryType = groupBy(
    optionStrategies,
    (strategy) =>
      `${strategy.optionTransactions[0].underlyingSymbol}-${strategy.optionTransactions[0].expirationDate}-${strategy.optionTransactions[0].optionType}`
  );

  const candidateLists = compact(
    map(bySymbolExpiryType, (strategies) =>
      strategies.length > 1 ? strategies : null
    )
  );

  const spreads = flatMap(candidateLists, (candidates) =>
    findSpreads(candidates)
  );

  const writes = spreads.map(async (strategy) => {
    return prisma.strategy.create({
      data: {
        userId,
        tradingStrategy: strategy.tradingStrategy,
        startDate: strategy.startDate,
        endDate: strategy.endDate,
        startDateEpoch: getUnixTime(strategy.startDate),
        endDateEpoch: strategy.endDate ? getUnixTime(strategy.endDate) : null,
        optionTransactions: {
          connect: strategy.transactionIds.map((id) => ({ id })),
        },
      },
    });
  });
  await Promise.all(writes);
}

function findSpreads(candidates: StrategyWithTransactions[]) {
  const longStrategies = sortBy(
    candidates.filter(
      (strategy) =>
        strategy.tradingStrategy === TradingStrategy.BuyAndHold ||
        strategy.tradingStrategy === TradingStrategy.BuyAndSell
    ),
    (strategy) => strategy.optionTransactions[0].transactionDate
  );

  const shortStrategies = sortBy(
    candidates.filter(
      (strategy) =>
        strategy.tradingStrategy === TradingStrategy.ShortAndBuy ||
        strategy.tradingStrategy === TradingStrategy.ShortAndHold
    ),
    (strategy) => strategy.optionTransactions[0].transactionDate
  );

  if (longStrategies.length === 0 || shortStrategies.length === 0) {
    return [];
  }

  const spreads: {
    transactionIds: string[];
    startDate: Date;
    endDate: Date | null;
    tradingStrategy: TradingStrategy;
    startDateEpoch: number;
    endDateEpoch: number | null;
  }[] = [];

  longStrategies.forEach((longStrategy) => {
    shortStrategies.forEach((shortStrategy) => {
      if (
        computeQuantity(longStrategy) === computeQuantity(shortStrategy) &&
        !(
          shortStrategy.endDate &&
          shortStrategy.endDate < longStrategy.startDate
        ) &&
        !(
          longStrategy.endDate && longStrategy.endDate < shortStrategy.startDate
        ) &&
        longStrategy.optionTransactions[0].strikePrice !==
          shortStrategy.optionTransactions[0].strikePrice
      ) {
        const transactions = orderBy(
          [
            ...longStrategy.optionTransactions,
            ...shortStrategy.optionTransactions,
          ],
          "transactionDate"
        );
        const getEndDate = () => {
          if (!longStrategy.endDate || !shortStrategy.endDate) {
            return null;
          }
          return longStrategy.endDate > shortStrategy.endDate
            ? longStrategy.endDate
            : shortStrategy.endDate;
        };
        const endDate = getEndDate();
        spreads.push({
          transactionIds: transactions.map((transaction) => transaction.id),
          startDate: transactions[0].transactionDate,
          endDate,
          tradingStrategy: getSpreadType(longStrategy, shortStrategy),
          startDateEpoch: getUnixTime(transactions[0].transactionDate),
          endDateEpoch: endDate ? getUnixTime(endDate) : null,
        });
      }
    });
  });
  return spreads;
}

function getSpreadType(
  longStrategy: StrategyWithTransactions,
  shortStrategy: StrategyWithTransactions
) {
  if (longStrategy.optionTransactions[0].optionType === OptionType.Call) {
    if (
      longStrategy.optionTransactions[0].strikePrice >
      shortStrategy.optionTransactions[0].strikePrice
    ) {
      return TradingStrategy.ShortCallSpread;
    } else {
      return TradingStrategy.LongCallSpread;
    }
  } else {
    if (
      longStrategy.optionTransactions[0].strikePrice >
      shortStrategy.optionTransactions[0].strikePrice
    ) {
      return TradingStrategy.LongPutSpread;
    } else {
      return TradingStrategy.ShortPutSpread;
    }
  }
}
