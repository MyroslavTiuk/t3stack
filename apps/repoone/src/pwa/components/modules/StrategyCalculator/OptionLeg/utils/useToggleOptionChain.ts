import React from "react";

import { type Nullable } from "opc-types/lib/util/Nullable";
import useDependentCallback from "../../../../../../utils/Hooks/useDependentCallback";

import { StrategyCalculatorContext } from "../../StrategyCalculator.container";

const useToggleOptionChain = (legId: string) => {
  const { setShowChainForLeg } = React.useContext(StrategyCalculatorContext);
  return useDependentCallback(
    (
      [_legId, _setShowChainForLeg]: [
        string,
        React.Dispatch<React.SetStateAction<Nullable<string>>>
      ],
      // eslint-disable-next-line no-empty-pattern
      []
    ) => {
      // SetTimeout avoids closing the OptionChain popup when this button is clicked as an outside click from an
      //  active chain
      setTimeout(() => _setShowChainForLeg(_legId), 1);
    },
    [legId, setShowChainForLeg]
  );
};

export default useToggleOptionChain;
