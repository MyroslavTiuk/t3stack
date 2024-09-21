import React, { useCallback, useMemo, useState } from "react";

import useMediaQuery from "../../../../../../utils/Hooks/useMediaQuery";
import round from "../../../../../../utils/Data/round/round";
import noop from "../../../../../../utils/Functional/noop";
import Box from "../../../../primitives/Box";
import Card from "../../../../primitives/Card";
import InputLabelInline from "../../../../primitives/InputLabelInline/InputLabelInline";
import ModalContainer from "../../../../primitives/Modal/ModalContainer";
import IVSlider from "../../../../primitives/Slider/IVSlider";
import T from "../../../../primitives/Typo";
import useDispatchUpdateParam from "../../utils/useDispatchUpdateParam";

import css from "./IVChanger.module.scss";

export default function IVChanger({
  atmIV,
  ivShift: calcIVShift,
  disabled,
}: {
  atmIV: number | null;
  ivShift: number;
  disabled: boolean;
}) {
  const isMobile = useMediaQuery("mobile-only");
  const [showSlider, setShowslider] = useState(false);

  const calcIVShiftPct = round(calcIVShift * 100);
  const [ivValue, setIVValue] = useState(calcIVShift * 100 || 0);

  React.useEffect(() => {
    setIVValue(calcIVShift * 100 || 0);
  }, [calcIVShift, setIVValue]);

  const onToggleSlider = useCallback(() => {
    setShowslider((prevValue) => !prevValue);
  }, []);

  const ivShift = useMemo(() => {
    if (!atmIV) {
      return 0;
    }
    const percent = atmIV * (ivValue / 100);
    return (atmIV + percent).toFixed(2);
  }, [atmIV, ivValue]);
  const atmIVdisp = atmIV?.toFixed(2) || null;

  const updateIVShift = useDispatchUpdateParam("ivShift");

  const onChange = useCallback(
    (value: number) => {
      updateIVShift(value / 100);
      setIVValue(value);
    },
    [updateIVShift, setIVValue]
  );

  const onUpdate = React.useCallback(
    (value: number) => {
      setIVValue(value);
    },
    [setIVValue]
  );

  const reset = React.useCallback(() => {
    setIVValue(0);
    updateIVShift(0);
  }, [updateIVShift, setIVValue]);

  const isChanged = atmIVdisp !== ivShift;
  return (
    <InputLabelInline
      label="IV Change"
      mobileLabel={"IV Chg."}
      disabled={disabled}
    >
      <Box className={css.inputContainer} flex>
        <ModalContainer
          onClickOutside={() => setShowslider(false)}
          onEscapeKeyPressed={() => null}
        >
          <Box onClick={onToggleSlider} className={css._label} flex>
            <T
              content-pragmatic
              anemic
              className={[css._text, disabled && css["--disabled"]]}
              pt={1 / 4}
            >
              {calcIVShiftPct === 0 ? "±" : calcIVShiftPct > 0 ? "+" : ""}
              {calcIVShiftPct}%
            </T>
            <Box className={css._dropdownIndicator} />
          </Box>

          {showSlider && (
            <Card
              className={[css.sliderCard, isMobile && css.sliderCardMobile]}
            >
              <Box
                tagName="span"
                className={[css.resetBtn, !isChanged && css["--unchanged"]]}
                onClick={isChanged ? reset : noop}
              >
                &#8635;
              </Box>

              <IVSlider
                mode={1}
                domain={[-100, 100]}
                step={1}
                values={[ivValue]}
                onUpdate={onUpdate}
                onChange={onChange}
              />
              <Box className={css.valueDisplayContainer} flex>
                <T content-pragmatic>Current IV (atm):</T>
                <T content-pragmatic>
                  <T
                    tagName="span"
                    className={[css.ivValue, isChanged && css["--inactive"]]}
                  >
                    {atmIVdisp}
                  </T>{" "}
                  <T tagName="span" className={[css.arrow]}>{`→`}</T>{" "}
                  <T
                    tagName="span"
                    className={[css.ivValue, !isChanged && css["--inactive"]]}
                  >
                    {ivShift}
                  </T>
                </T>
              </Box>
            </Card>
          )}
        </ModalContainer>
      </Box>
    </InputLabelInline>
  );
}
