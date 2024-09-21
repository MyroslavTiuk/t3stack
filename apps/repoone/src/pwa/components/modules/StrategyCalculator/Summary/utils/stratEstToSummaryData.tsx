import { isNull } from "errable";

import { type StrategyEstimate } from "opc-types/lib/StrategyEstimate";
import { type Nullable } from "opc-types/lib/util/Nullable";

import { makeFormatPrice } from "../../../../../../utils/String/formatPrice/formatPrice";
import isInfinite from "../../../../../../utils/Data/isInfinite";
import formatPercent from "../../../../../../utils/String/formatPercent/formatPercent";
import { type TDStatPair } from "../TdStatPair";

function formatMaxProfitDesc(maxReturnPrice: [number, number][]) {
  return maxReturnPrice.map((x, i) =>
    x[0] === 0 && x[1] === 0
      ? `at $${x[1]}`
      : x[0] === Infinity && x[1] === Infinity
      ? "on upside"
      : x[0] === 0
      ? `${i === 0 ? "below " : "below "}$${x[1]}`
      : x[1] === Infinity
      ? `${i === 0 ? "above " : "above "}$${x[0]}`
      : x[0] === x[1]
      ? `${i === 0 ? "at " : ""}$${x[0]}`
      : `$${x[0]}–$${x[1]}`
  );
}

