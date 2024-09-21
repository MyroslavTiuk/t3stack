import { IncomingWebhook } from "@slack/webhook";
import { z } from "zod";

import { router, publicProcedure } from "../trpc";

const slackUrl = process.env.SLACK_WEBHOOK_URL!;

export const waitlistRouter = router({
  joinWaitlist: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ input }) => {
      const webhook = new IncomingWebhook(slackUrl);
      await webhook.send({
        text: "New waitlist request: " + input.email,
      });

      return true;
    }),
});
