import { z } from "zod";
import { router, authenticatedProcedure } from "../trpc";
import { type Option, type Stock } from "optionscout-database";

export const numericFilterInput = z.object({
  gte: z.number().optional(),
  lte: z.number().optional(),
});

export type NumericFilterInput = z.infer<typeof numericFilterInput>;

const stockFilters = z.object({
  price: numericFilterInput,
  marketCap: numericFilterInput,
  peRatio: numericFilterInput,
  dividendYield: numericFilterInput,
  dividendAmount: numericFilterInput,
  beta: numericFilterInput,
});
export type StockFilters = z.infer<typeof stockFilters>;

const tradeFilters = z.object({
  iv: numericFilterInput,
  otmPercent: numericFilterInput,
  pop: numericFilterInput,
  bidAskSpread: numericFilterInput,
  volume: numericFilterInput,
  daysToExpiration: numericFilterInput,
});
export type TradeFilters = z.infer<typeof tradeFilters>;

const stockOrderBy = z
  .object({
    price: z.enum(["asc", "desc"]).optional(),
    marketCap: z.enum(["asc", "desc"]).optional(),
    peRatio: z.enum(["asc", "desc"]).optional(),
    dividendYield: z.enum(["asc", "desc"]).optional(),
    dividendAmount: z.enum(["asc", "desc"]).optional(),
    beta: z.enum(["asc", "desc"]).optional(),
  })
  .optional();
export type StockOrderBy = z.infer<typeof stockOrderBy>;

const tradeOrderBy = z
  .object({
    iv: z.enum(["asc", "desc"]).optional(),
    otmPercent: z.enum(["asc", "desc"]).optional(),
    pop: z.enum(["asc", "desc"]).optional(),
    bidAskSpread: z.enum(["asc", "desc"]).optional(),
    volume: z.enum(["asc", "desc"]).optional(),
    daysToExpiration: z.enum(["asc", "desc"]).optional(),
  })
  .optional();
export type TradeOrderBy = z.infer<typeof tradeOrderBy>;

export type StockWithTradeCount = Stock & { _count: { TradeSetup: number } } & {
  numTradeSetups: number;
};

export const scannerRouter = router({
  tradesPerStock: authenticatedProcedure
    .input(
      z.object({
        strategy: z.string(),
        stockFilters,
        tradeFilters,
        orderBy: stockOrderBy,
        limit: z.number().min(1).max(100).optional(),
        cursor: z.string().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const limit = input.limit ?? 50;
      const queryResult = await ctx.prisma.stock.findMany({
        take: limit + 1,
        cursor: input.cursor ? { symbol: input.cursor } : undefined,
        where: input.stockFilters,
        orderBy: input.orderBy ?? { symbol: "asc" },
        include: {
          _count: {
            select: {
              TradeSetup: {
                where: { ...input.tradeFilters, strategy: input.strategy },
              },
            },
          },
        },
      });

      const stocksWithTradeCount: StockWithTradeCount[] = queryResult.map(
        (stockWithCount) => ({
          ...stockWithCount,
          numTradeSetups: stockWithCount._count.TradeSetup,
        })
      );

      const moreTradesAvailable = stocksWithTradeCount.length > limit;
      const nextCursor = moreTradesAvailable
        ? stocksWithTradeCount.pop()?.symbol
        : undefined;
      const totalTradeCount = stocksWithTradeCount.reduce(
        (sum, stock) => sum + stock._count.TradeSetup,
        0
      );

      return {
        totalTradeCount,
        stocksWithTradeCount,
        moreTradesAvailable,
        nextCursor,
      };
    }),

  trades: authenticatedProcedure
    .input(
      z.object({
        symbol: z.string(),
        strategy: z.string(),
        tradeFilters,
        orderBy: tradeOrderBy,
        limit: z.number().min(1).max(100).optional(),
        cursor: z.string().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const limit = input.limit ?? 50;
      const trades = await ctx.prisma.tradeSetup.findMany({
        take: limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        where: {
          symbol: input.symbol,
          strategy: input.strategy,
          ...input.tradeFilters,
        },
        orderBy: input.orderBy ?? { id: "asc" },
      });

      const moreTradesAvailable = trades.length > limit;
      const nextCursor = moreTradesAvailable ? trades.pop()?.id : undefined;

      return {
        trades,
        moreTradesAvailable,
        nextCursor,
      };
    }),

  options: authenticatedProcedure
    .input(
      z.object({
        optionIds: z.array(z.string()),
      })
    )
    .query(async ({ input, ctx }) => {
      const options = await Promise.all(
        input.optionIds.map((optionId) =>
          ctx.prisma.option.findUnique({
            where: { id: optionId },
          })
        )
      );
      return options.filter((option) => option !== null) as Option[];
    }),
});
