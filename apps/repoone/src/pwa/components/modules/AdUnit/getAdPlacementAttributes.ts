import { type Optional } from "opc-types/lib/util/Optional";
import { type AdPlacement } from "opc-types/lib/AdPlacement";

import { ADS } from "../../../../config/Ads";
import { type AD_POSITIONS } from "../../../../types/enums/AD_POSITIONS";

const getAdPlacementAttributes = (
  adPlacement: AD_POSITIONS
): Optional<AdPlacement> => {
  return ADS.PLACEMENTS[adPlacement];
};

export default getAdPlacementAttributes;
