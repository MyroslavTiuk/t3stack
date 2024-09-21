import { type StrategyOverview } from "opc-types/lib/StrategyOverview";
import React, { type FC, useMemo } from "react";
import getStrategyTitle from "../../../../utils/Finance/getStrategyTitle";
import selectUnderlyingLeg from "../../../store/selectors/currentCalculation/selectUnderlyingLeg";
import useSelectorSafe from "../../../store/selectors/useSelectorSafe";

import { useCalculations } from "../../../../services/UserData/CalculationsProvider";
import {
  type CurrentCalculationTabsProps,
  type CurrentCalculationTabsPublicProps,
} from "./CurrentCalculationTabs.props";
import CurrentCalculationTabsView from "./CurrentCalculationTabs.view";

const CurrentCalculationTabsContainer: FC<
  CurrentCalculationTabsPublicProps
> = ({ useSecondaryBackground }: CurrentCalculationTabsPublicProps) => {
  const curCalc = useSelectorSafe((store) => store.currentCalculation, null);

  const { calculationsFromFirebase } = useCalculations();

  // todo: Just use groupedCalculations from useCalculation
  const savedCalcsMapping = useMemo(
    () =>
      calculationsFromFirebase
        .map((item): StrategyOverview | false => {
          const symbol = selectUnderlyingLeg(item?.calculation)?.val;
          // eslint-disable-next-line no-unsafe-optional-chaining
          const { stratKey } = item?.calculation?.metadata;
          if (!symbol || !stratKey) return false;
          return {
            title: getStrategyTitle(item?.calculation),
            id: item?.id,
            symbol: symbol || "",
            stratKey,
          };
        })
        .filter((c) => !!c) as StrategyOverview[],
    [calculationsFromFirebase]
  );

  const viewProps: CurrentCalculationTabsProps = {
    calcs: savedCalcsMapping,
    curCalcSymbol: selectUnderlyingLeg(curCalc)?.val || null,
    keepOpenDefault: null,
    useSecondaryBackground,
    // loading,
    // error,
    currentCalcId: curCalc?.id || null,
  };

  return <CurrentCalculationTabsView {...viewProps} />;
};

export default CurrentCalculationTabsContainer;
