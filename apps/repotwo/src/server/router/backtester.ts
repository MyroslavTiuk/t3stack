import { Prisma } from "optionscout-database";
import { z } from "zod";
import { router, authenticatedProcedure } from "../trpc";
import { numericFilterInput } from "./scanner";

export type PriceHistory = {
  date: Date;
  bid_price: number;
  underlying_price: number;
}[];

export type OptionWithHistory = {
  quote_date: Date;
  underlying_last: number;
  strike: number;
  dte: number;
  expire_date: Date;
  c_delta: number;
  c_ask: number;
  history: PriceHistory;
};

export const backtesterRouter = router({
  tradeHistory: authenticatedProcedure
    .input(
      z.object({
        daysToExpiration: numericFilterInput,
        delta: numericFilterInput,
      })
    )
    .query(async ({ input, ctx }) => {
      // TODO Currently using raw SQL query because I couldn't figure out how to
      // joining the OptionHistory table with the PriceHistory materialized view.
      // If we can figure out how to do that, we can remove the raw SQL query and
      // use prisma's fetchMany instead.
      return await ctx.prisma.$queryRaw<OptionWithHistory[]>`
          SELECT * FROM public."OptionHistory" as options
          INNER JOIN public."PriceHistory" as history
          ON  (options.expire_date = history.expire_date and options.strike = history.strike)
          WHERE options.dte >= ${input.daysToExpiration.gte ?? 0}
          ${
            input.daysToExpiration.lte
              ? Prisma.sql`AND options.dte <= ${input.daysToExpiration.lte}`
              : Prisma.empty
          }
          ${
            input.delta.gte
              ? Prisma.sql`AND options.c_delta >= ${input.delta.gte}`
              : Prisma.empty
          }
          ${
            input.delta.lte
              ? Prisma.sql`AND options.c_delta <= ${input.delta.lte}`
              : Prisma.empty
          }
          LIMIT 50
      `;
    }),
});
