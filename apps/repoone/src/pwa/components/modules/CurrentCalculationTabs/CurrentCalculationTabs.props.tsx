import { type StrategyOverview } from "opc-types/lib/StrategyOverview";
import { type Nullable } from "opc-types/lib/util/Nullable";

export interface CurrentCalculationTabsPassedProps {
  useSecondaryBackground?: boolean;
}

export type CurrentCalculationTabsPublicProps =
  CurrentCalculationTabsPassedProps;

interface CurrentCalculationTabsCalcedProps {
  calcs: StrategyOverview[];
  keepOpenDefault: Nullable<string>;
  currentCalcId: Nullable<string>;
  loading?: boolean;
  error?: Error | undefined;
  curCalcSymbol: Nullable<string>;
}

export interface CurrentCalculationTabsProps
  extends CurrentCalculationTabsPassedProps,
    CurrentCalculationTabsCalcedProps {}
