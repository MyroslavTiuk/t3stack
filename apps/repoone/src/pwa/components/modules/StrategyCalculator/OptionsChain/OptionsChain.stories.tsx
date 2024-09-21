import React from "react";

import { type OptionData } from "opc-types/lib/OptionData";
import { type Strategy } from "opc-types/lib/Strategy";

import Story from "../../../primitives/Story";
import Box from "../../../primitives/Box";
import { testPartialStrategyLongCall } from "../../../../../services/calculate/helpers/testPartialStrategyLongCall";

import { type OptionsChainProps } from "./OptionsChain.props";
import OptionsChain from "./OptionsChain.view";
import { CHAIN_COLUMN_CHOICE } from "../../../../../types/enums/CHAIN_COLUMN_CHOICES";

const optionData: OptionData = {
  l: 1.1,
  b: 1.2,
  a: 1.15,
  iv: 30,
  v: 22,
  i: 40,
  g: 0.05,
  d: 0.3,
};

const strikes = new Array(20).fill(0).map((v: 0, i: number) => 10 + i * 0.5);

const dummyPriceOf = (act: "c" | "p", t: number, strike: number) => {
  const intVal =
    act === "c" ? Math.max(0, 15 - strike) : Math.max(0, strike - 15);
  const extVal = Math.max(0, t * 0.5 - Math.abs(strike - 15) / 10);
  return {
    l: intVal + extVal,
    b: intVal + extVal - 0.05,
    a: intVal + extVal + 0.05,
  };
};

const getOptionSet = (act: "c" | "p", t: number) =>
  strikes.reduce(
    (acc, strike) =>
      act === "c" && strike === 10
        ? acc
        : {
            ...acc,
            [strike]: {
              ...optionData,
              ...dummyPriceOf(act, t, strike),
            },
          },
    {} as Record<number, OptionData>
  );

const props: OptionsChainProps = {
  columnsChoice: CHAIN_COLUMN_CHOICE.SIMPLE,
  setChainColumns: () => {},
  chainColumns: [],
  defaultExpiry: null,
  prices: {
    "20200401": {
      c: getOptionSet("c", 1),
      p: getOptionSet("p", 1),
    },
    "20200416": {
      c: getOptionSet("c", 2),
      p: getOptionSet("p", 2),
    },
    "20200423": {
      c: getOptionSet("c", 2.75),
      p: getOptionSet("p", 2.75),
    },
  },
  currentCalc: testPartialStrategyLongCall as unknown as Strategy,
  currentLeg: "option",
  curPrice: 15,
  onSelectOption: () => console.log,
  close: () => {},
};

const OptionsChainStory = () => {
  return (
    <Box className="grid">
      <Story title="Basic" className="_12">
        <OptionsChain {...props} />
      </Story>
    </Box>
  );
};

export default OptionsChainStory;
