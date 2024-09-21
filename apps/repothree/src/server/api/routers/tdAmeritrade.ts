import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { add } from "date-fns";
import axios, { type AxiosError } from "axios";
import { z } from "zod";
import type {
  PostTdTokenResp,
  AccountData,
} from "~/server/tdAmeritrade/tdAmeritrade.types";
import {
  TdAmeritrade,
  TD_AMERITRADE_URL,
} from "~/server/tdAmeritrade/tdAmeritrade";
import { getBaseUrl } from "~/utils/api";
import { env } from "~/env.mjs";
// import { buildTrades } from "~/server/strategies/strategies";
import { TRPCError } from "@trpc/server";
import { TransactionSource } from "trackgreeks-database";

export const tdAmeritradeRouter = createTRPCRouter({
  getIntegration: protectedProcedure.query(async ({ ctx }) => {
    const { user } = ctx.session;
    const token = await ctx.prisma.tDAmeritradeToken.findUnique({
      where: {
        userId: user.id,
      },
    });

    if (!token) {
      return null;
    }
    return {
      tokenId: token.id,
      mainAccountId: token.mainAccountId,
      accountIds: token.accountIds,
      lastSync: token.lastSync,
    };
  }),

  postTdAmeritradeToken: protectedProcedure
    .input(z.object({ code: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { user } = ctx.session;
      const { code } = input;

      const params: URLSearchParams = new URLSearchParams({
        grant_type: "authorization_code",
        client_id: env.NEXT_PUBLIC_TD_AMERITRADE_API_KEY,
        access_type: "offline",
        code,
        redirect_uri: `${getBaseUrl()}/td-ameritrade-integration`,
      });

      try {
        const { data } = await axios.post<PostTdTokenResp>(
          `${TD_AMERITRADE_URL}/oauth2/token`,
          params,
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );

        const { data: accountData } = await axios.get(
          `${TD_AMERITRADE_URL}/accounts`,
          {
            headers: {
              Authorization: `Bearer ${data.access_token}`,
            },
          }
        );

        const accountIds: string[] = accountData.map(
          (account: AccountData) => account.securitiesAccount.accountId
        );

        const mainAccountId = accountIds.length === 1 ? accountIds[0] : null;
        const token = await ctx.prisma.tDAmeritradeToken.create({
          data: {
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            expiresIn: add(new Date(), {
              seconds: data.expires_in - 1,
            }),
            refreshTokenExpiresIn: add(new Date(), {
              seconds: data.refresh_token_expires_in - 1,
            }),
            userId: user.id,
            accountIds,
            mainAccountId,
            lastSync: null,
          },
        });

        if (mainAccountId) {
          const tdAmeritrade = new TdAmeritrade(user.id, ctx.prisma);
          await tdAmeritrade.fullImport();
        }

        return { tokenId: token.id, accountIds };
      } catch (error) {
        // if we trigger the mutation twice, the first axios request will fail with "invalid grant"
        // we simply ignore this error for now
        if (
          ((error as AxiosError)?.response?.data as { error: string })?.error ==
          "invalid_grant"
        ) {
          return null;
        }
        throw error;
      }
    }),

  addMainAccountId: protectedProcedure
    .input(z.object({ tokenId: z.string(), accountId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { tokenId, accountId } = input;
      const { user } = ctx.session;

      const token = await ctx.prisma.tDAmeritradeToken.findUnique({
        where: { userId: user.id },
      });

      if (!token || !(token.id === tokenId)) {
        throw new Error("Invalid token id");
      }

      await ctx.prisma.tDAmeritradeToken.update({
        where: {
          id: tokenId,
        },
        data: { mainAccountId: accountId },
      });

      const tdAmeritrade = new TdAmeritrade(user.id, ctx.prisma);
      await tdAmeritrade.fullImport();
    }),

  sync: protectedProcedure.mutation(async ({ ctx }) => {
    const { user } = ctx.session;
    const tdAmeritrade = new TdAmeritrade(user.id, ctx.prisma);
    await tdAmeritrade.syncTransactions();
  }),

  deleteIntegration: protectedProcedure
    .input(z.object({ keepTransactions: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx.session;
      const token = await ctx.prisma.tDAmeritradeToken.findUnique({
        where: {
          userId: user.id,
        },
      });

      if (!token) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No TD Ameritrade token found.",
        });
      }

      if (input.keepTransactions) {
        await ctx.prisma.tDAmeritradeToken.delete({
          where: {
            id: token.id,
          },
        });
      } else {
        await ctx.prisma.tDAmeritradeToken.delete({
          where: {
            id: token.id,
          },
        });
        await ctx.prisma.optionTransaction.deleteMany({
          where: {
            userId: user.id,
            source: TransactionSource.TdAmeritrade,
          },
        });

        await ctx.prisma.equityTransaction.deleteMany({
          where: {
            userId: user.id,
            source: TransactionSource.TdAmeritrade,
          },
        });

        await ctx.prisma.strategy.deleteMany({
          where: {
            userId: user.id,
            optionTransactions: {
              none: { id: { not: "" } },
            },
            equityTransactions: {
              none: { id: { not: "" } },
            },
          },
        });
      }
    }),
});
