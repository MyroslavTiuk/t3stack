import {
  OptionType,
  type EquityTransaction,
  type OptionTransaction,
  type PrismaClient,
  type Strategy,
  Position,
  OptionAction,
  TradingStrategy,
} from "trackgreeks-database";
import { buildDefaultEquityStrategies } from "./equityStrategies";
import { buildDefaultOptionStrategies } from "./optionStrategies";
import { formatDate } from "~/utils/format";
import { uniq, groupBy, map, sortBy, flatMap } from "lodash";
import { getOptionPrice, getStockPrice } from "../tradier";
import { buildSpreads } from "./spreads";
import { buildCoveredCalls } from "./coveredCalls";
import { z } from "zod";

export async function buildDefaultStrategies(
  prisma: PrismaClient,
  userId: string
) {
  await Promise.all([
    buildDefaultEquityStrategies(prisma, userId),
    buildDefaultOptionStrategies(prisma, userId),
  ]);
  await Promise.all([
    buildSpreads(prisma, userId),
    buildCoveredCalls(prisma, userId),
  ]);
}

export async function buildOptionStrategiesForSymbol(
  prisma: PrismaClient,
  userId: string,
  option: {
    underlyingSymbol: string;
    strikePrice: number;
    expirationDate: Date;
    optionType: OptionType;
  }
) {
  await buildDefaultOptionStrategies(prisma, userId, option);
  await Promise.all([
    buildSpreads(prisma, userId, option.underlyingSymbol),
    buildCoveredCalls(prisma, userId, option.underlyingSymbol),
  ]);
}

export async function buildEquityStrategiesForSymbol(
  prisma: PrismaClient,
  userId: string,
  symbol: string
) {
  await buildDefaultEquityStrategies(prisma, userId, symbol);
  await buildCoveredCalls(prisma, userId, symbol);
}

export enum StrategyStatus {
  Open = "Open",
  Closed = "Closed",
}

export interface ComputedStrategy extends StrategyWithTransactions {
  tickers: string[];
  quantity: number;
  price: number;
  currentValue: number;
  profit: number;
  status: StrategyStatus;
  profitHistory: { date: Date; profit: number }[];
}

export type StrategyWithTransactions = Strategy & {
  optionTransactions: OptionTransaction[];
  equityTransactions: EquityTransaction[];
};

export async function computeStrategy(
  strategy: StrategyWithTransactions,
  useTradier = true
): Promise<ComputedStrategy> {
  const price = computePrice(strategy);
  const currentValue = await computeCurrentValue(strategy, useTradier);
  const currentProfit = currentValue + price;
  const profitHistory = computeProfitHistory({
    strategy,
    currentProfit: strategy.endDate ? null : currentProfit,
  });
  return {
    ...strategy,
    tickers: [
      ...uniq(
        strategy.equityTransactions.map((transaction) => transaction.symbol)
      ),
      ...uniq(
        strategy.optionTransactions.map((transaction) =>
          buildOptionName(transaction)
        )
      ),
    ],
    quantity: computeQuantity(strategy),
    price,
    currentValue,
    profit: currentProfit,
    status: strategy.endDate ? StrategyStatus.Closed : StrategyStatus.Open,
    profitHistory,
  };
}

function buildOptionName(transaction: OptionTransaction) {
  return `${transaction.underlyingSymbol} ${transaction.strikePrice} ${
    transaction.optionType === OptionType.Call ? "C" : "P"
  }  ${formatDate(transaction.expirationDate)}`;
}

export function computeQuantity(strategy: StrategyWithTransactions) {
  if (strategy.equityTransactions.length > 0) {
    const maxLongQuantity = strategy.equityTransactions.reduce(
      (acc, transaction) => {
        if (transaction.position === Position.Long) {
          return acc + transaction.quantity;
        }
        return acc;
      },
      0
    );
    const maxShortQuantity = strategy.equityTransactions.reduce(
      (acc, transaction) => {
        if (transaction.position === Position.Short) {
          return acc + transaction.quantity;
        }
        return acc;
      },
      0
    );
    return Math.max(maxLongQuantity, maxShortQuantity);
  }
  const maxLongQuantity = strategy.optionTransactions.reduce(
    (acc, transaction) => {
      if (transaction.action === OptionAction.Buy) {
        return acc + transaction.quantity;
      }
      return acc;
    },
    0
  );
  const maxShortQuantity = strategy.optionTransactions.reduce(
    (acc, transaction) => {
      if (transaction.action === OptionAction.Sell) {
        return acc + transaction.quantity;
      }
      return acc;
    },
    0
  );
  return Math.max(maxLongQuantity, maxShortQuantity);
}

