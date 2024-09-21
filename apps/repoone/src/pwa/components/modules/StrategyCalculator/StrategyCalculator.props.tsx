import type React from "react";

import { type Strategy } from "opc-types/lib/Strategy";
import { type StrategyEstimate } from "opc-types/lib/StrategyEstimate";
import { type Nullable } from "opc-types/lib/util/Nullable";
import { type Optional } from "opc-types/lib/util/Optional";
import { type RESULTS_VISUALIZATION } from "opc-types/lib/RESULTS_VISUALIZATION";

interface StrategyCalculatorPassedProps {
  currentCalc: Nullable<Strategy>;
  symb: Optional<string>;
  showStrategySelector: boolean;
  mobSelectedTab: MobTabs;
  setMobSelectedTab: React.Dispatch<React.SetStateAction<MobTabs>>;
  isLoading: boolean;
}

export enum MobTabs {
  SAVED,
  SETUP,
  RESULTS,
}

export enum SAVE_STICKY_VISIBILITY {
  INITIAL_HIDDEN,
  CLOSED,
  SHOWING,
}

export type StrategyCalculatorPublicProps = StrategyCalculatorPassedProps;

export interface StrategyCalculatorCalcedProps
  extends StrategyCalculatorPassedProps {
  hasAcceptedTNC: boolean;
  showChainForLeg: Nullable<string>;
  setShowChainForLeg: React.Dispatch<React.SetStateAction<Nullable<string>>>;
  isCalculating: boolean;
  estimate: Nullable<StrategyEstimate>;
  estimateForResults: Nullable<StrategyEstimate>;
  currentCalcForResults: Nullable<Strategy>;
  formCompleted: boolean;
  showPosDetail: boolean;
  setShowPosDetail: (showing: boolean) => void;
  cloneCalc: () => void;
  newCalc: () => void;
  isCloning: boolean;
  userIsAuthed: boolean;
  showStratSelectionFull: boolean;
  setShowStratSelectionFull: React.Dispatch<React.SetStateAction<boolean>>;
  resultsVisualization: RESULTS_VISUALIZATION;
  viewStacked: boolean;
  toggleViewStacked: () => void;
  multiStrikeEstimates?: Nullable<StrategyEstimate>[];
}

export type StrategyCalculatorProps = StrategyCalculatorPublicProps &
  StrategyCalculatorCalcedProps;
