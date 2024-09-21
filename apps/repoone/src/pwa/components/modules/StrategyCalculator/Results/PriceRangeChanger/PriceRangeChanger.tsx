import React, { useCallback, useState } from "react";
import { isNull } from "errable";

import { type Nullable } from "opc-types/lib/util/Nullable";

import Box from "../../../../primitives/Box";
import Input from "../../../../primitives/Input";
import InputLabelInline from "../../../../primitives/InputLabelInline/InputLabelInline";
import T from "../../../../primitives/Typo";
import useDispatchUpdateParam from "../../utils/useDispatchUpdateParam";

import { usePriceRangeChanger } from "./usePriceRangeChanger";
import css from "./PriceRangeChanger.module.scss";
import stripNonNumeric from "../../../../../../utils/Data/stripNonNumeric";
import useMediaQuery from "../../../../../../utils/Hooks/useMediaQuery";

interface Range {
  min: Nullable<string>;
  max: Nullable<string>;
}

const auto: Range = {
  min: null,
  max: null,
};

export default function PriceRangeChanger({ disabled }: { disabled: boolean }) {
  const { defaultPriceRange, currentPriceRange } = usePriceRangeChanger();
  const isMob = useMediaQuery("mobile-only");
  const [priceRange, setPriceRange] = useState<Range>(currentPriceRange);
  const updatePriceRange = useDispatchUpdateParam("priceRange");
  const onChangeInput = useCallback(
    (field: string, value: string) => {
      setPriceRange((prevData) => ({
        ...prevData,
        [field]: stripNonNumeric(value),
      }));
    },
    [setPriceRange]
  );

  const showReset =
    currentPriceRange.min !== null || currentPriceRange.max !== null;

  const processUpdate = React.useCallback(
    (min: Nullable<string>, max: Nullable<string>) => {
      const newMin = min ? parseFloat(min) : defaultPriceRange.min;
      const newMax = max ? parseFloat(max) : defaultPriceRange.max;
      if (!isNull(newMin) && !isNull(newMax) && newMax > newMin) {
        updatePriceRange([newMin, newMax]);
      }
    },
    [priceRange, defaultPriceRange]
  );

  const onAutoPress = React.useCallback(() => {
    setPriceRange(auto);
    updatePriceRange([auto.min, auto.max]);
  }, []);

  const resetNode = showReset ? (
    <Box inline-block>
      <T
        content-pragmatic
        anemic
        no-weight
        className={[css.reset, css["--auto"]]}
        onClick={onAutoPress}
      >
        &#8635;
      </T>
    </Box>
  ) : null;

  return (
    <InputLabelInline
      label={isMob ? "Stock Range" : `Stock Price Range`}
      afterLabel={resetNode}
      disabled={disabled}
    >
      <Box className={css.inputContainer} flex>
        <Input
          prefix="$"
          placeholder={"min"}
          className={[css._input, css["--min"]]}
          value={priceRange.min || ""}
          onChange={(value) => onChangeInput("min", value)}
          onBlur={(value) => processUpdate(value, priceRange.max)}
          debounce
          spellCheck={false}
          autoComplete={"off"}
        />
        <T className={css._grayText}> – </T>
        <Input
          placeholder={"max"}
          className={[css._input, css["--max"]]}
          value={priceRange.max || ""}
          onChange={(value) => onChangeInput("max", value)}
          onBlur={(value) => processUpdate(priceRange.min, value)}
          debounce
          spellCheck={false}
          autoComplete={"off"}
        />
      </Box>
    </InputLabelInline>
  );
}
