import type { NextApiRequest, NextApiResponse } from "next";
import { getServerAuthSession } from "~/server/auth";

const allowedOrigins = [
  "https://www.optionsprofitcalculator.com",
  "https://optionsprofitcalculator.com",
  "https://opcalc.com",
  "https://optionscout.test-domain-wp.com",
];

async function isSignedUp(req: NextApiRequest, res: NextApiResponse) {
  if (req.headers.origin && allowedOrigins.includes(req.headers.origin)) {
    res.appendHeader("Access-Control-Allow-Origin", req.headers.origin);
    res.appendHeader("Access-Control-Allow-Methods", "GET");
    res.appendHeader("Access-Control-Allow-Credentials", "true");
    res.appendHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
  }

  const session = await getServerAuthSession({ req, res });
  if (session?.user.subscriptionActive) {
    res.status(200).json({ isSignedUp: true });
  } else {
    res.status(200).json({ isSignedUp: false });
  }
}

export default isSignedUp;