function computePrice(strategy: StrategyWithTransactions) {
  const equityPrice = strategy.equityTransactions.reduce(
    (acc, transaction) => acc + transaction.netPrice,
    0
  );
  const optionPrice = strategy.optionTransactions.reduce(
    (acc, transaction) => acc + transaction.netPrice,
    0
  );
  return equityPrice + optionPrice;
}

async function computeCurrentValue(
  strategy: StrategyWithTransactions,
  useTradier = true
) {
  // TODO: this can be optimized by batching and caching API requests to Tradier
  // TODO: show warning to user when stock/option price cannot be fetched

  const equityTransactionsBySymbol = groupBy(
    strategy.equityTransactions,
    (transaction) => transaction.symbol
  );
  const currentEquityQuantities = map(
    equityTransactionsBySymbol,
    (transactions) =>
      transactions.reduce(
        (acc, transaction) => {
          if (transaction.position === Position.Long) {
            return {
              symbol: transaction.symbol,
              quantity: acc.quantity + transaction.quantity,
              fallbackStockPrice: transaction.netPrice / transaction.quantity,
            };
          }
          return {
            symbol: transaction.symbol,
            quantity: acc.quantity - transaction.quantity,
            fallbackStockPrice: transaction.netPrice / transaction.quantity,
          };
        },
        { symbol: "", quantity: 0, fallbackStockPrice: 0 }
      )
  );

  const currentEquityValues = await Promise.all(
    map(currentEquityQuantities, async (equity) => {
      return {
        symbol: equity.symbol,
        quantity: equity.quantity,
        stockPrice:
          equity.quantity !== 0
            ? await getStockPriceWithFallback(
                equity.symbol,
                equity.fallbackStockPrice,
                useTradier
              )
            : 0,
      };
    })
  );
  const currentEquityValue = currentEquityValues.reduce((acc, currentValue) => {
    return acc + currentValue.quantity * (currentValue.stockPrice ?? 0);
  }, 0);

  const optionTransactionsByOption = groupBy(
    strategy.optionTransactions,
    (transaction) =>
      `${transaction.underlyingSymbol}-${transaction.strikePrice}-${transaction.expirationDate}-${transaction.optionType}`
  );

  const currentOptionQuantities = map(
    optionTransactionsByOption,
    (transactions) =>
      transactions.reduce<{
        symbol: string;
        strikePrice: number;
        expirationDate: Date;
        optionType: OptionType;
        quantity: number;
        fallbackPrice: number;
      }>(
        (acc, transaction) => {
          const quantity =
            transaction.action === OptionAction.Buy
              ? acc.quantity + transaction.quantity
              : acc.quantity - transaction.quantity;
          return {
            symbol: transaction.underlyingSymbol,
            strikePrice: transaction.strikePrice,
            expirationDate: transaction.expirationDate,
            optionType: transaction.optionType,
            quantity,
            fallbackPrice: transaction.netPrice / transaction.quantity / 100,
          };
        },
        {
          symbol: "",
          strikePrice: 0,
          expirationDate: new Date(),
          optionType: OptionType.Call,
          quantity: 0,
          fallbackPrice: 0,
        }
      )
  );

  const currentOptionValues = await Promise.all(
    map(currentOptionQuantities, async (option) => {
      return {
        quantity: option.quantity,
        optionPrice:
          option.quantity !== 0
            ? await getOptionPriceWithFallback(
                {
                  symbol: option.symbol,
                  strikePrice: option.strikePrice,
                  expirationDate: option.expirationDate,
                  optionType: option.optionType,
                },
                option.fallbackPrice,
                useTradier
              )
            : 0,
      };
    })
  );

  const currentOptionValue = currentOptionValues.reduce((acc, currentValue) => {
    return acc + currentValue.quantity * (currentValue.optionPrice ?? 0) * 100;
  }, 0);

  return currentEquityValue + currentOptionValue;
}

