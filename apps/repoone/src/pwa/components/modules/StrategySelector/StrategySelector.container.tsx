import React, { type FC } from "react";

import {
  type StrategySelectorProps,
  type StrategySelectorPublicProps,
} from "./StrategySelector.props";
import StrategySelectorView from "./StrategySelector.view";

const StrategySelectorContainer: FC<StrategySelectorPublicProps> = (
  ownProps: StrategySelectorPublicProps
) => {
  const combinedProps: StrategySelectorProps = {
    ...ownProps,
  };

  return <StrategySelectorView {...combinedProps} />;
};

export default StrategySelectorContainer;
