import { type FC } from "react";
import React from "react";

import { type Strategy } from "opc-types/lib/Strategy";

import Box from "../../../../primitives/Box";
import T from "../../../../primitives/Typo";

import css from "./RestoreCurrentCalc.module.scss";
import Link from "../../../../primitives/Link/Link.view";
import ROUTE_PATHS from "../../../../../../consts/ROUTE_PATHS";
import getStrategyTitle from "../../../../../../utils/Finance/getStrategyTitle";
import isStrategyComplete from "../../../../../../utils/Finance/isStrategyComplete";

type RestoreCurrentCalcProps = {
  calc: Strategy;
};

const RestoreCurrentCalc: FC<RestoreCurrentCalcProps> = ({
  calc,
}: RestoreCurrentCalcProps): ReturnType<typeof Box> => {
  if (!isStrategyComplete(calc)) return null;

  return (
    <Box className={css.container} p={1} mb={1}>
      <T mb={1 / 3}>Resume previous calculation:</T>
      <Link
        to={ROUTE_PATHS.CALCULATOR}
        payload={{
          strat: calc.metadata.stratKey,
        }}
        query={calc.id ? { id: calc.id } : { load: "1" }}
        shallow
      >
        {getStrategyTitle(calc, { includeSymbol: true })}
      </Link>
    </Box>
  );
};

export default RestoreCurrentCalc;
