import { OptionType, Position } from "optionscout-database";
import { z } from "zod";
import { router, authenticatedProcedure } from "../trpc";

const optionInput = z.object({
  optionType: z.nativeEnum(OptionType),
  position: z.nativeEnum(Position),
  contractsCount: z.number().int(),
  strikePrice: z.number(),
  optionPrice: z.number(),
  stockPrice: z.number(),
  tradeDate: z.date(),
  expiration: z.date(),
  iv: z.number().optional(),
});

const equityInput = z.object({
  position: z.nativeEnum(Position),
  shares: z.number().int(),
});

export const saveTradesRouter = router({
  saveTrade: authenticatedProcedure
    .input(
      z.object({
        symbol: z.string(),
        name: z.string(),
        pop: z.number().optional(),
        netCredit: z.number().optional(),
        options: optionInput.array(),
        equity: equityInput.optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.savedTrade.create({
        data: {
          name: input.name,
          pop: input.pop,
          netCredit: input.netCredit,
          // @ts-ignore
          userId: ctx.session.user.id,
          options: {
            createMany: {
              data: input.options.map((option) => ({
                position: option.position,
                contractsCount: option.contractsCount,
                strikePrice: option.strikePrice,
                optionPrice: option.optionPrice,
                stockPrice: option.stockPrice,
                tradeDate: option.tradeDate,
                expiration: option.expiration,
                iv: option.iv,
                optionType: option.optionType,
                symbol: input.symbol,
                // @ts-ignore
                userId: ctx.session.user.id,
              })),
            },
          },
          equity: input.equity
            ? {
                create: {
                  position: input.equity.position,
                  shares: input.equity.shares,
                  symbol: input.symbol,
                  user: {
                    connect: {
                      // @ts-ignore
                      id: ctx.session.user.id,
                    },
                  },
                },
              }
            : {},
        },
      });
    }),

  getTrades: authenticatedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.savedTrade.findMany({
      where: {
        // @ts-ignore
        userId: ctx.session.user.id,
      },
      include: {
        options: true,
        equity: true,
      },
    });
  }),
});
