import { type FC, useContext } from "react";
import React from "react";

import Box from "../../../../primitives/Box";
import AutocompleteView from "../../../../primitives/Autocomplete";

import css from "./DisplayValueSelector.module.scss";
import { type Optional } from "opc-types/lib/util/Optional";
import {
  displayValueTypePairs,
  displayValueTypePairsMob,
  type DVPair,
} from "../../../../../../consts/displayValueTypePairs";
import InputLabelInline from "../../../../primitives/InputLabelInline/InputLabelInline";
import { isUndefined } from "errable";
import DISPLAY_VALUE_TYPES from "../../../../../../consts/DISPLAY_VALUE_TYPES";
import useMediaQuery from "../../../../../../utils/Hooks/useMediaQuery";
import ObjectKeys from "../../../../../../utils/Data/ObjectKeys/ObjectKeys";
import { StrategyCalculatorContext } from "../../StrategyCalculator.container";
import { type StrategyEstimateSummary } from "opc-types/lib/StrategyEstimateSummary";
import isInfinite from "../../../../../../utils/Data/isInfinite";
import { useSession } from "../../../Session/SessionProvider";
import useDispatchUpdateParam from "../../utils/useDispatchUpdateParam";
import userSettingsActions from "../../../../../store/actions/userSettings";
import { type DisplayValueTypes } from "opc-types/lib/DisplayValueTypes";
import { nth } from "ramda";
import { RESULTS_VISUALIZATION } from "../../../../../../types/enums/RESULTS_VISUALIZATION";

type DisplayValueSelectorProps = {
  disabled: boolean;
  resultsVisualization: RESULTS_VISUALIZATION;
};

const isValidDisplayTypeForStrat = (
  dvt: string,
  summary: StrategyEstimateSummary
) =>
  !(
    (dvt === DISPLAY_VALUE_TYPES.ROI_MAX_RISK && isInfinite(summary.maxRisk)) ||
    (dvt === DISPLAY_VALUE_TYPES.PERC_MAX_RETURN &&
      isInfinite(summary.maxReturn)) ||
    (dvt === DISPLAY_VALUE_TYPES.ROI_COLLATERAL && !summary.roiCollateral)
  );
const checkItemMatch = (item: DVPair, textVal: string) =>
  item[1].toLowerCase().includes(textVal.toLowerCase());
const getItemValue = nth(1) as (dvPair: DVPair) => string;

const useDisplayValues = () => {
  const isMob = useMediaQuery("mobile-only");
  const { estimateForResults: estimate, currentCalcForResults: currentCalc } =
    useContext(StrategyCalculatorContext);

  const { dispactionUserSettings } = useSession();
  const updateDisplayValueTypeCalc = useDispatchUpdateParam("displayValueType");
  const updateDefaultDisplayValueType = dispactionUserSettings(
    userSettingsActions.setDefaultDisplayValueType
  );
  const updateDisplayValueType = React.useCallback(
    (newVal: DisplayValueTypes) => {
      updateDisplayValueTypeCalc(newVal);
      updateDefaultDisplayValueType(newVal);
    },
    [updateDisplayValueTypeCalc, updateDefaultDisplayValueType]
  );

  const numLegs = ObjectKeys(estimate?.initial.legs || {}).length;
  const displayValueType = currentCalc?.displayValueType;
  const displayValueTypePairsLegsRelevant = React.useMemo(
    () =>
      (isMob ? displayValueTypePairsMob : displayValueTypePairs).map(
        (dvPair) =>
          [
            dvPair[0],
            dvPair[1].replace("{trade}", numLegs > 1 ? "Spread" : "Option"),
          ] as DVPair
      ),
    [numLegs, isMob, displayValueTypePairs]
  );

  const [displayValue, setDisplayValue] = React.useState(
    (displayValueTypePairsLegsRelevant.find(
      (pair) => pair[0] === displayValueType
    ) || displayValueTypePairsLegsRelevant[0])[1]
  );
  const filteredDisplayValueTypes = React.useMemo(() => {
    const { summary } = estimate || {};
    return isUndefined(summary)
      ? ([] as DVPair[])
      : displayValueTypePairsLegsRelevant.filter((dvPair) =>
          isValidDisplayTypeForStrat(dvPair[0], summary)
        );
  }, [estimate?.summary]);
  React.useEffect(() => {
    const { summary } = estimate || {};
    if (
      !isUndefined(displayValueType) &&
      !isUndefined(summary) &&
      !isValidDisplayTypeForStrat(displayValueType, summary)
    ) {
      updateDisplayValueType(DISPLAY_VALUE_TYPES.PL_DOLLARS);
      setDisplayValue("P/L in dollars");
    } else {
      setDisplayValue(
        (displayValueTypePairsLegsRelevant.find(
          (pair) => pair[0] === displayValueType
        ) || displayValueTypePairsLegsRelevant[0])[1]
      );
    }
  }, [displayValueType, estimate, updateDisplayValueType]);
  const onSelect = React.useCallback(
    (val: string, item: Optional<DVPair>) => {
      setDisplayValue(val);
      item?.[0] && updateDisplayValueType(item?.[0]);
    },
    [setDisplayValue, updateDisplayValueType]
  );

  return {
    onSelect,
    isMob,
    filteredDisplayValueTypes,
    displayValue,
    setDisplayValue,
    getItemValue,
    checkItemMatch,
  };
};

const DisplayValueSelector: FC<DisplayValueSelectorProps> = ({
  disabled,
  resultsVisualization,
}: DisplayValueSelectorProps) => {
  const {
    onSelect,
    isMob,
    filteredDisplayValueTypes,
    displayValue,
    setDisplayValue,
    getItemValue,
    checkItemMatch,
  } = useDisplayValues();

  const label =
    resultsVisualization === RESULTS_VISUALIZATION.MATRIX
      ? isMob
        ? "Matrix vals"
        : "Matrix values"
      : isMob
      ? "Y-Axis vals"
      : "Y-Axis values";

  return (
    <InputLabelInline label={label} disabled={disabled}>
      <Box className={[disabled && css.disabledWrapper]}>
        <AutocompleteView
          items={filteredDisplayValueTypes}
          value={displayValue}
          onChange={setDisplayValue}
          onSelect={onSelect}
          getItemValue={getItemValue}
          checkItemMatch={checkItemMatch}
          allowFreeEntry={false}
          position="up"
          inputProps={{
            disabled,
          }}
        />
      </Box>
    </InputLabelInline>
  );
};

export default DisplayValueSelector;
