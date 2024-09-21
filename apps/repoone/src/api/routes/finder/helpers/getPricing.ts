import { isErr } from "errable";
import { type OptionsChain } from "opc-types/lib/OptionsChain";

import getNearestExpiries from "./getNearestExpiries";
import { getOptionPrices } from "./getOptionPrices";
import { type DTO } from "../types";
import newYorkTime from "../../../../utils/Time/newYorkTime";

// todo: type of return
async function get_pricing(
  data: DTO,
  _relevantStrats: any
): Promise<OptionsChain> {
  const pricingRaw = await getOptionPrices(data.symbol);
  if (isErr(pricingRaw) || !pricingRaw.options)
    throw new Error("Prices not found");
  // if (pricing['status'] !== 2) throw new Error('Prices not found');
  const pricing = pricingRaw.options;
  delete pricing["_data_source"];

  const byTime = newYorkTime(data["date"]);
  const expiries = Object.keys(pricing);
  const closestExpiries: any = getNearestExpiries(expiries, byTime);

  if (data.specificExpiry) {
    const foundExp = expiries.find((xp) => xp === data.date);
    if (foundExp) {
      return { [foundExp]: pricing[foundExp] };
    } else return {};
  }

  return closestExpiries["nextK"] !== false
    ? expiries
        .slice(closestExpiries["nextK"])
        .reduce((acc, exp) => ({ ...acc, [exp]: pricing[exp] }), {})
    : pricing;
}

export default get_pricing;
