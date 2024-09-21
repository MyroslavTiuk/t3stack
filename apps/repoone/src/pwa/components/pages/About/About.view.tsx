import { type FC, type ReactElement } from "react";
import React from "react";

import MainLayout from "../../layouts/MainLayout";
import T from "../../primitives/Typo";
import Box from "../../primitives/Box";

import commonCss from "../common.module.scss";
import { type AboutProps } from "./About.props";
import Button from "../../primitives/Button";

const AboutView: FC<AboutProps> = (_props): ReactElement<"div"> => {
  return (
    <MainLayout
      nestedCard
      title="About Options profit calculator"
      initialPageTitle="About"
    >
      <Box className={[commonCss.textContent, "formatted-content"]}>
        <T h2 tagName="h1" className="hide-mob">
          About our unique calculator
        </T>
        <T content>
          If you're an options trader, you will already know the amazing earning
          power of options. You will also have faced the battle of choosing a
          strategy which both meets your profit target and is within your
          trading comfort zone.
        </T>
        <T content>
          OptionsProfitCalculator.com seeks to minimize that battle by providing
          you with a simple way to compare various options trading strategies
          side-by-side. By doing this, you will be able to quickly determine the
          strategy for a trade which suits you and the market sentiment!
        </T>
        <T h4>The 3rd Dimension: Time</T>
        <T content>
          Other profit calculators only show you the returns at expiry. What
          about the days between now and then? How can you make informed
          decisions without this information? Well now you can.
        </T>
        <T content>
          With our unique ROI tables, you can see your expected return on
          investment on any given day, at any given price. This knowledge is
          vital to forming an educated exit strategy.
        </T>
        <Box>
          <Button text="Get started" />
        </Box>
      </Box>
    </MainLayout>
  );
};

export default AboutView;
