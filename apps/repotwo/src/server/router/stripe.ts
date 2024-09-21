import { TRPCError } from "@trpc/server";
import { env } from "src/env/server.mjs";
import Stripe from "stripe";
import { router, authenticatedProcedure } from "../trpc";
import { getBaseUrl } from "src/utils/trpc";

export const stripeRouter = router({
  createCheckoutSession: authenticatedProcedure.mutation(async ({ ctx }) => {
    const { user } = ctx.session;

    // @ts-ignore
    if (user.isActive) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "User is already active",
      });
    }

    const dbUser = await ctx.prisma.user.findFirst({
      where: {
        // @ts-ignore
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
      /* This is where the magic happens - this line will automatically link this Checkout page to the existing customer we created when the user signed-up, so that when the webhook is called our database can automatically be updated correctly.*/
      customer: dbUser.stripeCustomerId,
      line_items: [
        {
          price: env.PRICE_ID,
          quantity: 1,
        },
      ],
      // {CHECKOUT_SESSION_ID} is a string literal which the Stripe SDK will replace; do not manually change it or replace it with a variable!
      success_url: `${getBaseUrl()}/account/me?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${getBaseUrl()}/account/me?cancelledPayment=true`,
      subscription_data: {
        metadata: {
          // This isn't 100% required, but it helps to have so that we can manually check in Stripe for whether a customer has an active subscription later, or if our webhook integration breaks.
          // @ts-ignore
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
});
