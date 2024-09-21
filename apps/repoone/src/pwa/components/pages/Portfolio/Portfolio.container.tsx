import { type NextPage } from "next";
import React from "react";

import { withRedux } from "../../../store/withRedux";
import MainLayout from "../../layouts/MainLayout";
import {
  type PortfolioProps,
  type PortfolioPublicProps,
} from "./Portfolio.props";
import PortfolioView from "./Portfolio.view";
import portfolioPageName from "./portfolio.page-name";

const PortfolioContainer: NextPage<PortfolioPublicProps> = (
  ownProps: PortfolioPublicProps
) => {
  // {{containerBodyPrefabs}}
  const combinedProps: PortfolioProps = {
    ...ownProps,
    // your calculated props
  };

  return (
    <MainLayout
      title={`${portfolioPageName.titleCase} – Options profit calculator`}
      initialPageTitle={portfolioPageName.titleCase}
    >
      <PortfolioView {...combinedProps} />
    </MainLayout>
  );
};

export default withRedux(PortfolioContainer);
