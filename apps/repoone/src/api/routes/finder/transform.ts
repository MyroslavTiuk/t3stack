import { type RequestOf } from "opc-types/lib/api/RequestOf";
import { type ReqParams, type DTO } from "./types";
import { type Outcome } from "opc-types/lib/Outcome";
import parseQueryObj from "./helpers/parseQueryObj";
import { mapObj } from "../../../utils/Data";
import ifUndef from "../../../utils/Data/ifUndef/ifUndef";
import parseInt10 from "../../../utils/Maths/parseInt10";

export default function transform(req: RequestOf<ReqParams>): Outcome<DTO> {
  const priceFrom = req.query.priceFrom
    ? parseFloat(req.query.priceFrom)
    : undefined;
  const priceTo = req.query.priceTo ? parseFloat(req.query.priceTo) : undefined;
  const currentPrice = parseFloat(req.query.currentPrice);
  const budgetCost = req.query.budgetCost
    ? parseFloat(req.query.budgetCost)
    : undefined;
  const budgetExclExp = req.query.budgetExclExp === "true";
  const strategiesFromQuery = mapObj(
    (v) => v === "true",
    // @ts-ignore
    parseQueryObj(req.query, "strategies")
  );
  const isMultiStratVer = Object.keys(strategiesFromQuery).length > 0;
  const strategies = parseInt10(req.query.sell || "0")
    ? { "short-option": true }
    : isMultiStratVer
    ? strategiesFromQuery
    : { "option-purchase": true };

  return {
    ...req.query,
    targetting: req.query.targetting === "eq" ? "single" : req.query.targetting,
    priceFrom,
    priceTo,
    currentPrice,
    budgetCost,
    budgetExclExp,
    specificExpiry:
      ifUndef(req.query.specificExpiry, isMultiStratVer ? "1" : "0") === "1",
    strategies,
  };
}
