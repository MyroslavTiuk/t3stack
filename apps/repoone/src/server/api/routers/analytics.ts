import { format } from "date-fns";
import { groupBy, map, sortBy, sumBy } from "lodash";
import { OpenClose, OptionType, TradingStrategy } from "opcalc-database";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  type ComputedStrategy,
  computeStrategy,
} from "~/server/strategies/strategies";

function groupByLast5Months(transactions: ComputedStrategy[]) {
  const result = [];

  // Create a mapping of month to profit
  const monthToProfitMap = new Map();

  transactions.forEach((transaction) => {
    const transactionDate = transaction.endDate;
    if (!transactionDate) return null;
    const monthKey = `${transactionDate.getFullYear()}-${
      transactionDate.getMonth() + 1
    }`;

    // Check if the transaction is within the last 5 months
    const currentDate = new Date();
    const last5Months = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 4,
      1
    );

    if (transactionDate >= last5Months) {
      // Add or update profit for the month
      if (monthToProfitMap.has(monthKey)) {
        monthToProfitMap.set(
          monthKey,
          monthToProfitMap.get(monthKey) + transaction.profit
        );
      } else {
        monthToProfitMap.set(monthKey, transaction.profit);
      }
    }
  });

  // Add entries for the last 5 months, filling in 0 profit for months with no data
  const currentDate = new Date();
  for (let i = 4; i >= 0; i--) {
    const monthKey =
      currentDate.getMonth() - i + 1 < 1
        ? `${currentDate.getFullYear() - 1}-${13 - i}`
        : `${currentDate.getFullYear()}-${currentDate.getMonth() - i + 1}`;
    if (!monthToProfitMap.has(monthKey)) {
      result.push({
        name: monthKey,
        profit: 0,
      });
    } else {
      result.push({
        name: monthKey,
        profit: monthToProfitMap.get(monthKey),
      });
    }
  }

  return result;
}

function groupByCurrentMonthDays(transactions: ComputedStrategy[]) {
  const result: any[] = [];

  // Create a mapping of day to profit
  const dayToProfitMap = new Map();

  transactions.forEach((transaction) => {
    const transactionDate = transaction.endDate;
    if (!transactionDate) return null;
    // Check if the transaction is within the current month
    const currentDate = new Date();
    if (
      transactionDate.getMonth() === currentDate.getMonth() &&
      transactionDate.getFullYear() === currentDate.getFullYear()
    ) {
      const dayKey = transactionDate.getDate();

      // Add or update profit for the day
      if (dayToProfitMap.has(dayKey)) {
        dayToProfitMap.set(
          dayKey,
          dayToProfitMap.get(dayKey) + transaction.profit
        );
      } else {
        dayToProfitMap.set(dayKey, transaction.profit);
      }
    }
  });

  // Convert the map to an array of objects
  dayToProfitMap.forEach((profit, dayKey) => {
    result.push({
      day: dayKey,
      profit: profit,
    });
  });

  return result;
}

