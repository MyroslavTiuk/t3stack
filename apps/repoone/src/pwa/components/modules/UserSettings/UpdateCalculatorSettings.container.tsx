import { type Tuple } from "opc-types/lib/Tuple";
import React from "react";
import noop from "../../../../utils/Functional/noop";
import InputLabel from "../../layouts/InputLabel";
import Autocomplete from "../../primitives/Autocomplete";
import Box from "../../primitives/Box";
import Button from "../../primitives/Button";
import T from "../../primitives/Typo";
import css from "./UserSettings.module.scss";
import useUpdateCalculatorSettings from "./useUpdateCalculatorSettings";

interface InputWithDropdownProps {
  getItemValue: (item: any) => string;
  checkItemMatch: (item: any, value: string) => boolean;
  items: any[];
  value: string;
  onSelect: (val: string, item?: Tuple<string>) => void;
  label: string;
  inline: boolean;
}
const InputWithDropdown = ({
  getItemValue,
  checkItemMatch,
  items = [],
  value = "",
  onSelect,
  label,
  inline,
}: InputWithDropdownProps) => {
  return (
    <Box className={css._inputWithDropdownContainer}>
      <div tabIndex={1}></div>
      <InputLabel
        label={label}
        labelClassName={css.labelContainer}
        inputClassName={css.inputContainer}
        inline-fullsize={inline}
        dont-use-label-tag={true}
      >
        <Autocomplete
          items={items}
          getItemValue={getItemValue}
          checkItemMatch={checkItemMatch}
          value={value}
          onChange={noop}
          onSelect={onSelect}
          className={[css._inputContainer, "_cols-mob-12 _cols-tab-plus-5"]}
        />
      </InputLabel>
    </Box>
  );
};
export default function UpdateCalculatorSettingsContainer() {
  const {
    estimatedValueType,
    onSelectEstimatedValueType,
    displayValueTypesOption,
    onSaveCalculatorSettings,
    loading,
    formValid,
    errorMessage,
    successMessage,
    getPairItemValue,
    checkPairItemMatch,
    coveredStrategiesOptions,
    coveredStrategiesValue,
    onSelectCoveredStrategies,
    isMobile,
  } = useUpdateCalculatorSettings();

  return (
    <Box className={css.settingsContentContainer}>
      <T h4>Change Calculator Settings</T>

      <InputWithDropdown
        items={displayValueTypesOption}
        getItemValue={getPairItemValue}
        checkItemMatch={checkPairItemMatch}
        value={estimatedValueType}
        onSelect={onSelectEstimatedValueType}
        label="Default estimate values:"
        inline={isMobile}
      />
      {/* <InputWithDropdown
        items={closePriceMethodOptions}
        getItemValue={getPairItemValue}
        checkItemMatch={checkPairItemMatch}
        value={closePriceMethodValue}
        onSelect={onSelectClosePriceMethod}
        label="Closing trade orders:"
        inline={isMobile}
      /> */}
      {/* <InputWithDropdown
        items={legIVMethodOptions}
        getItemValue={getPairItemValue}
        checkItemMatch={checkPairItemMatch}
        value={legIVMethodValue}
        onSelect={onSelectLegIVMethod}
        label="Leg IV estimation:"
        inline={isMobile}
      /> */}
      {/* <InputWithDropdown
        items={timeDecayBasisOptions}
        getItemValue={getPairItemValue}
        checkItemMatch={checkPairItemMatch}
        value={timeDecayBasisValue}
        onSelect={onSelectTimeDecayBasis}
        label="Time decay basis:"
        inline={isMobile}
      /> */}
      <InputWithDropdown
        items={coveredStrategiesOptions}
        getItemValue={getPairItemValue}
        checkItemMatch={checkPairItemMatch}
        value={coveredStrategiesValue}
        onSelect={onSelectCoveredStrategies}
        label="Covered Strategies:"
        inline={isMobile}
      />

      {errorMessage && <T className={css.textErrors}>{errorMessage}</T>}
      {successMessage && <T className={css.successMessage}>{successMessage}</T>}
      <Button
        secondary
        onClick={onSaveCalculatorSettings}
        loading={loading}
        disabled={!formValid}
      >
        Save Changes
      </Button>
    </Box>
  );
}
