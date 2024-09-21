import { TRPCError } from "@trpc/server";
import Stripe from "stripe";
import { protectedProcedure, createTRPCRouter } from "../trpc";
import { getBaseUrl } from "~/utils/api";
import { env } from "~/env.mjs";
import { z } from "zod";

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
  createPaymentIntents: protectedProcedure.mutation(async ({ ctx }) => {
    const { user } = ctx.session;

    if (!user.subscriptionActive) {
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

    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1440,
      currency: "eur",
      // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
      automatic_payment_methods: {
        enabled: true,
      },
      customer: dbUser.stripeCustomerId,
    });
    return paymentIntent.client_secret;
  }),

  createSubscription: protectedProcedure.mutation(async ({ ctx }) => {
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

    // Delete previous unsuccessful subscriptions
    // const previousSubscriptions = await stripe.subscriptions.list()
    // for (let sub of previousSubscriptions.data) {
    //   if (sub.status != "active") {
    //     await stripe.subscriptions.del(sub.id)
    //   }
    // }

    const subscription = await stripe.subscriptions.create({
      trial_period_days: 30,
      customer: dbUser.stripeCustomerId,
      items: [
        {
          price: env.STRIPE_PRICE_ID,
        },
      ],
      payment_behavior: "default_incomplete",
      payment_settings: {
        save_default_payment_method: "on_subscription",
        payment_method_types: ["card", "us_bank_account"],
      },
      expand: ["latest_invoice.payment_intent", "pending_setup_intent"],
    });

    return {
      subscriptionId: subscription.id,
      // @ts-ignore
      clientSecret: subscription.pending_setup_intent.client_secret,
    };
  }),

  retrieveSubscriptionInformation: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const { user } = ctx.session;

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

      const setupIntent = await stripe.setupIntents.retrieve(input);
      const invoice = await stripe.invoices.list({
        customer: dbUser.stripeCustomerId,
      });

      if (!invoice || invoice.data.length == 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "could not find invoice for subscription",
        });
      }

      return {
        intent: setupIntent,
        invoice: invoice.data[invoice.data.length - 1],
      };
    }),
});
