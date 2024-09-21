import { set, lensProp, pickBy } from "ramda";
import { type PriceData } from "opc-types/lib/PriceData";
import { type OptionsChain } from "opc-types/lib/OptionsChain";
import currentNewYorkYMD from "../../../../../../utils/Time/currentNewYorkYMD";

function filterOptions(ops: OptionsChain, _testYmd?: string) {
  const ymd = `${_testYmd || currentNewYorkYMD(true)}`;
  return pickBy((val, key) => `${key} 16:00:00` >= ymd, ops);
}

const filterOptionsByCurrentExpiry = (prices: PriceData, _testYmd?: string) => {
  return !prices.options
    ? prices
    : //@ts-ignore
      set(lensProp("options"), filterOptions(prices.options, _testYmd), prices);
};

export default filterOptionsByCurrentExpiry;