export const analyticsRouter = createTRPCRouter({
  getSharesCallsPuts: protectedProcedure.query(async ({ ctx }) => {
    const optionTypeCounts = await ctx.prisma.optionTransaction.groupBy({
      by: ["optionType"],
      where: { userId: ctx.session.user.id },
      _count: {
        optionType: true,
      },
    });

    if (optionTypeCounts.length === 0) return [];

    const callCount =
      optionTypeCounts[0].optionType === OptionType.Call
        ? optionTypeCounts[0]._count.optionType
        : optionTypeCounts[1]
        ? optionTypeCounts[1]._count.optionType
        : 0;
    const putCount =
      optionTypeCounts[0].optionType === OptionType.Put
        ? optionTypeCounts[0]._count.optionType
        : optionTypeCounts[1]
        ? optionTypeCounts[1]._count.optionType
        : 0;

    const equityCount = await ctx.prisma.equityTransaction.count({
      where: { userId: ctx.session.user.id },
    });

    const result = [];
    if (callCount !== 0) {
      result.push({ name: "Calls", value: callCount });
    }
    if (putCount !== 0) {
      result.push({ name: "Puts", value: putCount });
    }
    if (equityCount !== 0) {
      result.push({ name: "Shares", value: equityCount });
    }

    return result;
  }),

  getQuantityBySymbol: protectedProcedure.query(async ({ ctx }) => {
    const optionsSymbolCount = await ctx.prisma.optionTransaction.groupBy({
      by: ["underlyingSymbol"],
      where: { userId: ctx.session.user.id, openClose: OpenClose.Open },
      _sum: {
        quantity: true,
      },
      orderBy: [
        {
          _sum: {
            quantity: "desc",
          },
        },
      ],
    });

    const stocksSymbolCount = await ctx.prisma.equityTransaction.groupBy({
      by: ["symbol"],
      where: { userId: ctx.session.user.id, openClose: OpenClose.Open },
      _sum: {
        quantity: true,
      },
      orderBy: [
        {
          _sum: {
            quantity: "desc",
          },
        },
      ],
    });

    return {
      stocks: stocksSymbolCount,
      options: optionsSymbolCount,
    };
  }),

  getIncomeByStock: protectedProcedure.query(async ({ ctx }) => {
    const strategies = await ctx.prisma.strategy.findMany({
      where: {
        userId: ctx.session.user.id,
        tradingStrategy: {
          in: [
            TradingStrategy.BuyAndHold,
            TradingStrategy.BuyAndSell,
            TradingStrategy.ShortAndBuy,
            TradingStrategy.ShortAndHold,
          ],
        },
      },
      include: {
        equityTransactions: true,
        optionTransactions: true,
      },
    });

    const computedStrategies = await Promise.all(
      strategies.map(async (strategy) => await computeStrategy(strategy, false))
    );

    const bySymbol = groupBy(
      computedStrategies.filter(
        (s) =>
          s.equityTransactions.length !== 0 || s.optionTransactions.length !== 0
      ),
      (strategy) =>
        strategy.equityTransactions.length > 0
          ? strategy.equityTransactions[0].symbol
          : strategy.optionTransactions[0].underlyingSymbol
    );

    const profitBySymbol = map(Object.keys(bySymbol), (symbol) => {
      const strategies = bySymbol[symbol];
      const profit = strategies.reduce((sum, strategy) => {
        return sum + strategy.profit;
      }, 0);
      return { name: symbol, value: profit };
    });

    const sorted = sortBy(profitBySymbol, "value");
    const worst = sorted.slice(0, 5);
    const best = sorted.reverse().slice(0, 5);
    return { worst, best };
  }),

  getIncomeByWeekday: protectedProcedure.query(async ({ ctx }) => {
    const strategies = await ctx.prisma.strategy.findMany({
      where: { userId: ctx.session.user.id, endDate: { not: null } },
      include: {
        equityTransactions: true,
        optionTransactions: true,
      },
    });
    const computedStrategies = await Promise.all(
      strategies.map((strategy) => computeStrategy(strategy, false))
    );

    const incomeByWeekday = ["Mo", "Tu", "We", "Th", "Fr"].map((weekday) => {
      const closedStrategies = computedStrategies.filter((strategy) => {
        return (
          strategy.endDate &&
          format(new Date(strategy.endDate), "EEEEEE") === weekday
        );
      });

      const profit = closedStrategies.reduce((sum, strategy) => {
        return sum + strategy.profit;
      }, 0);
      return { name: weekday, value: profit };
    });

    if (sumBy(incomeByWeekday, "value") === 0) {
      return [];
    }
    return incomeByWeekday;
  }),

  getIncomeByMonth: protectedProcedure.query(async ({ ctx }) => {
    const strategies = await ctx.prisma.strategy.findMany({
      where: { userId: ctx.session.user.id, endDate: { not: null } },
      include: {
        optionTransactions: true,
        equityTransactions: true,
      },
    });
    const computedStrategies = await Promise.all(
      strategies.map((strategy) => computeStrategy(strategy, false))
    );

    const groupedStrategies = groupByLast5Months(computedStrategies);
    const groupedByDay = groupByCurrentMonthDays(computedStrategies);

    return {
      strategies: groupedStrategies,
      days: groupedByDay,
    };
  }),

  getIncomeByStrategy: protectedProcedure.query(async ({ ctx }) => {
    const strategies = await ctx.prisma.strategy.findMany({
      where: { userId: ctx.session.user.id, endDate: { not: null } },
      include: {
        optionTransactions: true,
        equityTransactions: true,
      },
    });
    const computedStrategies = await Promise.all(
      strategies.map((strategy) => computeStrategy(strategy, false))
    );

    const incomeByStrategy = Object.keys(TradingStrategy).map(
      (tradingStrategy) => {
        const strategies = computedStrategies.filter(
          (strategy) =>
            strategy.tradingStrategy === (tradingStrategy as TradingStrategy)
        );

        const profit = strategies.reduce((sum, strategy) => {
          return sum + strategy.profit;
        }, 0);

        return { name: tradingStrategy, value: profit };
      }
    );

    if (sumBy(incomeByStrategy, "value") === 0) {
      return [];
    }
    return incomeByStrategy.slice(0, 3).toSorted((a, b) => b.value - a.value);
  }),

  getWinLoss: protectedProcedure.query(async ({ ctx }) => {
    const strategies = await ctx.prisma.strategy.findMany({
      where: {
        userId: ctx.session.user.id,
        tradingStrategy: {
          in: [
            TradingStrategy.BuyAndHold,
            TradingStrategy.BuyAndSell,
            TradingStrategy.ShortAndBuy,
            TradingStrategy.ShortAndHold,
          ],
        },
      },
      include: {
        equityTransactions: true,
        optionTransactions: true,
      },
    });

    const computedStrategies = await Promise.all(
      strategies.map(async (strategy) => await computeStrategy(strategy, false))
    );

    const winCount = computedStrategies.filter((strategy) => {
      return strategy.profit > 0;
    }).length;
    const lossCount = computedStrategies.filter((strategy) => {
      return strategy.profit < 0;
    }).length;

    if (winCount === 0 && lossCount === 0) {
      return [];
    }

    return [
      { name: "Win", value: winCount },
      { name: "Loss", value: lossCount },
    ];
  }),
});
