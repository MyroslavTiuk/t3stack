import { type DTO } from "../types";
import Strategies from "../../../../model/Strategies";
import { type StratName } from "opc-types/lib/StratName";
import findVertically from "./findVertically";
import { type OptionsChain } from "opc-types/lib/OptionsChain";
import { type FinderOutcome } from "opc-types/lib/api/responses/FinderResp";

const getStratOutcomes = (
  $data: DTO,
  $priceInfo: OptionsChain,
  $strats: string[]
) => {
  return $strats.reduce(function (bestStrats: FinderOutcome[], $strat) {
    const $si = Strategies.getStrategyFilled($strat as StratName);

    return bestStrats.concat(findVertically($data, $priceInfo, $strat, $si));
  }, []);
};

export default getStratOutcomes;
