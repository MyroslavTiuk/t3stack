import { getUnixTime } from "date-fns";
import { flatMap, groupBy } from "lodash";
import {
  type PrismaClient,
  TradingStrategy,
  type OptionTransaction,
  OptionAction,
  type OptionType,
} from "trackgreeks-database";

export async function buildDefaultOptionStrategies(
  prisma: PrismaClient,
  userId: string,
  option?: {
    underlyingSymbol: string;
    strikePrice: number;
    expirationDate: Date;
    optionType: OptionType;
  }
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
      optionTransactions: {
        some: option ? option : {},
      },
    },
  });

  const transactions = await prisma.optionTransaction.findMany({
    where: {
      userId,
      ...option,
    },
    orderBy: [
      { underlyingSymbol: "asc" },
      { strikePrice: "asc" },
      { expirationDate: "asc" },
      { optionType: "asc" },
      { transactionDate: "asc" },
    ],
  });

  if (transactions.length === 0) {
    return 0;
  }

  const byOption = groupBy(
    transactions,
    (transaction) =>
      `${transaction.underlyingSymbol}-${transaction.strikePrice}-${transaction.expirationDate}-${transaction.optionType}`
  );
  const defaultStrategies = flatMap(Object.keys(byOption), (option) =>
    buildOptionStrategies(byOption[option])
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
        optionTransactions: {
          connect: strategy.transactionIds.map((id) => ({ id })),
        },
      },
    });
  });
  await Promise.all(writes);

  return defaultStrategies.length;
}

function buildOptionStrategies(transactions: OptionTransaction[]) {
  const strategies = [];
  let contractCount = 0;
  let startDate: Date | null = null;
  let strategyTransactions: OptionTransaction[] = [];

  transactions.forEach((transaction) => {
    if (startDate === null) {
      startDate = transaction.transactionDate;
    }
    strategyTransactions.push(transaction);

    if (transaction.action === OptionAction.Buy) {
      contractCount += transaction.quantity;
    } else if (transaction.action === OptionAction.Sell) {
      contractCount -= transaction.quantity;
    } else {
      // assign or expire
      contractCount = 0;
    }

    if (contractCount === 0) {
      strategies.push({
        transactionIds: strategyTransactions.map(
          (transaction) => transaction.id
        ),
        startDate,
        endDate: transaction.transactionDate,
        tradingStrategy:
          strategyTransactions[0].action === OptionAction.Buy
            ? TradingStrategy.BuyAndSell
            : TradingStrategy.ShortAndBuy,
        startDateEpoch: getUnixTime(startDate),
        endDateEpoch: getUnixTime(transaction.transactionDate),
      });
      strategyTransactions = [];
      startDate = null;
    }
  });

  if (contractCount !== 0 && startDate !== null) {
    strategies.push({
      transactionIds: strategyTransactions.map((transaction) => transaction.id),
      startDate,
      endDate: null,
      tradingStrategy:
        strategyTransactions[0].action === OptionAction.Buy
          ? TradingStrategy.BuyAndHold
          : TradingStrategy.ShortAndHold,
      startDateEpoch: getUnixTime(startDate),
      endDateEpoch: null,
    });
  }

  return strategies;
}
