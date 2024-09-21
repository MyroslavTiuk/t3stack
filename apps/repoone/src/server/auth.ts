import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { env } from "~/env.mjs";
import { prisma } from "~/server/db";
import Stripe from "stripe";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { OptionTradingLevel } from "opcalc-database";

export const userInputSchema = z.object({
  marginTrading: z.boolean().optional(),
  optionTradingLevel: z.nativeEnum(OptionTradingLevel).optional(),
});

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      subscriptionActive: boolean;
      // ...other properties
    } & DefaultSession["user"];
  }

  interface User {
    // ...other properties
    subscriptionActive: boolean;
  }
}

export type Credentials = {
  email: string;
  password: string;
};

export type SignupCredentials = Credentials & { name: string };

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.subscriptionActive = user.subscriptionActive;
        // session.user.role = user.role; <-- put other properties on the session here
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: "/auth/create-account",
    verifyRequest: "/auth/verify-request",
  },
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_ID,
      clientSecret: env.GOOGLE_SECRET,
    }),
    EmailProvider({
      server: env.EMAIL_SERVER,
      from: env.EMAIL_FROM,
    }),
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, _) {
        const user = await prisma.user.findUnique({
          where: { email: credentials!.email },
        });

        if (
          !user ||
          !(await bcrypt.compare(
            credentials!.password,
            user.password as string
          ))
        ) {
          throw new Error(
            JSON.stringify({
              errors: "Invalid email or password",
              status: false,
            })
          );
        }
        return { id: user.id, name: user.name, email: user.email } as any;
      },
    }),
    CredentialsProvider({
      id: "newUser",
      name: "newUser",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text" },
      },
      async authorize(credentials, _) {
        const user = await prisma.user.create({
          data: {
            name: credentials!.name,
            email: credentials!.email,
            password: await bcrypt.hash(credentials!.password, 12),
          },
        });
        return { id: user.id, name: user.name, email: user.email } as any;
      },
    }),
  ],
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
            subscriptionActive: false,
          },
        });
      }
    },
  },

  // Configure the secure cookie for production environments only.
  ...(env.NODE_ENV === "production"
    ? {
        cookies: {
          sessionToken: {
            name: "__Secure-next-auth.session-token",
            options: {
              httpOnly: true,
              sameSite: "None",
              path: "/",
              secure: true,
            },
          },
        },
      }
    : {}),
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
