// @ts-nocheck

import { type StratLegStock } from "opc-types/lib/StratLegStock";
import { type StratLegOpt } from "opc-types/lib/StratLegOpt";
import { type ObjRecord } from "opc-types/lib/util/ObjRecord";
import { type PriceData } from "opc-types/lib/PriceData";

import { type V2CalcSkel } from "./convertV2calc";
import parseInt10 from "../../Maths/parseInt10";
import short from "short-uuid";
import getBestCurVol from "../../Finance/getBestCurVol";
import { TIME_DECAY_BASIS } from "../../../types/enums/TIME_DECAY_BASIS";

const single = {
  option: "option",
};
const spread = {
  long: "long",
  short: "short",
};
const v2legNameMap = {
  "covered-call": single,
  purchase: single,
  "cash-secured-put": single,
  "vertical-spread": spread,
  "long-call": single,
  "short-call": single,
  "long-put": single,
  "short-put": single,
  "bearish-call-credit-spread": spread,
  "bullish-put-credit-spread": spread,
  "bullish-call-debit-spread": spread,
  "bearish-put-debit-spread": spread,
  "pmcc-poor-mans-covered-call": spread,
  "calendar-spread": spread,
  "diagonal-spread": spread,
  "ratio-backspread": spread,
  straddle: {
    "call-option": "call-option",
    "put-option": "put-option",
  },
  strangle: {
    "call-option": "call-option",
    "put-option": "put-option",
  },
  "covered-strangle": {
    "call-option": "call-option",
    "put-option": "put-option",
  },
  collar: {
    floor: "floor",
    cap: "cap",
  },
  "iron-condor": {
    "long-call": "long-call",
    "long-put": "long-put",
    "short-call": "short-call",
    "short-put": "short-put",
  },
  "double-diagonal-spread": {
    "long-call": "long-call",
    "long-put": "long-put",
    "short-call": "short-call",
    "short-put": "short-put",
  },
  butterfly: {
    lower: "lower",
    middle: "middle",
    upper: "upper",
  },
  "2-legs": {
    "leg-1": "leg-1",
    "leg-2": "leg-2",
  },
  "3-legs": {
    "leg-1": "leg-1",
    "leg-2": "leg-2",
    "leg-3": "leg-3",
  },
  "4-legs": {
    "leg-1": "leg-1",
    "leg-2": "leg-2",
    "leg-3": "leg-3",
    "leg-4": "leg-4",
  },
  "5-legs": {
    "leg-1": "leg-1",
    "leg-2": "leg-2",
    "leg-3": "leg-3",
    "leg-4": "leg-4",
    "leg-5": "leg-5",
  },
  "6-legs": {
    "leg-1": "leg-1",
    "leg-2": "leg-2",
    "leg-3": "leg-3",
    "leg-4": "leg-4",
    "leg-5": "leg-5",
    "leg-6": "leg-6",
  },
  "7-legs": {
    "leg-1": "leg-1",
    "leg-2": "leg-2",
    "leg-3": "leg-3",
    "leg-4": "leg-4",
    "leg-5": "leg-5",
    "leg-6": "leg-6",
    "leg-7": "leg-7",
  },
  "8-legs": {
    "leg-1": "leg-1",
    "leg-2": "leg-2",
    "leg-3": "leg-3",
    "leg-4": "leg-4",
    "leg-5": "leg-5",
    "leg-6": "leg-6",
    "leg-7": "leg-7",
    "leg-8": "leg-8",
  },
};

const parseFloatOrUndef = (n: string | undefined) => {
  if (typeof n === "number") return n;
  const r = typeof n !== "string" ? undefined : parseFloat(n);
  if (isNaN(r)) return undefined;
  return r;
};

