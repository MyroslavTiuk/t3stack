import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { tradePageSize } from "~/server/strategies/transaction";
import { getUnixTime } from "date-fns";
import { z } from "zod";
import {
  computeStrategy,
  strategyInputSchema,
} from "~/server/strategies/strategies";
import { OptionAction, Position, TradingStrategy } from "opcalc-database";
import { Status } from "~/components/strategies/filters";
import { TRPCError } from "@trpc/server";
import { every, groupBy, sortBy } from "lodash";

export const strategyRouter = createTRPCRouter({
  getStrategies: protectedProcedure
    .input(
      z.object({
        cursor: z.number().nullish(),
        startDate: z.date(),
        endDate: z.date(),
        tradingStrategies: z.nativeEnum(TradingStrategy).array(),
        status: z.nativeEnum(Status).array(),
        symbol: z.string().optional(),
        sorting: z.record(z.enum(["asc", "desc"])),
      })
    )
    .query(async ({ ctx, input }) => {
      const skip = input.cursor ? input.cursor * tradePageSize : 0;
      function getStatusClause() {
        if (input.status.length === 1 && input.status[0] === Status.Open) {
          return { endDate: null };
        }
        if (input.status.length === 1 && input.status[0] === Status.Closed) {
          return { endDate: { not: null } };
        }
        return {};
      }
      const statusClause = getStatusClause();

      const where = {
        userId: ctx.session.user.id,
        tradingStrategy: { in: input.tradingStrategies },
        ...statusClause,
        AND: [
          {
            OR: [
              {
                equityTransactions: {
                  some: {
                    transactionDateEpoch: {
                      gte: getUnixTime(input.startDate),
                      lte: getUnixTime(input.endDate),
                    },
                  },
                },
              },
              {
                optionTransactions: {
                  some: {
                    transactionDateEpoch: {
                      gte: getUnixTime(input.startDate),
                      lte: getUnixTime(input.endDate),
                    },
                  },
                },
              },
            ],
          },
          {
            OR: [
              {
                equityTransactions: {
                  some: {
                    symbol: input.symbol,
                  },
                },
              },
              {
                optionTransactions: {
                  some: {
                    underlyingSymbol: input.symbol,
                  },
                },
              },
            ],
          },
        ],
      };

      const [count, strategies] = await Promise.all([
        ctx.prisma.strategy.count({ where }),
        ctx.prisma.strategy.findMany({
          take: tradePageSize,
          skip,
          where,
          orderBy: input.sorting,
          include: { equityTransactions: true, optionTransactions: true },
        }),
      ]);

      const computedStrategies = await Promise.all(
        strategies.map((strategy) => computeStrategy(strategy))
      );
      const hasNextPage = count > skip + tradePageSize;

      return { count, strategies: computedStrategies, hasNextPage };
    }),
  getStrategy: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const strategy = await ctx.prisma.strategy.findFirst({
        where: { userId: ctx.session.user.id, id: input.id },
        include: {
          optionTransactions: true,
          equityTransactions: true,
        },
      });
      if (!strategy) {
        return null;
      }

      return await computeStrategy(strategy);
    }),

  createStrategy: protectedProcedure
    .input(strategyInputSchema)
    .mutation(async ({ ctx, input }) => {
      if (
        input.equityTransactionIds.length === 0 &&
        input.optionTransactionIds.length === 0
      ) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Select at least 1 transaction",
        });
      }

      const optionTransactions = await ctx.prisma.optionTransaction.findMany({
        where: {
          id: { in: input.optionTransactionIds },
          userId: ctx.session.user.id,
        },
        orderBy: [{ transactionDate: "asc" }],
      });
      const equityTransactions = await ctx.prisma.equityTransaction.findMany({
        where: {
          id: { in: input.equityTransactionIds },
          userId: ctx.session.user.id,
        },
        orderBy: [{ transactionDate: "asc" }],
      });
      if (
        optionTransactions.length !== input.optionTransactionIds.length ||
        equityTransactions.length !== input.equityTransactionIds.length
      ) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Transaction not found",
        });
      }

      const byOption = groupBy(
        optionTransactions,
        (transaction) =>
          `${transaction.underlyingSymbol}-${transaction.strikePrice}-${transaction.expirationDate}-${transaction.optionType}`
      );
      const bySymbol = groupBy(
        equityTransactions,
        (transaction) => transaction.symbol
      );

      function getIsClosed() {
        const areOptionTradesClosed = Object.keys(byOption).map((option) => {
          const transactions = byOption[option];
          let contractCount = 0;
          transactions.forEach((transaction) => {
            if (transaction.action === OptionAction.Buy) {
              contractCount += transaction.quantity;
            } else if (transaction.action === OptionAction.Sell) {
              contractCount -= transaction.quantity;
            } else {
              // assign or expire
              contractCount = 0;
            }
          });
          if (contractCount === 0) {
            return true;
          } else {
            return false;
          }
        });

        const areEquityTradesClosed = Object.keys(bySymbol).map((symbol) => {
          const transactions = bySymbol[symbol];
          let shareCount = 0;
          transactions.forEach((transaction) => {
            if (transaction.position === Position.Long) {
              shareCount += transaction.quantity;
            } else {
              shareCount -= transaction.quantity;
            }
          });
          if (shareCount === 0) {
            return true;
          } else {
            return false;
          }
        });

        return every([...areOptionTradesClosed, ...areEquityTradesClosed]);
      }
      const isClosed = getIsClosed();

      const allTransactions = [...optionTransactions, ...equityTransactions];
      const sorted = sortBy(allTransactions, "transactionDateEpoch");

      if (input.id) {
        await ctx.prisma.strategy.update({
          where: { id: input.id },
          data: {
            optionTransactions: {
              set: [],
            },
            equityTransactions: {
              set: [],
            },
          },
        });
      }

      const strategy = {
        userId: ctx.session.user.id,
        tradingStrategy: input.tradingStrategy,
        description: input.description,
        optionTransactions: {
          connect: input.optionTransactionIds.map((id) => ({ id })),
        },
        equityTransactions: {
          connect: input.equityTransactionIds.map((id) => ({ id })),
        },
        startDate: sorted[0].transactionDate,
        endDate: isClosed ? sorted[sorted.length - 1].transactionDate : null,
        startDateEpoch: sorted[0].transactionDateEpoch,
        endDateEpoch: isClosed
          ? sorted[sorted.length - 1].transactionDateEpoch
          : null,
      };

      await ctx.prisma.strategy.upsert({
        where: {
          id: input.id ?? "NOT EXISTING ID",
        },
        update: strategy,
        create: strategy,
      });
    }),
  deleteStrategy: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const strategy = await ctx.prisma.strategy.findFirst({
        where: { userId: ctx.session.user.id, id: input.id },
      });
      if (!strategy) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Strategy not found",
        });
      }

      await ctx.prisma.strategy.delete({ where: { id: input.id } });
    }),
});
