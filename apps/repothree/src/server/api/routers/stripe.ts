import { TRPCError } from "@trpc/server";
import Stripe from "stripe";
import { protectedProcedure, createTRPCRouter } from "../trpc";
import { getBaseUrl } from "~/utils/api";
import { env } from "~/env.mjs";

export const stripeRouter = createTRPCRouter({
  createCheckoutSession: protectedProcedure.mutation(async ({ ctx }) => {
    const { user } = ctx.session;

    if (user.subscriptionActive) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "User is already subscribed",
      });
    }

    const dbUser = await ctx.prisma.user.findFirst({
      where: {
        id: user.id,
      },
    });

    if (!dbUser || !dbUser.stripeCustomerId) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "could not find user in database",
      });
    }

    const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
      apiVersion: "2022-11-15",
    });

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: dbUser.stripeCustomerId,
      line_items: [
        {
          price: env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      success_url: getBaseUrl(),
      cancel_url: getBaseUrl(),
      subscription_data: {
        trial_period_days: 14,
        metadata: {
          payingUserId: user.id,
        },
      },
    });

    if (!checkoutSession.url) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error creating stripe checkout session",
      });
    }

    return checkoutSession.url;
  }),
  createPortalSession: protectedProcedure.mutation(async ({ ctx }) => {
    const { user } = ctx.session;

    if (!user.subscriptionActive) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "No subscription active",
      });
    }

    const dbUser = await ctx.prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });

    if (!dbUser?.stripeCustomerId) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "no stripe customer found",
      });
    }

    const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
      apiVersion: "2022-11-15",
    });

    const session = await stripe.billingPortal.sessions.create({
      customer: dbUser?.stripeCustomerId,
      return_url: `${getBaseUrl()}/settings`,
    });

    return session.url;
  }),
});
