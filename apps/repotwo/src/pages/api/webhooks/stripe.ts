import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { prisma } from "../../../server/dbClient";
import { env } from "src/env/server.mjs";
import getRawBody from "raw-body";

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

    if (stripeEvent.type === "customer.subscription.created") {
      const subscription = stripeEvent.data.object as Stripe.Subscription;
      await prisma.user.updateMany({
        where: {
          stripeCustomerId: subscription.customer as string,
        },
        data: {
          isActive: true,
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
