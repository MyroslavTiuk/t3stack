import { type PriceData, type PriceDataSuccess } from "opc-types/lib/PriceData";
import { type StratName } from "opc-types/lib/StratName";
import { type Tuple } from "opc-types/lib/Tuple";
import { type Nullable } from "opc-types/lib/util/Nullable";
import { type Optional } from "opc-types/lib/util/Optional";
import {
  CurrentCalculationQuickView,
  type CurrentCalculationState,
  MultiStrikeCalculation,
} from "opc-types/lib/store/CurrentCalculationState";
import { type DisplayValueTypes } from "opc-types/lib/DisplayValueTypes";
import { type CALCULATION_PERMISSION } from "opc-types/lib/CALCULATION_PERMISSION";
import { makeCreateActions, presetActions } from "../../../utils/Redux";
import { type DefaultOptLeg } from "../../../utils/Data/TransformStrategy/TransformStrategy";

const ns = "CALCULATOR";
const createCalcActions = makeCreateActions(ns);

interface UpdateParamPayload {
  legId?: string;
  paramChain: string[];
  paramValue: string | boolean | number | null | Nullable<number>[];
  meta?: NonNullable<unknown>;
  multiStrike: boolean;
}

interface InitPayload {
  strat: StratName;
  symb?: string;
  defaultOptLegs?: DefaultOptLeg[];
  prices?: Optional<PriceData>;
  defaultDisplayValueType?: Optional<DisplayValueTypes>;
}

interface UpdateSpreadPricePayload {
  spreadPrice: number;
  spreadPriceRange: Tuple<Nullable<number>>;
}

const calcActions = createCalcActions({
  updateSpreadPrice: presetActions.makeIdentity<UpdateSpreadPricePayload>(),
  updateParam: presetActions.makeIdentity<UpdateParamPayload>(),
  changeSymbol: presetActions.makeIdentity<string>(),
  addLeg: presetActions.noPayload,
  removeLeg: presetActions.makeIdentity<string>(),
  init: presetActions.makeIdentity<InitPayload>(),
  resetCurrentCalc: presetActions.noPayload,
  shiftExpiry: presetActions.makeIdentity<{
    offset: number;
    meta: { prices: PriceDataSuccess };
  }>(),
  shiftStrike: presetActions.makeIdentity<{
    offset: number;
    meta: { prices: PriceDataSuccess };
  }>(),
  setCurrentCalc: presetActions.makeIdentity<CurrentCalculationState>(),
  setCurrentCalcs: presetActions.makeIdentity<CurrentCalculationState[]>(),
  setCurrentCalcsStrategies:
    presetActions.makeIdentity<CurrentCalculationQuickView[]>(),
  resetCurrentCalcsStrategies: presetActions.noPayload,
  updatePermission: presetActions.makeIdentity<CALCULATION_PERMISSION>(),
  addStrike: presetActions.makeIdentity<MultiStrikeCalculation>(),
  setStrikes: presetActions.makeIdentity<MultiStrikeCalculation[]>(),
  removeStrike: presetActions.makeIdentity<number>(),
  resetMultiStrikes: presetActions.noPayload,
  toggleMultiStrike: presetActions.noPayload,
  setMultiStrike: presetActions.makeIdentity<boolean>(),
  replaceLastStrike: presetActions.makeIdentity<MultiStrikeCalculation>(),
  // updateLegOrder: presetActions...
});

export default calcActions;
