import { mergeRight } from "ramda";

import { type Strategy } from "opc-types/lib/Strategy";
import { codeToExp, SHORT_YEAR_FLAG } from "../String/DateFormat/DateFormat";
import legsWithIds from "../../pwa/store/selectors/currentCalculation/legsWithIds";
import filterOptionLegs from "../../pwa/store/selectors/currentCalculation/filterOptionLegs";
import { err, type Errable, getErr, ifNotErr, isErr, isNull } from "errable";
import formatPrice from "../String/formatPrice/formatPrice";
import selectUnderlyingLeg from "../../pwa/store/selectors/currentCalculation/selectUnderlyingLeg";

/**
 * todo:
 *  if the strat.title has been edited from it's original title (yet to be implemented), this should
 *  use that customised title rather than compile the title.
 */

type Cfg = {
  includeSymbol: boolean;
  returnParts: boolean;
};

const defaultCfg = {
  includeSymbol: false,
  returnParts: false,
};

enum LEG_ERRORS {
  "LEG_MISSING",
  "MULTIPLE",
}

function getStrategyTitle(
  strat: Strategy,
  partialCfg?: Partial<Cfg> & { returnParts: true }
): { legs: string; strategy: string };
function getStrategyTitle(
  strat: Strategy,
  partialCfg?: Partial<Cfg> & { returnParts: false }
): string;
function getStrategyTitle(
  strat: Strategy,
  partialCfg: Partial<Cfg> = {}
): string | { legs: string; strategy: string } {
  const cfg = mergeRight(defaultCfg, partialCfg);

  const allOpLegs = legsWithIds(filterOptionLegs(strat), strat.legs).map(
    (leg) => {
      return {
        exp: !leg.expiry
          ? null
          : {
              ddmm: leg.expiry.substr(4, 4),
              yyyy: leg.expiry.substr(0, 4),
              desc: codeToExp(leg.expiry, true),
              descNoYear: codeToExp(leg.expiry, SHORT_YEAR_FLAG.NONE),
            },
        strike: leg?.strike || null,
      };
    }
  );

  const singleExpiry = allOpLegs.reduce(
    (acc, legParts) =>
      ifNotErr((acc_) => {
        if (isNull(legParts.exp)) return err(LEG_ERRORS.LEG_MISSING);
        if (acc_ === "") return legParts.exp.desc;
        if (legParts.exp.desc === acc_) return acc_;
        return err(LEG_ERRORS.MULTIPLE);
      }, acc),
    "" as Errable<number, string>
  );

  const singleStrike = allOpLegs.reduce(
    (acc, legParts) =>
      ifNotErr((acc_) => {
        if (isNull(legParts.strike)) return err(LEG_ERRORS.LEG_MISSING);
        if (acc_ === -1) return legParts.strike;
        if (legParts.strike === acc_) return acc_;
        return err(LEG_ERRORS.MULTIPLE);
      }, acc),
    -1 as Errable<number, number>
  );

  if (
    (isErr(singleExpiry) && getErr(singleExpiry) === LEG_ERRORS.LEG_MISSING) ||
    (isErr(singleStrike) && getErr(singleStrike) === LEG_ERRORS.LEG_MISSING)
  ) {
    return strat.title;
  }

  const legStrs = allOpLegs.reduce((acc, leg, i) => {
    const isLast = i === allOpLegs.length - 1;
    const isFirst = i === 0;

    // const isSameExpAsNext =
    //   !isLast && allOpLegs[i + 1].exp?.desc === leg.exp?.desc;
    const isSameExpAsLast =
      !isFirst && allOpLegs[i - 1].exp?.desc === leg.exp?.desc;
    const isSameExpYYasNext =
      !isLast && allOpLegs[i + 1].exp?.yyyy === leg.exp?.yyyy;
    const isSameStkAsNext = !isLast && allOpLegs[i + 1].strike === leg.strike;
    const showDollar = !isSameExpAsLast; //i === 0 || !isMultiStrike;

    const expPortion = isSameExpAsLast
      ? ""
      : `${isSameExpYYasNext ? leg.exp?.descNoYear : leg.exp?.desc}`;
    const stkPortion =
      isSameStkAsNext || leg.strike === null
        ? ""
        : `${formatPrice(leg.strike, { hideDollar: !showDollar })}`;
    const sp = expPortion.length && stkPortion.length ? " " : "";

    const str = `${expPortion}${sp}${stkPortion}`;
    const separator = isFirst ? "" : str.includes(" ") ? " / " : "/";
    return acc.concat([`${separator}${expPortion}${sp}${stkPortion}`]);
  }, [] as string[]);

  const legBits = `${
    cfg.includeSymbol ? `${selectUnderlyingLeg(strat)?.val} ` : ""
  }${legStrs.join("")}`;

  if (cfg.returnParts) {
    return {
      legs: legBits,
      strategy: strat.title,
    };
  }
  return `${legBits} ${strat.title}`;
}

export const getStrategyTitleParts = (
  strat: Strategy,
  partialCfg: Partial<Cfg> = {}
) => getStrategyTitle(strat, { ...partialCfg, returnParts: true });

export const getStrategyTitleStr = (
  strat: Strategy,
  partialCfg: Partial<Cfg> = {}
) => getStrategyTitle(strat, { ...partialCfg, returnParts: false });

export default getStrategyTitleStr;
