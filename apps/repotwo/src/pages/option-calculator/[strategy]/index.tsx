import React from "react";
import { Meta } from "@atoms/Meta";
import { strategyNames, type Strategy } from "@data/strategies.data";
import { type GetStaticPaths, type GetStaticPropsContext } from "next";
import Calculator from "src/components/Calculator/Calculator";
import { useCalculatorStore } from "src/state";

const OptionCalculator: React.FC<{ strategy: Strategy }> = ({ strategy }) => {
  const setStrategy = useCalculatorStore((state) => state.setStrategy);
  setStrategy(strategy);

  const title = strategyNames[strategy];

  return (
    <>
      <Meta
        title={`${title} Calculator`}
        imge="https://optionscout.com/option_scout_logo.png"
        type="article"
        url={`https://optionscout.com/option-calculator/${strategy}`}
        description={`Use the OptionScout profit calculator to visualize your trading idea for the ${title} strategy. Check out max profit, max risk, and even breakeven price for a ${title}`}
        keywords={`${title} options calculator, calculator for ${title},${title} options, calculate profits for ${title}, check profits for ${title}`}
      />
      <Calculator />
    </>
  );
};

export const getStaticPaths: GetStaticPaths<{
  strategy: Strategy;
}> = () => {
  const paths = Object.keys(strategyNames).map((strategy) => ({
    params: { strategy: strategy as Strategy },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = ({
  params,
}: GetStaticPropsContext<{ strategy: Strategy }>) => {
  const strategy = params?.strategy;
  return {
    props: {
      strategy,
    },
  };
};

export default OptionCalculator;
