import React, { type FC } from "react";
import { mapObjIndexed } from "ramda";

import { isNull, isUndefined } from "errable";

import {
  type NetSummaryProps,
  type NetSummaryPublicProps,
} from "./NetSummary.props";

import { type Nullable } from "opc-types/lib/util/Nullable";
import { type Strategy } from "opc-types/lib/Strategy";
import filterOptionLegs from "../../../../store/selectors/currentCalculation/filterOptionLegs";
import legsWithIds from "../../../../store/selectors/currentCalculation/legsWithIds";
import getOverarchingNum from "../../../../../utils/Finance/overarching/getOverarchingNum";
import round from "../../../../../utils/Data/round/round";
import useDispaction from "../../../../../utils/Redux/useDispaction";
import calcActions from "../../../../store/actions/calculator";
import {
  isStratLegOpt,
  isStratLegStock,
} from "../../../../../utils/Finance/Strategy";
import calcOptionGreeks from "../../../../../utils/Finance/calcOptionGreeks";

import NetSummaryView from "./NetSummary.view";
import { type ObjRecord } from "opc-types/lib/util/ObjRecord";
import ifUndef from "../../../../../utils/Data/ifUndef/ifUndef";
import { useSession } from "../../Session/SessionProvider";
import { type TIME_DECAY_BASIS } from "../../../../../types/enums/TIME_DECAY_BASIS";
import { type EstimateConfig } from "../../../../../services/calculate/strategyEstimates";

const addGreek =
  (act: "buy" | "sell", mult: number) =>
  (acc: Nullable<number>, val: Nullable<number>) =>
    isNull(acc) || isNull(val)
      ? null
      : acc + (act === "sell" ? -1 : 1) * val * mult;

function getNetGreeks(
  currentCalc: Strategy,
  cfg: Pick<EstimateConfig, "timeDecayBasis">
): ObjRecord<Nullable<number>> {
  const legGreeks = mapObjIndexed((leg, legId) => {
    if (isStratLegStock(leg)) {
      return {
        delta: 1,
        gamma: 0,
        theta: 0,
        vega: 0,
      };
    } else if (isStratLegOpt(leg)) {
      if (!leg.expiry || !leg.opType || !leg.act || !leg.strike) return null;
      return calcOptionGreeks(currentCalc, cfg.timeDecayBasis, legId);
    } else return null;
  }, currentCalc.legsById);
  const spreadScale = getOverarchingNum(currentCalc) || 1;

  const greeksPrecise = legsWithIds(currentCalc.legsById).reduce(
    (acc, leg) => {
      const legNumScaled = leg.num ? leg.num / spreadScale : 0;
      const addGreek_ = addGreek(leg.act || "buy", legNumScaled);
      return {
        delta: addGreek_(
          ifUndef(acc.delta, null),
          ifUndef(legGreeks[leg.legId]?.delta, null)
        ),
        gamma: addGreek_(
          ifUndef(acc.gamma, null),
          ifUndef(legGreeks[leg.legId]?.gamma, null)
        ),
        theta: addGreek_(
          ifUndef(acc.theta, null),
          ifUndef(legGreeks[leg.legId]?.theta, null)
        ),
        vega: addGreek_(
          ifUndef(acc.vega, null),
          ifUndef(legGreeks[leg.legId]?.vega, null)
        ),
      };
    },
    {
      delta: 0,
      gamma: 0,
      theta: 0,
      vega: 0,
    } as ObjRecord<Nullable<number>>
  );
  return {
    delta: round(
      ifUndef(greeksPrecise.delta, null),
      Math.abs(greeksPrecise.delta || 1) < 0.01 ? 3 : 2
    ),
    gamma: round(
      ifUndef(greeksPrecise.gamma, null),
      Math.abs(greeksPrecise.gamma || 1) < 0.01 ? 3 : 2
    ),
    theta: round(
      ifUndef(greeksPrecise.theta, null),
      Math.abs(greeksPrecise.theta || 1) < 0.01 ? 3 : 2
    ),
    vega: round(
      ifUndef(greeksPrecise.vega, null),
      Math.abs(greeksPrecise.vega || 1) < 0.01 ? 3 : 2
    ),
  };
}

