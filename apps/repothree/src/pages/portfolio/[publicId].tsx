import { type NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import Header from "~/components/layout/header/header";
import Portfolio from "~/components/portfolio/portfolio";

const LogTrade: NextPage = () => {
  const { query } = useRouter();
  const publicId = query.publicId as string;

  return (
    <>
      <Header />
      <Portfolio portfolioId={publicId} />
    </>
  );
};

export default LogTrade;
