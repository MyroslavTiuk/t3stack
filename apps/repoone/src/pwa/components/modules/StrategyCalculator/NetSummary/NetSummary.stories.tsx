import React from "react";
import Story from "../../../primitives/Story";
import GridCols from "../../../primitives/GridCols";
import NetSummaryView from "./NetSummary.view";

const NetSummaryStory = () => {
  // const { value, toggle } = useToggleState(false);
  return (
    <GridCols>
      <Story title="Basic" className="_cols-4">
        <NetSummaryView
          spreadPriceAsPerLegs={0.3}
          setSpreadPrice={console.log}
          spreadPriceRangeAsPerLegs={[null, null]}
          greeks={{}}
        />
      </Story>
    </GridCols>
  );
};

export default NetSummaryStory;
