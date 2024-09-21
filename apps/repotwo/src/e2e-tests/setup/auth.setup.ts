import path from "node:path";
import { test as setup } from "@playwright/test";

import { createInnerTRPCContext } from "../../server/context";

setup("authenticate", async ({ page }) => {
  const authFile = path.resolve(__dirname, "storageState.json");
  const sessionToken = "04456e41-ec3b-4edf-92c1-48c14e57cacd2";

  const ctx = createInnerTRPCContext({ session: null });
  await ctx.prisma.user.upsert({
    where: {
      email: "e2e@e2e.com",
    },
    create: {
      name: "e2e",
      email: "e2e@e2e.com",
      isActive: true,
      sessions: {
        create: {
          expires: new Date("2100"),
          sessionToken,
        },
      },
    },
    update: {},
  });

  await page.goto("/");
  await page.context().addCookies([
    {
      name: "next-auth.session-token",
      value: sessionToken,
      domain: "localhost",
      path: "/",
      httpOnly: true,
      sameSite: "Lax",
    },
  ]);
  await page.context().storageState({ path: authFile });
});
