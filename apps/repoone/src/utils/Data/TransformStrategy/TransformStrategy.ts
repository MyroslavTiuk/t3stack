import * as R from "ramda";

import {
  type StratLegOpt,
  type StratLegOptDef,
} from "opc-types/lib/StratLegOpt";
import {
  type StratLegStock,
  type StratLegStockDef,
} from "opc-types/lib/StratLegStock";
import { type StratLeg, type StratLegDef } from "opc-types/lib/StratLeg";
import { type StratMenu } from "opc-types/lib/StratMenu";
import { type StrategiesDef } from "opc-types/lib/Strategies";
import { type Strategy, type StrategyDef } from "opc-types/lib/Strategy";
import { type DisplayValueTypes } from "opc-types/lib/DisplayValueTypes";
import { type PriceData } from "opc-types/lib/PriceData";
import { CALCULATION_PERMISSION } from "../../../types/enums/CALCULATION_PERMISSIONS";
import { PRICE_RESULT } from "../../../types/enums/PRICE_RESULT";
import { type MATRIX_YAXIS_TYPES } from "../../../types/enums/MATRIX_YAXIS_TYPES";
import ifUndef from "../ifUndef/ifUndef";
import { PREFERENCES } from "../../../config/Preferences";

import getBestCurVol from "../../Finance/getBestCurVol";
import { type TIME_DECAY_BASIS } from "../../../types/enums/TIME_DECAY_BASIS";
import { type Nullable } from "opc-types/lib/util/Nullable";

/**
 * Service for transforming calculation data from one structure to another
 *
 * Requires knowledge of the structure of Strategies, and assists in setting
 * the required structure of calc_init state
 */

export type DefaultOptLeg = {
  opType: "put" | "call";
  price: number;
  strike: number;
  num: number;
  act?: "buy" | "sell";
  expiry: string;
  iv?: number;
};

interface Cfg {
  timeDecayBasis?: TIME_DECAY_BASIS;
  defaultDisplayValueType?: DisplayValueTypes;
  defaultMatrixSecondaryYAxisType?: MATRIX_YAXIS_TYPES;
  defaultSymbol?: string;
  defaultOptLegs?: DefaultOptLeg[];
  prices?: PriceData;
  customPrices?: boolean;
  wasImported?: boolean;
}

export const getMetadata = (stratObj: StrategyDef) => {
  return {
    ...stratObj.metadata,
    keywords: ifUndef(stratObj.metadata.keywords, []),
    category: {
      naked: false,
      married: false,
      ...stratObj.metadata.category,
    },
  };
};

