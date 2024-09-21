import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  OptionAction,
  Position,
  TransactionSource,
} from "trackgreeks-database";
import {
  tradePageSize,
  optionTransactionInputSchema,
  equityTransactionInputSchema,
  csvTransactionsInputSchema,
} from "~/server/strategies/transaction";
import { getUnixTime } from "date-fns";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  buildDefaultStrategies,
  buildEquityStrategiesForSymbol,
  buildOptionStrategiesForSymbol,
} from "~/server/strategies/strategies";

export const transactionRouter = createTRPCRouter({
  addOptionTransaction: protectedProcedure
    .input(optionTransactionInputSchema)
    .mutation(async ({ ctx, input }) => {
      const netPrice =
        (input.action === OptionAction.Buy ? -1 : 1) *
        Math.abs(input.optionPrice * input.quantity * 100);
      const optionRes = await ctx.prisma.optionTransaction.create({
        data: {
          userId: ctx.session.user.id,
          source: TransactionSource.Manual,
          underlyingSymbol: input.underlyingSymbol,
          transactionDate: input.transactionDate,
          netPrice,
          quantity: input.quantity,
          action: input.action,
          openClose: input.openClose,
          optionType: input.optionType,
          expirationDate: input.expirationDate,
          strikePrice: input.strikePrice,
          fees: input.fees,
          description: input.description,
          dateAdded: new Date(),
          transactionDateEpoch: getUnixTime(input.transactionDate),
          expirationDateEpoch: getUnixTime(input.expirationDate),
          dateAddedEpoch: getUnixTime(new Date()),
        },
      });

      const { underlyingSymbol, strikePrice, expirationDate, optionType } =
        input;
      const option = {
        underlyingSymbol,
        strikePrice,
        expirationDate,
        optionType,
      };

      await buildOptionStrategiesForSymbol(
        ctx.prisma,
        ctx.session.user.id,
        option
      );

      // workaround for duplication of strategies
      const res = await ctx.prisma.strategy.findMany({
        include: {
          optionTransactions: true,
          equityTransactions: true,
        },
        where: {
          userId: ctx.session.user.id,
          optionTransactions: {
            some: optionRes,
          },
        },
      });
      if (res && res.length > 1) {
        await ctx.prisma.strategy.deleteMany({
          where: {
            id: {
              in: res.map((s) => s.id).filter((id) => id != res[0].id),
            },
          },
        });
      }
    }),

  addEquityTransaction: protectedProcedure
    .input(equityTransactionInputSchema)
    .mutation(async ({ ctx, input }) => {
      const netPrice =
        (input.position === Position.Long ? -1 : 1) *
        Math.abs(input.sharePrice * input.quantity);
      await ctx.prisma.equityTransaction.create({
        data: {
          userId: ctx.session.user.id,
          source: TransactionSource.Manual,
          symbol: input.symbol,
          transactionDate: input.transactionDate,
          netPrice,
          quantity: input.quantity,
          position: input.position,
          openClose: input.openClose,
          fees: input.fees,
          description: input.description,
          dateAdded: new Date(),
          transactionDateEpoch: getUnixTime(input.transactionDate),
          dateAddedEpoch: getUnixTime(new Date()),
        },
      });
      await buildEquityStrategiesForSymbol(
        ctx.prisma,
        ctx.session.user.id,
        input.symbol
      );
    }),

  saveCsvTransactions: protectedProcedure
    .input(csvTransactionsInputSchema)
    .mutation(async ({ ctx, input }) => {
      await Promise.all([
        ctx.prisma.optionTransaction.createMany({
          data: input.optionTransactions.map((transaction) => ({
            ...transaction,
            netPrice:
              (transaction.action === OptionAction.Buy ? -1 : 1) *
              Math.abs(transaction.netPrice),
            userId: ctx.session.user.id,
            source: TransactionSource.Csv,
            dateAdded: new Date(),
            transactionDateEpoch: getUnixTime(transaction.transactionDate),
            expirationDateEpoch: getUnixTime(transaction.expirationDate),
            dateAddedEpoch: getUnixTime(new Date()),
          })),
        }),
        ctx.prisma.equityTransaction.createMany({
          data: input.equityTransactions.map((transaction) => ({
            ...transaction,
            netPrice:
              (transaction.position === Position.Long ? -1 : 1) *
              Math.abs(transaction.netPrice),
            userId: ctx.session.user.id,
            source: TransactionSource.Csv,
            dateAdded: new Date(),
            transactionDateEpoch: getUnixTime(transaction.transactionDate),
            dateAddedEpoch: getUnixTime(new Date()),
          })),
        }),
      ]);

      await buildDefaultStrategies(ctx.prisma, ctx.session.user.id);
    }),

  deleteOptionTransaction: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const transaction = await ctx.prisma.optionTransaction.findFirst({
        where: { id: input.id, userId: ctx.session.user.id },
      });
      if (!transaction) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Transaction not found",
        });
      }
      await ctx.prisma.optionTransaction.delete({
        where: { id: input.id },
      });

      const { underlyingSymbol, strikePrice, expirationDate, optionType } =
        transaction;
      const option = {
        underlyingSymbol,
        strikePrice,
        expirationDate,
        optionType,
      };
      await buildOptionStrategiesForSymbol(
        ctx.prisma,
        ctx.session.user.id,
        option
      );
      await ctx.prisma.strategy.deleteMany({
        where: {
          userId: ctx.session.user.id,
          optionTransactions: {
            none: { id: { not: "" } },
          },
          equityTransactions: {
            none: { id: { not: "" } },
          },
        },
      });
    }),

  deleteEquityTransaction: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const transaction = await ctx.prisma.equityTransaction.findFirst({
        where: { id: input.id, userId: ctx.session.user.id },
      });
      if (!transaction) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Transaction not found",
        });
      }
      await ctx.prisma.equityTransaction.delete({
        where: { id: input.id },
      });
      await buildEquityStrategiesForSymbol(
        ctx.prisma,
        ctx.session.user.id,
        transaction.symbol
      );
      await ctx.prisma.strategy.deleteMany({
        where: {
          userId: ctx.session.user.id,
          optionTransactions: {
            none: { id: { not: "" } },
          },
          equityTransactions: {
            none: { id: { not: "" } },
          },
        },
      });
    }),

  getAllUserTransactions: protectedProcedure.query(async ({ ctx }) => {
    const where = {
      userId: ctx.session.user.id,
    };
    const transactions = await Promise.all([
      ctx.prisma.equityTransaction.findMany({ where }),
      ctx.prisma.optionTransaction.findMany({ where }),
    ]);
    return {
      equityTransaction: transactions[0],
      optionTransaction: transactions[1],
    };
  }),

  getOptionTransactions: protectedProcedure
    .input(
      z.object({
        cursor: z.number().nullish(),
        symbol: z.string().nullish(),
        startDate: z.date(),
        endDate: z.date(),
      })
    )
    .query(async ({ ctx, input }) => {
      const skip = input.cursor ? input.cursor * tradePageSize : 0;

      const where = {
        userId: ctx.session.user.id,
        underlyingSymbol: input.symbol == "" ? undefined : input.symbol,
        transactionDateEpoch: {
          gte: getUnixTime(input.startDate),
          lte: getUnixTime(input.endDate),
        },
      };

      const [count, trades] = await Promise.all([
        // @ts-ignore
        await ctx.prisma.optionTransaction.count({ where }),
        await ctx.prisma.optionTransaction.findMany({
          take: tradePageSize,
          skip,
          // @ts-ignore
          where,
          orderBy: { transactionDate: "desc" },
        }),
      ]);

      const hasNextPage = count > skip + tradePageSize;

      return { count, trades, hasNextPage };
    }),

  getEquityTransactions: protectedProcedure
    .input(
      z.object({
        cursor: z.number().nullish(),
        symbol: z.string().nullish(),
        startDate: z.date(),
        endDate: z.date(),
      })
    )
    .query(async ({ ctx, input }) => {
      const skip = input.cursor ? input.cursor * tradePageSize : 0;

      const where = {
        userId: ctx.session.user.id,
        symbol: input.symbol == "" ? undefined : input.symbol,
        transactionDateEpoch: {
          gte: getUnixTime(input.startDate),
          lte: getUnixTime(input.endDate),
        },
      };

      const [count, trades] = await Promise.all([
        // @ts-ignore
        await ctx.prisma.equityTransaction.count({ where }),
        await ctx.prisma.equityTransaction.findMany({
          take: tradePageSize,
          skip,
          // @ts-ignore
          where,
          orderBy: { transactionDate: "desc" },
        }),
      ]);

      const hasNextPage = count > skip + tradePageSize;

      return { count, trades, hasNextPage };
    }),

  getOptionTransaction: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const transaction = await ctx.prisma.optionTransaction.findUnique({
        where: { id: input.id },
      });
      if (!transaction || transaction.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Transaction not found",
        });
      }
      return transaction;
    }),

  getEquityTransaction: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const transaction = await ctx.prisma.equityTransaction.findUnique({
        where: { id: input.id },
      });
      if (!transaction || transaction.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Transaction not found",
        });
      }
      return transaction;
    }),
});
