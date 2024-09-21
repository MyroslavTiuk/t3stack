import ifUndef from "../../../../utils/Data/ifUndef/ifUndef";
import { type DTO } from "../types";

function get_relevant_strats(data: DTO) {
  const isBullish =
    data["currentPrice"] <
    Math.min(
      ifUndef(data["priceFrom"], Infinity),
      ifUndef(data["priceTo"], Infinity)
    );
  const isBearish =
    data["currentPrice"] >
    Math.max(ifUndef(data["priceFrom"], 0), ifUndef(data["priceTo"], 0));

  // const targetExact = data['targetting'] === 'single';
  const targetLower = data["targetting"] === "lt";
  const targetHigher = data["targetting"] === "gt";
  const targetRange = data["targetting"] === "range";

  const stratOptPurch = data.strategies["option-purchase"];
  const stratShortOpt = data.strategies["short-option"];
  const stratDebitSpd = data.strategies["debit-spread"];
  const stratCreditSpd = data.strategies["credit-spread"];

  const strats = [];

  if (stratOptPurch && isBullish && !targetRange && !targetLower) {
    strats.push("long-call");
  }
  if (stratOptPurch && isBearish && !targetRange && !targetHigher) {
    strats.push("long-put");
  }
  if (stratShortOpt && isBullish && !targetRange && !targetLower) {
    strats.push("short-put");
  }
  if (stratShortOpt && isBearish && !targetRange && !targetHigher) {
    strats.push("short-call");
  }
  if ((targetHigher && !isBullish) || (!targetLower && isBullish)) {
    if (stratDebitSpd) strats.push("bullish-call-debit-spread");
    if (stratCreditSpd) strats.push("bullish-put-credit-spread");
  }
  if ((targetLower && !isBearish) || (!targetHigher && isBearish)) {
    if (stratDebitSpd) strats.push("bearish-put-debit-spread");
    if (stratCreditSpd) strats.push("bearish-call-credit-spread");
  }
  return strats;

  // throw new Error('Targetting type not implemented');
}

export default get_relevant_strats;
