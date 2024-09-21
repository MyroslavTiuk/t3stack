import React from "react";
import Story from "../Story";
import LegIndicator from "./LegIndicator.view";
import GridCols from "../GridCols";

const LegIndicatorStory = () => {
  return (
    <GridCols>
      <Story title="Buy Call" className={"_cols-3"}>
        <LegIndicator opType={"call"} act={"buy"} />
      </Story>
      <Story title="Sell Put" className={"_cols-3"}>
        <LegIndicator opType={"put"} act={"sell"} />
      </Story>
    </GridCols>
  );
};

export default LegIndicatorStory;
