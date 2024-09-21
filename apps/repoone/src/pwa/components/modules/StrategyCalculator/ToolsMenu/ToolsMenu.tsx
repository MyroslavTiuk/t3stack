import React, { useContext } from "react";

import { INPUT_METHODS } from "../../../../../types/enums/INPUT_METHODS";
import { LAYOUT_OPTIONS } from "../../../../../types/enums/LAYOUT_OPTIONS";
import Box from "../../../primitives/Box";
import T from "../../../primitives/Typo";
import { useSession } from "../../Session/SessionProvider";
import userSettingsActions from "../../../../store/actions/userSettings";
import useMediaQuery from "../../../../../utils/Hooks/useMediaQuery";
import useToggleState from "../../../../../utils/Hooks/useToggleState";

import css from "./ToolsMenu.module.scss";
import RadioLabel from "../../../primitives/RadioLabel";
import { NewSavedCalcsContext } from "../NewSavedCalculations/NewSavedCalculationsContext";

const useToolsMenu = ({ isMob }: { isMob: boolean }) => {
  const {
    dispactionUserSettings,
    userData: { userSettings },
  } = useSession();
  const setInputMethod = dispactionUserSettings(
    userSettingsActions.setInputMethod
  );
  const setInputMethodMob = dispactionUserSettings(
    userSettingsActions.setInputMethodMobile
  );
  const setLayout = dispactionUserSettings(userSettingsActions.setLayout);
  return {
    setInputMethod: isMob ? setInputMethodMob : setInputMethod,
    inputMethod: isMob
      ? userSettings?.inputMethodMobile
      : userSettings?.inputMethod,
    setLayout,
    layout: userSettings?.layout,
  };
};

function ToolsMenu() {
  const isMob = useMediaQuery("mobile-only");
  const isTab = useMediaQuery("tablet-large-down");
  const logic = useToolsMenu({ isMob });

  const {
    value: isShowCustom,
    enable: showCustom,
    disable: hideCustom,
  } = useToggleState(logic.inputMethod !== INPUT_METHODS.DEFAULT || isTab);

  const useDefaultOptionLeg = React.useCallback(() => {
    logic.setInputMethod(INPUT_METHODS.DEFAULT);
    hideCustom();
  }, [hideCustom, logic.setInputMethod]);

  const userViewSettingsContext = useContext(NewSavedCalcsContext);

  return (
    <>
      {!isTab && (
        <>
          <T pb={1 / 3} content-caption>
            Screen layout
          </T>
          <RadioLabel
            onClick={() => {
              logic.setLayout(LAYOUT_OPTIONS.STACKED);
              userViewSettingsContext &&
                userViewSettingsContext.setCalculatorUserViewSettings({
                  ...userViewSettingsContext.calculatorUserViewSettings,
                  screenLayout: LAYOUT_OPTIONS.STACKED,
                });
              userViewSettingsContext &&
                userViewSettingsContext.changeViewSettingsLayout(
                  LAYOUT_OPTIONS.STACKED
                );
            }}
            checked={
              userViewSettingsContext
                ? userViewSettingsContext.calculatorUserViewSettings
                    .screenLayout === LAYOUT_OPTIONS.STACKED
                : false
            }
            label={"Stacked form (classic)"}
            padForMenuList
          />
          <RadioLabel
            onClick={() => {
              logic.setLayout(LAYOUT_OPTIONS.SIDE_BY_SIDE);

              userViewSettingsContext &&
                userViewSettingsContext.setCalculatorUserViewSettings({
                  ...userViewSettingsContext.calculatorUserViewSettings,
                  screenLayout: LAYOUT_OPTIONS.SIDE_BY_SIDE,
                });
              userViewSettingsContext &&
                userViewSettingsContext.changeViewSettingsLayout(
                  LAYOUT_OPTIONS.SIDE_BY_SIDE
                );
            }}
            checked={
              userViewSettingsContext
                ? userViewSettingsContext.calculatorUserViewSettings
                    .screenLayout === LAYOUT_OPTIONS.SIDE_BY_SIDE
                : false
            }
            label={"Sidebar (new)"}
            padForMenuList
          />
          {isShowCustom && (
            <Box className={[css.sectionSeparator]} mt={1 / 2} mb={1} />
          )}
        </>
      )}
      {!isShowCustom && (
        <T mt={1 / 3} content-detail-minor clickable onClick={showCustom}>
          Select Option-Leg entry style
        </T>
      )}
      {isShowCustom && (
        <>
          <T pb={1 / 3} content-caption>
            Option-Leg&nbsp;entry&nbsp;style
          </T>
          <Box
            tagName="label"
            className="cursor-pointer"
            flexSec="center"
            pv={1 / 2}
            ph={1 / 3}
          >
            <input
              type="radio"
              onChange={() => {
                logic.setInputMethod(INPUT_METHODS.STACKED);

                userViewSettingsContext &&
                  userViewSettingsContext.setCalculatorUserViewSettings({
                    ...userViewSettingsContext.calculatorUserViewSettings,
                    optionLegStyle: INPUT_METHODS.STACKED,
                  });
                userViewSettingsContext &&
                  userViewSettingsContext.changeViewSettingsOptionLeg(
                    INPUT_METHODS.STACKED
                  );
              }}
              checked={
                userViewSettingsContext
                  ? userViewSettingsContext.calculatorUserViewSettings
                      .optionLegStyle === INPUT_METHODS.STACKED ||
                    (userViewSettingsContext.calculatorUserViewSettings
                      .optionLegStyle === INPUT_METHODS.DEFAULT &&
                      userViewSettingsContext.calculatorUserViewSettings
                        .screenLayout === LAYOUT_OPTIONS.STACKED)
                  : false
              }
            />
            &nbsp;
            <T tagName="span" content-pragmatic>
              Stacked form (classic)
            </T>
          </Box>
          <Box
            tagName="label"
            className="cursor-pointer"
            flexSec="center"
            pv={1 / 2}
            ph={1 / 3}
          >
            <input
              type="radio"
              onChange={() => {
                logic.setInputMethod(INPUT_METHODS.INLINE);

                userViewSettingsContext &&
                  userViewSettingsContext.setCalculatorUserViewSettings({
                    ...userViewSettingsContext.calculatorUserViewSettings,
                    optionLegStyle: INPUT_METHODS.INLINE,
                  });
                userViewSettingsContext &&
                  userViewSettingsContext.changeViewSettingsOptionLeg(
                    INPUT_METHODS.INLINE
                  );
              }}
              checked={
                userViewSettingsContext
                  ? userViewSettingsContext.calculatorUserViewSettings
                      .optionLegStyle === INPUT_METHODS.INLINE ||
                    (userViewSettingsContext.calculatorUserViewSettings
                      .optionLegStyle === INPUT_METHODS.DEFAULT &&
                      userViewSettingsContext.calculatorUserViewSettings
                        .screenLayout === LAYOUT_OPTIONS.SIDE_BY_SIDE)
                  : false
              }
            />
            &nbsp;
            <T tagName="span" content-pragmatic>
              Compact (new)
            </T>
          </Box>
          {!isTab && (
            <T
              onClick={useDefaultOptionLeg}
              content-detail-minor
              clickable
              tagName="span"
            >
              Use screen-layout default
            </T>
          )}
        </>
      )}
    </>
  );
}

export default ToolsMenu;
