import React from "react";
import Story from "../../primitives/Story";
import CurrentCalculationTabs from "./CurrentCalculationTabs.view";
import Box from "../../primitives/Box";

const calcs = [
  {
    id: "1",
    title: "400/420 8 Aug AAPL bullish call credit spread",
    symbol: "AAPL",
    stratKey: "call-credit-spread",
  },
  {
    id: "2",
    title: "410/420 8 Aug AAPL bullish call credit spread",
    symbol: "AAPL",
    stratKey: "call-credit-spread",
  },
  {
    id: "3",
    title: "400/430 8 Aug AAPL bullish call credit spread",
    symbol: "AAPL",
    stratKey: "call-credit-spread",
  },
  {
    id: "4",
    title: "410/440 8 Aug AAPL bullish call credit spread",
    symbol: "AAPL",
    stratKey: "call-credit-spread",
  },
  {
    id: "5",
    title: "400/450 8 Aug AAPL bullish call credit spread",
    symbol: "AAPL",
    stratKey: "call-credit-spread",
  },
  {
    id: "6",
    title: "800/820 8 Aug GOOG bullish call credit spread",
    symbol: "GOOG",
    stratKey: "call-credit-spread",
  },
  {
    id: "7",
    title: "810/820 8 Aug GOOG bullish call credit spread",
    symbol: "GOOG",
    stratKey: "call-credit-spread",
  },
];

const CurrentCalculationTabsStory = () => {
  return (
    <Box className={"theme--light"}>
      <Story title="Basic">
        <CurrentCalculationTabs
          calcs={calcs}
          keepOpenDefault={null}
          currentCalcId={"1"}
          curCalcSymbol={"AAPL"}
        />
      </Story>
    </Box>
  );
};

export default CurrentCalculationTabsStory;
