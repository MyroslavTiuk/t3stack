import { getUnixTime } from "date-fns";
import { flatMap, groupBy } from "lodash";
import {
  type EquityTransaction,
  type PrismaClient,
  TradingStrategy,
  Position,
} from "trackgreeks-database";

export async function buildDefaultEquityStrategies(
  prisma: PrismaClient,
  userId: string,
  symbol?: string
) {
  await prisma.strategy.deleteMany({
    where: {
      userId,
      tradingStrategy: {
        in: [
          TradingStrategy.BuyAndHold,
          TradingStrategy.BuyAndSell,
          TradingStrategy.ShortAndHold,
          TradingStrategy.ShortAndBuy,
        ],
      },
      equityTransactions: {
        some: symbol ? { symbol } : {},
      },
    },
  });

  const transactions = await prisma.equityTransaction.findMany({
    where: {
      userId,
      symbol,
    },
    orderBy: [{ symbol: "asc" }, { transactionDate: "asc" }],
  });

  if (transactions.length === 0) {
    return 0;
  }

  const bySymbol = groupBy(transactions, (transaction) => transaction.symbol);
  const defaultStrategies = flatMap(Object.keys(bySymbol), (symbol) =>
    buildEquityStrategies(bySymbol[symbol])
  );

  const writes = defaultStrategies.map(async (strategy) => {
    return prisma.strategy.create({
      data: {
        userId,
        tradingStrategy: strategy.tradingStrategy,
        startDate: strategy.startDate,
        endDate: strategy.endDate,
        startDateEpoch: getUnixTime(strategy.startDate),
        endDateEpoch: strategy.endDate ? getUnixTime(strategy.endDate) : null,
        equityTransactions: {
          connect: strategy.transactionIds.map((id) => ({ id })),
        },
      },
    });
  });
  await Promise.all(writes);

  return defaultStrategies.length;
}

function buildEquityStrategies(transactions: EquityTransaction[]) {
  const strategies = [];
  let shareCount = 0;
  let startDate: Date | null = null;
  let strategyTransactions: EquityTransaction[] = [];

  transactions.forEach((transaction) => {
    if (startDate === null) {
      startDate = transaction.transactionDate;
    }
    strategyTransactions.push(transaction);

    if (transaction.position === "Long") {
      shareCount += transaction.quantity;
    } else {
      shareCount -= transaction.quantity;
    }

    if (shareCount === 0) {
      strategies.push({
        transactionIds: strategyTransactions.map(
          (transaction) => transaction.id
        ),
        startDate,
        endDate: transaction.transactionDate,
        tradingStrategy:
          strategyTransactions[0].position === Position.Long
            ? TradingStrategy.BuyAndSell
            : TradingStrategy.ShortAndBuy,
        startDateEpoch: getUnixTime(startDate),
        endDateEpoch: getUnixTime(transaction.transactionDate),
      });
      strategyTransactions = [];
      startDate = null;
    }
  });

  if (shareCount !== 0 && startDate !== null) {
    strategies.push({
      transactionIds: strategyTransactions.map((transaction) => transaction.id),
      startDate,
      endDate: null,
      tradingStrategy:
        strategyTransactions[0].position === Position.Long
          ? TradingStrategy.BuyAndHold
          : TradingStrategy.ShortAndHold,
      startDateEpoch: getUnixTime(startDate),
      endDateEpoch: null,
    });
  }

  return strategies;
}