async function getStockPriceWithFallback(
  symbol: string,
  fallbackPrice: number,
  useTradier = true
) {
  if (useTradier) {
    try {
      return await getStockPrice(symbol);
    } catch (e) {
      return fallbackPrice;
    }
  }
  return fallbackPrice;
}

async function getOptionPriceWithFallback(
  contract: {
    symbol: string;
    strikePrice: number;
    expirationDate: Date;
    optionType: OptionType;
  },
  fallbackPrice: number,
  useTradier = true
) {
  if (useTradier) {
    try {
      return await getOptionPrice(contract);
    } catch (e) {
      return fallbackPrice;
    }
  }
  return fallbackPrice;
}

function computeProfitHistory({
  strategy,
  currentProfit,
}: {
  strategy: StrategyWithTransactions;
  currentProfit: number | null;
}) {
  const byOption = groupBy(
    strategy.optionTransactions,
    (transaction) =>
      `${transaction.underlyingSymbol}-${transaction.strikePrice}-${transaction.expirationDate}-${transaction.optionType}`
  );
  const optionProfitChanges = flatMap(Object.keys(byOption), (option) => {
    const optionTransactions = sortBy(byOption[option], "transactionDate");
    return computeOptionProfitChanges(optionTransactions);
  });

  const bySymbol = groupBy(
    strategy.equityTransactions,
    (transaction) => transaction.symbol
  );
  const equityProfitChanges = flatMap(Object.keys(bySymbol), (symbol) => {
    const equityTransactions = sortBy(bySymbol[symbol], "transactionDate");
    return computeEquityProfitChanges(equityTransactions);
  });

  const profitChanges = sortBy(
    [...optionProfitChanges, ...equityProfitChanges],
    "date"
  );

  const { history } = profitChanges.reduce(
    (
      acc: { profit: number; history: { date: Date; profit: number }[] },
      change
    ) => {
      acc.profit = acc.profit + change.profitChange;
      acc.history.push({
        date: change.date,
        profit: acc.profit,
      });
      return acc;
    },
    {
      profit: 0,
      history: [],
    }
  );

  if (currentProfit) {
    history.push({
      date: new Date(),
      profit: currentProfit,
    });
  }

  return history;
}

function computeOptionProfitChanges(transactions: OptionTransaction[]) {
  let contractCount = 0;
  let price = 0;
  let prevProfit = 0;

  return transactions.map((transaction) => {
    price += transaction.netPrice;
    const contractPrice = Math.abs(transaction.netPrice) / transaction.quantity;
    if (transaction.action === OptionAction.Buy) {
      contractCount += transaction.quantity;
    } else if (transaction.action === OptionAction.Sell) {
      contractCount -= transaction.quantity;
    } else {
      contractCount = 0;
    }
    const totalValue = contractPrice * contractCount;
    const profit = totalValue + price;
    const profitChange = profit - prevProfit;
    prevProfit = profit;

    return {
      date: transaction.transactionDate,
      profitChange,
    };
  });
}

function computeEquityProfitChanges(transactions: EquityTransaction[]) {
  let shareCount = 0;
  let price = 0;
  let prevProfit = 0;

  return transactions.map((transaction) => {
    price += transaction.netPrice;
    const sharePrice = Math.abs(transaction.netPrice) / transaction.quantity;
    if (transaction.position === Position.Long) {
      shareCount += transaction.quantity;
    } else {
      shareCount -= transaction.quantity;
    }
    const totalValue = sharePrice * shareCount;
    const profit = totalValue + price;
    const profitChange = profit - prevProfit;
    prevProfit = profit;

    return {
      date: transaction.transactionDate,
      profitChange,
    };
  });
}

export const strategyInputSchema = z.object({
  id: z.string().optional(),
  optionTransactionIds: z.array(z.string()),
  equityTransactionIds: z.array(z.string()),
  description: z.string().optional(),
  tradingStrategy: z.nativeEnum(TradingStrategy),
});
export type StrategyInput = z.infer<typeof strategyInputSchema>;
