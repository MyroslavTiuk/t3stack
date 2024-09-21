import { type NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import Header from "~/components/layout/header/header";
import Strategy from "~/components/strategies/Strategy";

const StrategyDetailPage: NextPage = () => {
  const { query } = useRouter();
  const strategyId = query.strategyId as string;

  return (
    <>
      <Header />
      <Strategy strategyId={strategyId} />
    </>
  );
};

export default StrategyDetailPage;
