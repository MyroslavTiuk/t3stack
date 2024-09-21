import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import getRawBody from "raw-body";
import { prisma } from "~/server/db";
import { env } from "~/env.mjs";

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

async function confirmSubscription(req: NextApiRequest, res: NextApiResponse) {
  const rawBody = await getRawBody(req);
  try {
    const stripeEvent = stripe.webhooks.constructEvent(
      rawBody,
      req.headers["stripe-signature"] as string,
      env.STRIPE_WEBHOOK_SIGNING
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const plan = (stripeEvent.data.object as any).plan as Stripe.Plan;
    if (
      (stripeEvent.type === "customer.subscription.created" &&
        plan.id === env.STRIPE_PRICE_ID) ||
      (stripeEvent.type === "customer.subscription.updated" &&
        plan.id === env.STRIPE_PRICE_ID &&
        stripeEvent.data.object["status"] &&
        stripeEvent.data.object["status"] == "active")
    ) {
      const subscription = stripeEvent.data.object as Stripe.Subscription;
      await prisma.user.updateMany({
        where: {
          stripeCustomerId: subscription.customer as string,
        },
        data: {
          subscriptionActive: true,
        },
      });
    }
    if (
      stripeEvent.type === "customer.subscription.deleted" &&
      plan.id === env.STRIPE_PRICE_ID
    ) {
      const subscription = stripeEvent.data.object as Stripe.Subscription;
      await prisma.user.updateMany({
        where: {
          stripeCustomerId: subscription.customer as string,
        },
        data: {
          subscriptionActive: false,
        },
      });
    }
    res.status(200).json({ received: true });
  } catch (err) {
    res.status(500).end();
  }
}

// Disable next.js body parsing (stripe needs the raw body to validate the event)
export const config = {
  api: {
    bodyParser: false,
  },
};

export default confirmSubscription;
