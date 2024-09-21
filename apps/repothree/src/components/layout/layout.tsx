import { Lato } from "next/font/google";
import Head from "next/head";
import React from "react";

const lato = Lato({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700", "900"],
});

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <Head>
        <title>Track Greeks</title>
        <meta
          name="description"
          content="Trading Journal for Options Traders"
        />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <main className="min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-200">
        <div className={lato.className}>{children}</div>
      </main>
    </>
  );
};

export default RootLayout;
