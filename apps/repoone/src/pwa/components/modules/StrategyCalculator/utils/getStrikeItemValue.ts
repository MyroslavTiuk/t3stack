import React from "react";
import type StrikeChoice from "../OptionLeg/types/StrikeChoice";

const makeGetStrikeItemValue = () =>
  React.useCallback(
    (expiryChoice: StrikeChoice) => expiryChoice?.strike || "",
    []
  );

export default makeGetStrikeItemValue;
