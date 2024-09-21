import React from "react";
import { Meta } from "@atoms/Meta";
import { Strategies } from "@organisms/Strategies";

const Home: React.FC = () => {
  return (
    <>
      <Meta
        title={"Option Profit Calculator - Option Scout"}
        type="website"
        url="https://optionscout.com/"
        imge="https://optionscout.com/option_scout_logo.png"
        description="Utilize our options profit calculator software. View breakeven points, max profit, max risk, probability of profit and more. Just pick a strategy, a stock, and a contract."
        keywords="option calculator profit, stock options calculator, stock options profit calculator, calculate profitability options, covered call calculator, call options profit calculator, implied volatility options, put options calculator"
      />
      <Strategies />
    </>
  );
};

export default Home;