const TransformStrategy = {
  stratToInitialState: (stratObj: StrategyDef, cfg: Cfg = {}): Strategy => {
    return {
      id: null,
      ...stratObj,
      metadata: getMetadata(stratObj),
      settings: {
        ...stratObj.settings,
        showLinkOpTypes: ifUndef(stratObj.settings?.showLinkOpTypes, false),
        showLinkExpiries: ifUndef(stratObj.settings?.showLinkExpiries, false),
        showLinkStrikes: ifUndef(stratObj.settings?.showLinkStrikes, false),
        showLinkNum: ifUndef(stratObj.settings?.showLinkNum, false),
      },
      changeOpType: ifUndef(stratObj.defaults.changeOpType, false),
      changeAct: ifUndef(stratObj.defaults.changeAct, false),
      linkExpiries: ifUndef(stratObj.defaults.linkExpiries, false),
      linkStrikes: ifUndef(stratObj.defaults.linkStrikes, false),
      linkOpTypes: ifUndef(stratObj.defaults.linkOpTypes, false),
      linkNum: ifUndef(stratObj.defaults.linkNum, false),
      ...stratObj.defaults,
      timeFrame: null,
      legs: stratObj.legs || Object.keys(stratObj.legsById),
      legsById: Object.fromEntries(
        Object.entries(stratObj.legsById).map(([legId, legDef], legNo) => [
          legId,
          TransformStrategy.default_leg(cfg)(legDef, legNo),
        ])
      ),
      displayValueType:
        cfg.defaultDisplayValueType || PREFERENCES.DEFAULT_DISPLAY_VALUE_TYPE,
      matrixSecondaryYAxisType:
        cfg.defaultMatrixSecondaryYAxisType ||
        PREFERENCES.DEFAULT_MATRIX_YAXIS_TYPE,
      ivShift: 0,
      atmIV:
        (cfg.prices?.result === PRICE_RESULT.SUCCESS &&
          cfg.timeDecayBasis &&
          getBestCurVol(cfg.prices, { timeDecayBasis: cfg.timeDecayBasis })) ||
        null,
      histIV:
        (cfg.prices?.result === PRICE_RESULT.SUCCESS &&
          cfg.prices?.stock?.ivHist) ||
        null,
      timeOfCalculation: null,
      originalEstimate: null,
      priceRange: [null, null],
      imported: cfg.wasImported || false,
      permission: CALCULATION_PERMISSION.PRIVATE,
    };
  },

  default_leg:
    (cfg: Cfg) =>
    (obj: StratLegDef, legIndex: number): StratLeg => {
      switch (obj.type) {
        case "stock":
          return TransformStrategy.default_stockLeg(obj, cfg);
        case "option":
          // eslint-disable-next-line no-case-declarations
          const optionLegNo = legIndex - 1;
          return TransformStrategy.default_optionLeg(obj, cfg, optionLegNo);
        default:
          throw new Error("unknown element in strategy");
      }
    },

  default_stockLeg: (obj: StratLegStockDef, cfg: Cfg): StratLegStock => {
    const defaults = {
      act: obj.defaults?.act || null,
      name: obj.defaults?.name || "Underlying stock symbol",
      num: obj.defaults?.num || null,
      linkNum: Boolean(obj.settings?.suggestedNumEle) || false,
      val: cfg.defaultSymbol || obj.defaults?.val || "",
      curPriceUpdated: (cfg.defaultSymbol && cfg.prices?.retrievedTime) || null,
      curPriceBid: (cfg.defaultSymbol && cfg.prices?.stock?.bid) || null,
      curPriceAsk: (cfg.defaultSymbol && cfg.prices?.stock?.ask) || null,
      curPriceLast: (cfg.defaultSymbol && cfg.prices?.stock?.last) || null,
      price: null,
    };
    return {
      type: "stock",
      ...defaults,
      settings: {
        allowPurchase: obj.settings?.allowPurchase || false,
        changeAct: obj.settings?.changeAct || false,
        suggestedNum: obj.settings?.suggestedNum || [],
        suggestedNumEle: obj.settings?.suggestedNumEle || [],
      },
      defaults: {
        ...defaults,
        ...obj.defaults,
      },
    };
  },

  default_optionLeg: (
    obj: StratLegOptDef,
    cfg: Cfg,
    legNo = 0
  ): StratLegOpt => {
    const defaults = {
      name: obj.defaults?.name || "Option",
      act: cfg.defaultOptLegs?.[legNo]?.act || obj.defaults?.act || null,
      opType:
        cfg.defaultOptLegs?.[legNo]?.opType || obj.defaults?.opType || null,
      expiry:
        cfg.defaultOptLegs?.[legNo]?.expiry || obj.defaults?.expiry || null,
      // iv: obj.defaults?.iv || null,
      num: cfg.defaultOptLegs?.[legNo]?.num || obj.defaults?.num || null,
      underlying: obj.defaults?.underlying || "",
      price: cfg.defaultOptLegs?.[legNo]?.price || null,
      priceRange: [
        cfg.defaultOptLegs?.[legNo]?.price || null,
        cfg.defaultOptLegs?.[legNo]?.price || null,
      ] as [Nullable<number>, Nullable<number>],
      // inputStyle: obj.defaults?.inputStyle || null,
      showDetails: obj.defaults?.showDetails || false,
      showGreeks: obj.defaults?.showGreeks || false,
      showExitPrice: obj.defaults?.showExitPrice || false,
      strike: cfg.defaultOptLegs?.[legNo]?.strike || null,
      customPrice: cfg.defaultOptLegs?.[legNo]?.price
        ? true
        : cfg?.customPrices || false,
      linkNum: Boolean(obj.settings?.suggestedNumEle),
    };
    return {
      type: "option",
      iv: null,
      price: null,
      priceRange: [null, null],
      strike: cfg.defaultOptLegs?.[legNo]?.strike,
      disabled: false,
      ...defaults,
      settings: {
        renamable: ifUndef(obj.settings?.renamable, true),
        // changeAct: ifUndef(obj.settings?.changeAct, false),
        // changeOpType: ifUndef(obj.settings?.changeOpType, false),
        // showUnderlying: ifUndef(obj.settings?.showUnderlying, false),

        // todo: change suggested... method to use weighting instead

        suggestedNumEle: ifUndef(obj.settings?.suggestedNumEle, undefined),
        suggestedNum: ifUndef(obj.settings?.suggestedNum, []),
        collateralPerc: ifUndef(obj.settings?.collateralPerc, undefined),
      },
      defaults,
    };
  },

  stratsToStratMenu: (
    strats: StrategiesDef,
    groupBy = "complexity"
  ): StratMenu =>
    R.pipe(
      (s: StrategiesDef) => Object.values(s) as StrategyDef[],
      R.map((s) => ({
        access: s.settings.access,
        category: {
          // naked: false,
          ...s.metadata.category,
        },
        stratKey: s.metadata.stratKey,
        menuVisibility: s.metadata.menuVisibility,
        ...R.pick(["titleShort", "title"], s),
      })),
      R.reduce(
        (accStratMenu, partStrat) => {
          // @ts-ignore (I have provided fallback)
          if (R.isNil(accStratMenu[partStrat.category[groupBy] || ""])) {
            // eslint-disable-next-line no-param-reassign
            // @ts-ignore
            accStratMenu[partStrat.category[groupBy]] = [partStrat];
            return accStratMenu;
          }
          // @ts-ignore (I have provided fallback)
          accStratMenu[partStrat.category[groupBy] || ""].push(partStrat);
          return accStratMenu;
        },
        // eslint-disable-next-line
        {} as StratMenu
      )
    )(strats),
};

export default TransformStrategy;
