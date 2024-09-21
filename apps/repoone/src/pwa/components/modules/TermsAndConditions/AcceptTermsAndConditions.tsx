import React, { useCallback, useState } from "react";

import Box from "../../primitives/Box";
import Button from "../../primitives/Button";
import T from "../../primitives/Typo";
import Link from "../../primitives/Link/Link.view";
import ROUTE_PATHS from "../../../../consts/ROUTE_PATHS";

import css from "./TermsAndConditions.module.scss";
import userSettingsActions from "../../../store/actions/userSettings";
import { useSession } from "../Session/SessionProvider";
import clx from "../../../../utils/Html/clx";

interface Props {
  onAcceptTNC?: () => void;
}
export default function AcceptTermsAndConditions({ onAcceptTNC }: Props) {
  const { dispactionUserSettings, userData } = useSession();
  const [isChecked, setIsChecked] = useState(true);
  const setHasAcceptedTNC = dispactionUserSettings(
    userSettingsActions.setHasAcceptedTNC
  );

  const setUserSettings = dispactionUserSettings(
    userSettingsActions.setUserSettings
  );
  const userAcceptTNCs = useCallback(() => {
    setUserSettings({
      ...userData?.userSettings,
      hasAcceptedCookies: isChecked,
      hasAcceptedTNC: true,
      viewedPreviewExplainer: true,
    });
  }, [setUserSettings, isChecked, userData?.userSettings]);

  const onContinueClicked = () => {
    if (!isChecked) {
      setHasAcceptedTNC(isChecked);
    }
    userAcceptTNCs();
    onAcceptTNC && onAcceptTNC();
  };
  const onToggleCheckBox = () => {
    setIsChecked((currentValue) => !currentValue);
  };
  return (
    <Box className={css.acceptTermsAndConditionsContainer}>
      <T h5 mb={1 / 2}>
        You must accept the terms and conditions to view estimates.
      </T>
      <T content-pragmatic tagName={"label"} className={css.text} mb={2}>
        <input
          type="checkbox"
          defaultChecked={isChecked}
          onChange={onToggleCheckBox}
          className={clx([css.checkbox, "styled"])}
        />{" "}
        I agree to <Link to={ROUTE_PATHS.ROOT}>terms and conditions</Link> of
        using this site
      </T>
      <Button
        onClick={onContinueClicked}
        disabled={!isChecked}
        full-width-mobile
      >
        Continue
      </Button>
    </Box>
  );
}