const useLogic = (props: NetSummaryPublicProps) => {
  const timeDecayBasis: TIME_DECAY_BASIS =
    useSession().userData.userSettings.timeDecayBasis;

  const minNum =
    (!isUndefined(props.currentCalc) && getOverarchingNum(props.currentCalc)) ||
    1;
  const opLegs = isUndefined(props.currentCalc)
    ? undefined
    : legsWithIds(filterOptionLegs(props.currentCalc));
  const spreadPrice = isUndefined(opLegs)
    ? null
    : opLegs.reduce((accSpreadPrice, legsWithId) => {
        const actMulti = legsWithId.act === "sell" ? -1 : 1;
        return !legsWithId.act ||
          !legsWithId.num ||
          !legsWithId.price ||
          isNull(accSpreadPrice)
          ? null
          : accSpreadPrice +
              actMulti * (legsWithId.num / minNum) * legsWithId.price;
      }, 0 as Nullable<number>);
  const spreadPriceRange = isUndefined(opLegs)
    ? null
    : opLegs.reduce(
        (accSpreadPrice, legsWithId): [Nullable<number>, Nullable<number>] => {
          const isSell = legsWithId.act === "sell";
          const actMulti = isSell ? -1 : 1;
          return !legsWithId.act ||
            !legsWithId.num ||
            !legsWithId.price ||
            isNull(accSpreadPrice[0]) ||
            isNull(accSpreadPrice[1]) ||
            isNull(legsWithId.priceRange[0]) ||
            isNull(legsWithId.priceRange[1])
            ? [null, null]
            : [
                accSpreadPrice[0] +
                  actMulti *
                    (legsWithId.num / minNum) *
                    // @ts-ignore (TS can't recognise that the index has been checked already)
                    legsWithId.priceRange?.[isSell ? 1 : 0],
                accSpreadPrice[1] +
                  actMulti *
                    (legsWithId.num / minNum) *
                    // @ts-ignore (TS can't recognise that the index has been checked already)
                    legsWithId.priceRange?.[isSell ? 0 : 1],
              ];
        },
        [0, 0] as [Nullable<number>, Nullable<number>]
      );
  const customPrice =
    (opLegs || []).reduce((acc, leg) => {
      if (acc === null || leg.customPrice) return leg.customPrice;
      return acc;
    }, null as Nullable<boolean>) || false;

  const greeks = !props.currentCalc
    ? { delta: null, gamma: null, theta: null, vega: null }
    : getNetGreeks(props.currentCalc, { timeDecayBasis });

  return {
    spreadPriceAsPerLegs:
      (spreadPrice && !isNaN(spreadPrice) && round(spreadPrice, 2)) || null,
    spreadPriceRangeAsPerLegs: [
      (spreadPriceRange?.[0] && round(spreadPriceRange[0], 2)) || null,
      (spreadPriceRange?.[1] && round(spreadPriceRange[1], 2)) || null,
    ] as [Nullable<number>, Nullable<number>],
    greeks,
    customPrice,
  };
};

const NetSummaryContainer: FC<NetSummaryPublicProps> = (
  props: NetSummaryPublicProps
) => {
  const {
    spreadPriceAsPerLegs,
    greeks,
    spreadPriceRangeAsPerLegs,
    // customPrice,
  } = useLogic(props);

  // const updateParam = useDispaction(calcActions.updateParam);
  const updateSpreadPrice = useDispaction(calcActions.updateSpreadPrice);
  const setSpreadPrice = React.useCallback(
    (num: number) => {
      updateSpreadPrice({
        spreadPrice: num,
        spreadPriceRange: spreadPriceRangeAsPerLegs,
      });
    },
    [updateSpreadPrice, spreadPriceRangeAsPerLegs]
  );

  // const toggleCustomPrice = React.useCallback(() => {
  //   updateParam({
  //     paramChain: ["legsById", "_ALL_OPTIONS", "customPrice"],
  //     paramValue: !customPrice,
  //   });
  // }, [customPrice, updateParam]);

  const viewProps: NetSummaryProps = {
    setSpreadPrice,
    spreadPriceAsPerLegs: spreadPriceAsPerLegs,
    spreadPriceRangeAsPerLegs: spreadPriceRangeAsPerLegs,
    greeks,
  };

  return <NetSummaryView {...viewProps} />;
};

export default NetSummaryContainer;