export default function transform(
  strat: Strategy,
  v2calcInfo: V2CalcSkel,
  prices: ObjRecord<PriceData> = {}
) {
  const v2calc = v2calcInfo.vars;

  const symb = (v2calc?.["underlying-symbol"] || "").toUpperCase();

  const curStock = prices[symb]?.stock || null;

  (strat.legsById.underlying as StratLegStock).val = symb;
  (strat.legsById.underlying as StratLegStock).curPriceLast = parseFloatOrUndef(
    curStock?.last || v2calc?.["underlying-curPrice"]
  );
  (strat.legsById.underlying as StratLegStock).curPriceAsk = parseFloatOrUndef(
    curStock?.ask
  );
  (strat.legsById.underlying as StratLegStock).curPriceBid = parseFloatOrUndef(
    curStock?.bid
  );
  (strat.legsById.underlying as StratLegStock).curPriceUpdated = -1;

  if (v2calc?.["underlying-act"] && v2calc?.["underlying-num"]) {
    (strat.legsById.underlying as StratLegStock).act =
      v2calc?.["underlying-act"];
    (strat.legsById.underlying as StratLegStock).num = parseFloat(
      v2calc?.["underlying-num"]
    );
    (strat.legsById.underlying as StratLegStock).price = parseFloatOrUndef(
      v2calc?.["underlying-price"] || curStock?.last
    );
  }
  if (parseInt10(v2calc?.["underlying-active"])) {
    strat.legsById.underlying.settings.allowPurchase = true;
  }
  strat.atmIV =
    (prices[symb]?.options &&
      prices[symb]?.stock &&
      getBestCurVol(prices[symb], {
        timeDecayBasis: TIME_DECAY_BASIS.CALENDAR_DAYS,
      })) ||
    undefined;
  strat.id = short.generate();
  strat.timeOfCalculation = Date.now();
  strat.priceRange = [
    parseFloat(v2calc?.["graph-priceMin"]) || null,
    parseFloat(v2calc?.["graph-priceMax"]) || null,
  ];

  // graph-type

  const legMap = v2legNameMap[strat.metadata.stratKey];
  if (!legMap) throw Error("Strategy not found in leg map");

  const v3legNames = Object.keys(legMap);
  v3legNames.forEach((v3legName) => {
    const strike = parseFloat(v2calc?.[`${legMap[v3legName]}-${"strike"}`]);
    (strat.legsById[v3legName] as StratLegOpt)["strike"] = strike;

    const expiry = v2calc?.[`${legMap[v3legName]}-${"expiry"}`].replace(
      /-/g,
      ""
    );
    (strat.legsById[v3legName] as StratLegOpt)["expiry"] = expiry;

    const opType = v2calc?.[`${legMap[v3legName]}-${"opType"}`];
    (strat.legsById[v3legName] as StratLegOpt)["opType"] =
      { c: "call", p: "put" }[opType] || null;

    // DOING THIS -->
    const curOptPrice = prices[symb]?.options?.[expiry]?.[opType]?.[strike];
    const curIv = curOptPrice?.iv;
    (strat.legsById[v3legName] as StratLegOpt)["iv"] =
      parseFloat(v2calc?.[`${legMap[v3legName]}-${"iv"}`]) || curIv;

    (strat.legsById[v3legName] as StratLegOpt)["num"] = parseInt10(
      v2calc?.[`${legMap[v3legName]}-${"num"}`]
    );
    (strat.legsById[v3legName] as StratLegOpt)["price"] = parseFloat(
      v2calc?.[`${legMap[v3legName]}-${"price"}`]
    );
    // Price range is wrong here
    (strat.legsById[v3legName] as StratLegOpt)["priceRange"] = [
      curOptPrice?.b || null,
      curOptPrice?.a || null,
    ];
    (strat.legsById[v3legName] as StratLegOpt)["price"] = parseFloat(
      v2calc?.[`${legMap[v3legName]}-${"price"}`]
    );
    (strat.legsById[v3legName] as StratLegOpt)["act"] =
      v2calc?.[`${legMap[v3legName]}-${"act"}`];
    (strat.legsById[v3legName] as StratLegOpt)["customPrice"] = true;
  });
}
