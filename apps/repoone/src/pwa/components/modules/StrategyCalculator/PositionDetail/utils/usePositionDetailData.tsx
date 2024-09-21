import { type ReactNode } from "react";
import { isNull, type Nullable, type Optional } from "errable";
import { mergeRight } from "ramda";
// import moment from "moment";

import { type StratLeg } from "opc-types/lib/StratLeg";

import formatOption from "../../../../../../utils/String/formatOption/formatOption";
import {
  isStratLegOpt,
  isStratLegStock,
} from "../../../../../../utils/Finance/Strategy";

import {
  disclaimerClasses,
  formatPriceCents,
  type ViewProps,
} from "../PositionDetail.view";
// import { FMT_YYYY_MM_DD } from "../../../../../../consts/DATE_TIME";
import { PIN_RISK } from "../../../../../../types/enums/PIN_RISK";

type Keys = "estimate" | "strat" | "highlightedPosition";

type PositionDetailData = {
  components: {
    desc: string;
    priceEach: string | ReactNode;
    num: Nullable<number>;
    mult: Nullable<number>;
    act: string;
    total: number;
  }[];
  opening?: {
    desc: string;
    priceEach: number;
    num: Nullable<number>;
    total: number;
  };
  total: number;
  hasPinRisk: PIN_RISK;
};

type Cfg = {
  stockChangeInValue: boolean;
};

const makeLegDesc = (leg: Optional<StratLeg>) => {
  return !leg ? "" : isStratLegOpt(leg) ? formatOption(leg) : leg.val || "";
};

const inverseAct = {
  buy: "sell",
  sell: "buy",
};

const DEFAULT_CFG: Cfg = {
  stockChangeInValue: true,
};

// note:
// const getDatesThatHaveExpired = (datetime: string) => {
//   const [date, time] = datetime.split("_") as [
//     Optional<string>,
//     Optional<string>
//   ];
//   if (time && time >= "1600") {
//     return date;
//   } else if (date) {
//     return moment(date).subtract(1, "days").format(FMT_YYYY_MM_DD);
//   }
//   return null;
// };

export const usePositionDetailData = (
  props: Pick<ViewProps, Keys>,
  partialCfg: Partial<Cfg>
): PositionDetailData => {
  const cfg = mergeRight(DEFAULT_CFG, partialCfg) as Cfg;
  const legIds = !props.estimate
    ? []
    : Object.keys(props.estimate.initial.legs);
  const initial = props.estimate?.initial;
  const theoPoints = props.estimate?.theoPoints;
  const highlightedPosition = props.highlightedPosition;

  let hasPinRisk = PIN_RISK.NONE;

  // todo Note 'change in stock price'
  const theoPoint =
    !theoPoints || !highlightedPosition
      ? null
      : theoPoints[highlightedPosition.strike]?.[highlightedPosition.date];
  const components =
    !initial || !theoPoints
      ? []
      : !(isNull(highlightedPosition) || theoPoint)
      ? []
      : legIds.map((legId) => {
          const leg = props.strat?.legsById[legId];
          const theoPointLeg = theoPoint?.legs?.[legId];
          const showForInitial = isNull(highlightedPosition);
          const act = showForInitial
            ? initial.legs[legId].act
            : inverseAct[initial.legs[legId].act];
          const num =
            (((act === "sell" ? 1 : -1) *
              (initial.legs[legId].num || 0)) as Nullable<number>) || null;
          const priceEach = isNull(highlightedPosition)
            ? initial.legs[legId].value
            : theoPointLeg?.value || 0;
          const priceEachStr = formatPriceCents(priceEach);
          const mult =
            leg && isStratLegStock(leg) ? null : initial.contractsPerShare;
          const legStk = leg && isStratLegOpt(leg) && leg.strike;
          const expiresWorthless =
            theoPointLeg?.expiring &&
            priceEach === 0 &&
            highlightedPosition?.strike !== legStk;
          const pinRisk = theoPointLeg?.pinRisk;
          hasPinRisk = [hasPinRisk, pinRisk].includes(PIN_RISK.HIGH)
            ? PIN_RISK.HIGH
            : [hasPinRisk, pinRisk].includes(PIN_RISK.LOW)
            ? PIN_RISK.LOW
            : PIN_RISK.NONE;
          return {
            desc: !leg
              ? ""
              : `${
                  leg && isStratLegStock(leg) && cfg.stockChangeInValue
                    ? "Change in "
                    : expiresWorthless
                    ? ""
                    : act === "sell" && showForInitial
                    ? "Sell "
                    : act === "buy" && showForInitial
                    ? "Buy "
                    : act === "sell" && !showForInitial
                    ? "Sell "
                    : act === "buy" && !showForInitial
                    ? "Buy "
                    : ""
                }${makeLegDesc(props.strat?.legsById[legId] || undefined)}`,
            num: num ? Math.abs(num) : num,
            mult,
            act,
            priceEach: (
              <>
                {!expiresWorthless ? priceEachStr : "Expires"}
                {pinRisk && pinRisk !== PIN_RISK.NONE && (
                  <span className={pinRisk && disclaimerClasses[pinRisk]}>
                    *
                  </span>
                )}
              </>
            ),
            total: (num || 1) * priceEach * (mult || 1),
          };
        });

  return {
    components,
    opening: {
      desc: `- Opening cost`,
      num: null,
      priceEach: 0,
      total: initial?.gross || 0,
    },
    total: components.reduce((t, d) => t + d.total, 0),
    hasPinRisk,
  };
};
