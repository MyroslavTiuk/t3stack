import { type StratLeg } from "opc-types/lib/StratLeg";
import { type Optional } from "opc-types/lib/util/Optional";

export function getLegNumMultiplier(
  dependentLeg: StratLeg,
  triggerLegId: Optional<string>
) {
  const legK = dependentLeg.settings.suggestedNumEle?.indexOf(
    triggerLegId || ""
  );
  const legKA =
    legK !== -1 ? legK : dependentLeg.settings.suggestedNumEle?.indexOf("ALL");
  if (legKA === undefined) return 1;
  // shouldn't happen as it's been prescreened
  if (legKA === -1) {
    // reportError
    return 1;
  }
  return dependentLeg.settings.suggestedNum[legKA] || 1;
}