const formatPrice = makeFormatPrice({
  hideMinus: false,
});
const formatPriceWPlus = makeFormatPrice({
  forcePlus: true,
});
const stratEstToSummaryData = (stratEst: Nullable<StrategyEstimate>) => {
  const sum = stratEst?.summary || null;
  return {
    entryCost: {
      label:
        !isNull(stratEst) && stratEst.initial.gross > 0
          ? "Initial premium:"
          : "Initial cost:",
      val: isNull(stratEst) ? "—" : formatPriceWPlus(stratEst.initial.gross),
      valClass:
        !isNull(stratEst) && stratEst.initial.gross < 0
          ? "--debit"
          : "--credit",
    },
    maxProfit: {
      label: "Max return:",
      val: !sum
        ? "—"
        : isInfinite(sum.maxReturn)
        ? "Infinite"
        : formatPrice(sum.maxReturn),
      valClass: sum && Number(sum.maxReturn) < 0 ? "--debit" : "--credit",
      note: !sum ? "" : formatMaxProfitDesc(sum.maxReturnPrice),
    },
    roiMaxRisk: {
      label: "Return on Risk:",
      val: !sum
        ? "—"
        : isInfinite(sum.maxReturn)
        ? "Infinite"
        : isInfinite(sum.maxRisk) || sum.maxReturn < 0 || sum.maxRisk >= 0
        ? "NA"
        : formatPercent(sum.maxReturn / -sum.maxRisk),
      valClass: !sum
        ? undefined
        : Number(sum.maxReturn) < 0
        ? "--debit"
        : isInfinite(sum.maxRisk) ||
          Number(sum.maxReturn) < 0 ||
          sum.maxRisk >= 0
        ? "--low-relevance"
        : "--credit",
    },
    roiCollateral: !sum?.roiCollateral
      ? null
      : {
          label: "Return on Collateral:",
          val: isInfinite(sum.roiCollateral)
            ? "Infinite"
            : formatPercent(sum.roiCollateral),
          valClass: !sum?.roiCollateral
            ? undefined
            : Number(sum.roiCollateral) < 0
            ? "--debit"
            : "--credit",
        },
    // roiEntryCost: (sum && stratEst) && (isInfinite(sum.maxRisk) || (
    //   !isInfinite(sum.maxReturn) && (
    //     sum.maxReturn / -sum.maxRisk !== sum.maxReturn / Math.abs(stratEst.initial.gross)
    //   ) &&
    //   stratEst.initial.gross < 0
    // ))
    //   ? {
    //     label: 'ROI vs Entry Cost:',
    //     val: isInfinite(sum.maxReturn) ? infNode
    //       : formatPercent(sum.maxReturn / Math.abs(stratEst.initial.gross)),
    //   }
    //   : false as false,
    // as % held (??)
    // roiRisk1SD:
    //   notNull(sum) && notNull(sum.maxRisk1SD)
    //     ? {
    //         label: `Return on ${plusOrMinus(sum.maxRisk1SDpriceRel)}1SD risk:`,
    //         val: isInfinite(sum.maxReturn)
    //           ? 'Inf.'
    //           : sum.maxReturn < 0 || sum.maxRisk1SD >= 0
    //           ? 'NA'
    //           : formatPercent(sum.maxReturn / -sum.maxRisk1SD),
    //       }
    //     : null,
    // roiRisk2SD:
    //   notNull(sum) && notNull(sum.maxRisk2SD)
    //     ? {
    //         label: `Return vs ${plusOrMinus(sum.maxRisk2SDpriceRel)}2SD risk:`,
    //         val: isInfinite(sum.maxReturn)
    //           ? 'Inf.'
    //           : sum.maxReturn < 0 || sum.maxRisk2SD >= 0
    //           ? 'NA'
    //           : formatPercent(sum.maxReturn / -sum.maxRisk2SD),
    //       }
    //     : null,
    maxRisk: {
      label: "Max risk:",
      val: !sum
        ? "—"
        : isInfinite(sum.maxRisk)
        ? "Infinite"
        : formatPriceWPlus(sum.maxRisk),
      valClass: !sum
        ? undefined
        : Number(sum.maxRisk) < 0 || isInfinite(sum.maxRisk)
        ? "--debit"
        : "--credit",
      note: !sum ? undefined : formatMaxProfitDesc(sum.maxRiskPrice),
      // : isInfinite(sum.maxRiskPrice)
      // ? 'on upside'
      // : `at ${formatPrice(sum.maxRiskPrice)}`,
    },
    maxRiskPrice: sum?.maxRiskPrice ?? null,
    collateral: !sum?.roiCollateral
      ? null
      : {
          label: "Collateral:",
          val: !sum?.collateral ? "—" : formatPriceWPlus(sum.collateral),
          valClass: !sum?.collateral
            ? undefined
            : sum.collateral < 0
            ? "--debit"
            : "--credit",
        },
    /*maxRiskPercProfit: {
      label: 'Risk as % Max Profit',
      val: isInfinite(stratEst.summary.maxRisk) ? infNode
        : isInfinite(stratEst.summary.maxReturn) ? 'NA'
          : formatPercent(stratEst.summary.maxRisk / stratEst.summary.maxReturn),
    },
    maxRiskPercEntryCost: {
      label: 'Risk as % Entry Cost',
      val: isInfinite(stratEst.summary.maxRisk) ? infNode
        : isInfinite(stratEst.summary.maxReturn) ? 'NA'
          : formatPercent(stratEst.summary.maxRisk / stratEst.summary.maxReturn),
    },*/
    // maxRisk1SD:
    //   notNull(sum) &&
    //   notNull(sum.maxRisk1SD) &&
    //   ({
    //     label: `Risk at ${plusOrMinus(sum.maxRisk1SDpriceRel)}1SD:`,
    //     val: formatPrice(-sum.maxRisk1SD),
    //     valClass: sum.maxRisk1SD < 0 ? '--debit' : undefined,
    //   } as TDStatPair | false),
    // maxRisk2SD:
    //   notNull(sum) &&
    //   notNull(sum.maxRisk2SD) &&
    //   ({
    //     label: `Risk at ${plusOrMinus(sum.maxRisk2SDpriceRel)}2SD:`,
    //     val: formatPrice(sum.maxRisk2SD),
    //     valClass: sum.maxRisk2SD < 0 ? '--debit' : undefined,
    //   } as TDStatPair | false),
    breakevens: {
      label: `B/E${sum && sum.breakevens.length > 1 ? "s" : ""} at expiry:`,
      val:
        !sum || !sum.breakevens.length
          ? "NA"
          : formatMaxProfitDesc(
              sum.breakevens.map((x) =>
                x[1] === -1 ? [0, x[0]] : [x[0], Infinity]
              )
            ),
      valClass: !sum || !sum.breakevens.length ? "--low-relevance" : undefined,
    },
    warning:
      ((Number(sum?.maxReturn) || 0) < 0 || (Number(sum?.maxRisk) || 0) > 0) &&
      ({
        label: `Calculator found no ${
          (Number(sum?.maxRisk) || 0) > 0 ? "risk" : "profit"
        }`,
        labelClass: "--no-val",
      } as TDStatPair | false),
    pop:
      !sum || sum?.pop === null
        ? (false as const)
        : {
            label: "Prob. of profit:",
            val: formatPercent(sum?.pop),
            // val: [
            //   `B/E: ${formatPercent(sum?.pop)}`,
            //   isNil(sum.pop50) ? '' : `P50: ${formatPercent(sum?.pop50)}`,
            //   isNil(sum.pop75) ? '' : `P75: ${formatPercent(sum?.pop75)}`,
            //   isNil(sum.pop100) ? '' : `PMax: ${formatPercent(sum?.pop100)}`,
            // ].filter(x => !!x).join(', ')
          },
    pop75:
      !sum || sum?.pop75 === null
        ? (false as const)
        : {
            label: "PoP75",
            val: formatPercent(sum?.pop75),
            help: "Probability of returning at least 75% of the maximum profit at expiry",
          },
    pop100:
      !sum || sum?.pop100 === null
        ? (false as const)
        : {
            label: "PoP100",
            val: formatPercent(sum?.pop100),
            help: "Probability of returning maximum profit at expiry",
          },
  };
};

export default stratEstToSummaryData;
