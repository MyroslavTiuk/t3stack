import { type NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import Header from "~/components/layout/header/header";
import TradeLog from "~/components/log/TradeLog";

const LogTrade: NextPage = () => {
  const { query } = useRouter();
  const tradeId = query.tradeId as string;

  return (
    <>
      <Header />
      <TradeLog tradeId={tradeId} />
    </>
  );
};

export default LogTrade;
