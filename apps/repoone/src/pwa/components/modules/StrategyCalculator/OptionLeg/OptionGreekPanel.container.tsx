import React from "react";
import { type Nullable } from "errable";

import GreekPanel from "../../../primitives/GreekPanel";

import round from "../../../../../utils/Data/round/round";
import useSelectorSafe from "../../../../store/selectors/useSelectorSafe";
import calcOptionGreeks from "../../../../../utils/Finance/calcOptionGreeks";
import { type TIME_DECAY_BASIS } from "../../../../../types/enums/TIME_DECAY_BASIS";
import { useSession } from "../../Session/SessionProvider";

type Props = {
  optPrice: Nullable<{ b: number; a: number; iv?: number }>;
  legId: string;
};

const useCalcGreeks = (legId: string) => {
  const curCalc = useSelectorSafe((s) => s.currentCalculation);
  const timeDecayBasis: TIME_DECAY_BASIS =
    useSession().userData.userSettings.timeDecayBasis;

  return calcOptionGreeks(curCalc || null, timeDecayBasis, legId);
};

const OptionGreekPanel = ({ optPrice, legId }: Props) => {
  const greeks = useCalcGreeks(legId);

  return (
    <GreekPanel
      greeks={{
        IV: optPrice?.iv === undefined ? null : round(optPrice?.iv, 2),
        Delta:
          greeks?.delta === undefined
            ? null
            : round(greeks?.delta, Math.abs(greeks?.delta || 1) < 0.01 ? 3 : 2),
        Gamma:
          greeks?.gamma === undefined
            ? null
            : round(greeks?.gamma, Math.abs(greeks?.gamma || 1) < 0.01 ? 3 : 2),
        Theta:
          greeks?.theta === undefined
            ? null
            : round(greeks?.theta, Math.abs(greeks?.theta || 1) < 0.01 ? 3 : 2),
        Vega:
          greeks?.vega === undefined
            ? null
            : round(greeks?.vega, Math.abs(greeks?.vega || 1) < 0.01 ? 3 : 2),
      }}
    />
  );
};

export default OptionGreekPanel;
