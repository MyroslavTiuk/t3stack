import { omit, set, lensPath, pipe } from "ramda";

import { type Strategy } from "opc-types/lib/Strategy";
import { type StratLeg } from "opc-types/lib/StratLeg";
import {
  type StratLegOpt,
  type StratLegOptDef,
} from "opc-types/lib/StratLegOpt";
import { type StratName } from "opc-types/lib/StratName";
import { type CurrentCalculationState } from "opc-types/lib/store/CurrentCalculationState";

import legsWithIds from "../../selectors/currentCalculation/legsWithIds";
import filterOptionLegs from "../../selectors/currentCalculation/filterOptionLegs";
import createOptionLegDef from "../../../../model/helpers/createOptionLegDef";
import TransformStrategy from "../../../../utils/Data/TransformStrategy/TransformStrategy";
import strategyDefs from "../../../../model/strategyDefs";
import { mapObj } from "../../../../utils/Data";

function legsAreEven(curLegs: (StratLeg & { legId: string })[]) {
  return !curLegs.reduce((acc, item) => {
    return (
      acc ||
      !!item.settings?.suggestedNum.find(
        (num) => num !== 0.01 && num !== 1 && num !== 100
      )
    );
  }, false);
}

function setSuggestedNums(
  optDef: StratLegOptDef,
  curLegs: (StratLegOpt & { legId: string })[]
) {
  if (!optDef.settings) optDef.settings = {};
  if (legsAreEven(curLegs)) {
    optDef.settings.suggestedNumEle = ["OPTIONS", "underlying"];
    optDef.settings.suggestedNum = [1, 0.01];
    optDef.defaults.num = curLegs[0].num;
  } else {
    optDef.settings.suggestedNumEle = [
      "underlying",
      ...curLegs.map((item) => item.legId),
    ];
    optDef.settings.suggestedNum = [
      0.01,
      ...curLegs.map((leg) => {
        return 1 / (leg.defaults.num || 1);
      }),
    ];
    optDef.defaults.num = curLegs[0].num;
  }
}
function setSuggestedExps(
  optDef: StratLegOptDef,
  curLegs: (StratLegOpt & { legId: string })[]
) {
  // console.log(curLegs[curLegs.length - 1].expiry);
  optDef.defaults.expiry = curLegs[curLegs.length - 1].expiry;
}

function updateLegs(legId: string, state: Strategy) {
  return mapObj((leg) => {
    return pipe(
      set(lensPath(["settings", "suggestedNum"]), [
        leg.defaults.num || 1,
        ...(leg.settings.suggestedNum || []),
      ]),
      set(lensPath(["settings", "suggestedNumEle"]), [
        legId,
        ...(leg.settings.suggestedNumEle || []),
      ])
    )(leg);
  }, state.legsById);
}

const addLegReducer = (state: CurrentCalculationState) => {
  if (!state) return state;
  const curLegs = legsWithIds(filterOptionLegs(state));
  const legSize = curLegs.length;

  let iterator = legSize + 1;
  let legNumber = 1;
  while (iterator !== 0) {
    if (state?.legs.includes(`leg-${iterator}`)) {
      iterator -= 1;
    } else {
      legNumber = iterator;
      break;
    }
  }
  const stratName = <StratName>`custom`;
  const legName = `leg-${legNumber}`;
  const optDef = createOptionLegDef(`Leg ${legNumber}`);
  setSuggestedNums(optDef, curLegs);
  setSuggestedExps(optDef, curLegs);
  if (curLegs.length === 1 && curLegs[0].defaults.opType) {
    optDef.defaults.opType = curLegs[0].defaults.opType;
  }
  const updatedLegs = updateLegs(legName, state);

  const defaultOptionLeg = TransformStrategy.default_optionLeg(optDef, {});
  const newStratDef = omit(["legsById"], strategyDefs[stratName]);
  const newLegs = [...(state?.legs || []), legName];
  const newLegsById = {
    ...updatedLegs,
    [legName]: defaultOptionLeg,
  };

  const newState2 = {
    ...state,
    ...newStratDef,
    linkNum: curLegs.length === 1 ? true : state.linkNum,
    legs: newLegs,
    legsById: newLegsById,
  } as CurrentCalculationState;

  return newState2;
};

export default addLegReducer;
