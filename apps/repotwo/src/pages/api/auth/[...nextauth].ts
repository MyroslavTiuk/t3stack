import NextAuth, { type NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import TwitterProvider from "next-auth/providers/twitter";
import EmailProvider from "next-auth/providers/email";
import { prisma } from "../../../server/dbClient";
import Stripe from "stripe";
import { env } from "../../../env/server.mjs";
import axios from "axios";

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    }),
    GoogleProvider({
      clientId: env.GOOGLE_ID,
      clientSecret: env.GOOGLE_SECRET,
    }),
    TwitterProvider({
      clientId: env.TWITTER_API,
      clientSecret: env.TWITTER_API_SECRET,
    }),
    EmailProvider({
      server: env.EMAIL_SERVER,
      from: env.EMAIL_FROM,
    }),
  ],
  pages: {
    signIn: "/account/login",
    newUser: "/account/me",
  },
  adapter: PrismaAdapter(prisma),
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        // @ts-ignore
        session.user.id = user.id;
        const dbUser = await prisma.user.findFirst({
          where: {
            id: user.id,
          },
        });

        // @ts-ignore
        session.user.isActive = dbUser?.isActive ?? false;
      }

      return session;
    },

    async redirect({ baseUrl }) {
      return baseUrl;
    },
  },
  events: {
    createUser: async ({ user }) => {
      if (user.email) {
        const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
          apiVersion: "2022-11-15",
        });

        const customer = await stripe.customers.create({
          email: user.email,
        });

        await prisma.user.update({
          where: { id: user.id },
          data: {
            stripeCustomerId: customer.id,
          },
        });

        await axios.put(
          "https://api.sendgrid.com/v3/marketing/contacts",
          {
            contacts: [{ email: `${user.email}` }],
            list_ids: [env.SENDGRID_MAILING_ID],
          },
          {
            headers: {
              "content-type": "application/json",
              Authorization: `Bearer ${env.SENDGRID_API_KEY}`,
            },
          }
        );
      }
    },
  },
};

export default NextAuth(authOptions);
