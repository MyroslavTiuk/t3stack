import React from "react";
import Story from "../../../../primitives/Story";
import Box from "../../../../primitives/Box";
import ExpirySelector from "./ExpirySelector.view";
import {
  type OptionsChain,
  type OptionsChain_options,
} from "opc-types/lib/OptionsChain";

// @ts-ignore (it's correct, for story, assuming nothing below the first layer are needed
const prices = {
  "20200401": {} as OptionsChain_options,
  "20200408": {} as OptionsChain_options,
  "20200413": {} as OptionsChain_options,
  "20200420": {} as OptionsChain_options,
  "20200504": {} as OptionsChain_options,
  "20200521": {} as OptionsChain_options,
  "20200621": {} as OptionsChain_options,
  "20200721": {} as OptionsChain_options,
  "20200921": {} as OptionsChain_options,
  "20201221": {} as OptionsChain_options,
  "20210121": {} as OptionsChain_options,
  "20210621": {} as OptionsChain_options,
  "20220121": {} as OptionsChain_options,
} as OptionsChain;

const ExpirySelectorStory = () => {
  return (
    <Box className="grid">
      <Story title="Basic" className={"_12"}>
        <ExpirySelector
          prices={prices}
          onSelectExpiry={console.log}
          curExpiry={"20200413"}
        />
      </Story>
    </Box>
  );
};

export default ExpirySelectorStory;
