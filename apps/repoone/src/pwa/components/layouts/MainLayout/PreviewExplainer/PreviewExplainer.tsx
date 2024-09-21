import { type FC, useCallback } from "react";
import React from "react";

import Box from "../../../primitives/Box";
import T from "../../../primitives/Typo";
import Hr from "../../../primitives/Hr";
import Icon from "../../../primitives/Icon";
import Button from "../../../primitives/Button";
import Link from "../../../primitives/Link";
import { SITE } from "../../../../../config/Site";
import userSettingsActions from "../../../../store/actions/userSettings";
import { useSession } from "../../../modules/Session/SessionProvider";
import { AUTH_STATUS } from "../../../modules/Session/Session.types";
import CONTENT_PATHS from "../../../../../consts/CONTENT_PATHS";
import ROUTE_PATHS from "../../../../../consts/ROUTE_PATHS";

import css from "./PreviewExplainer.module.scss";
import { useRouter } from "next/router";
import useDispaction from "../../../../../utils/Redux/useDispaction";
import analyticsActions from "../../../../store/actions/analytics";
import useBreakpoint from "../../../../../utils/Hooks/useBreakpoint";
import getHotjarUserId from "../utils/getHotjarUserId";
import getExperiments from "../utils/getExperiments";

interface PreviewExplainerProps {}

const PreviewExplainer: FC<PreviewExplainerProps> = (): ReturnType<
  typeof Box
> => {
  const { authStatus, userData, dispactionUserSettings } = useSession();
  const { profileLoaded, userSettings } = userData;
  const { viewedPreviewExplainer } = userSettings;
  const showPreviewExplainer =
    !viewedPreviewExplainer &&
    (authStatus === AUTH_STATUS.STATE_ANON || profileLoaded);

  const setUserSettings = dispactionUserSettings(
    userSettingsActions.setUserSettings
  );

  const agreeTC = true;

  const acknowledge = useCallback(() => {
    setUserSettings({
      ...userData?.userSettings,
      hasAcceptedCookies: agreeTC,
      hasAcceptedTNC: agreeTC,
      viewedPreviewExplainer: true,
    });
  }, [setUserSettings, agreeTC, userData?.userSettings]);

  // const acknowledgePreview = useCallback(() => {
  //   setUserSettings({
  //     ...userData?.userSettings,
  //     viewedPreviewExplainer: true,
  //   });
  // }, [setUserSettings, agreeTC, userData?.userSettings]);

  const breakpoint = useBreakpoint();
  const router = useRouter();
  const trackRevert = useDispaction(analyticsActions.revertToOld);

  const goToOptOut = React.useCallback(() => {
    const path = router.asPath;
    trackRevert();
    fetch("/api/submit-form", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "(From preview footer)",
        formType: "revert-feedback",
        breakpoint,
        experiments: getExperiments().join("; "),
        hotjarUserId: getHotjarUserId(),
        path,
      }),
    }).then(() => router.push(`${SITE.V2_ORIGIN}/?beta_opt_out=1`));
  }, [trackRevert, router, breakpoint]);

  return (
    <Box className={[css.container, "align-center"]}>
      <Box className={[css._card, "reset-align"]} ph={1} pt={1 / 3}>
        {showPreviewExplainer && (
          <>
            <Box className={css._previewTitle}>
              <T h4>You're previewing the new OPC</T>
            </Box>
            <T content className={"hide-mob"} mv={1 / 2}>
              We've updated things to make the calculator easier to use.
            </T>
            <Box ml={1 / 4} flexSec="center">
              <Box mr={1 / 3}>
                <Icon
                  icon="double-arrow-line-right"
                  xsmall
                  className={css.rightArrow}
                />
              </Box>
              <Link to={CONTENT_PATHS.ABOUT_WHATS_NEW} onClick={acknowledge}>
                <p onClick={acknowledge}>
                  <T tagName="span" content-pragmatic clickable>
                    See more about the updates
                  </T>
                </p>
              </Link>
            </Box>

            <Box className={css._divider} mv={1 / 2}>
              <Hr />
            </Box>
          </>
        )}
        <Box mr={-1 / 2} mv={1 / 2}>
          <T content-detail>
            By continuing to use this website you agree to the use of cookies,
            our <Link to={ROUTE_PATHS.PRIVACY_POLICY}>privacy policy</Link> and{" "}
            <Link to={ROUTE_PATHS.TERMS_AND_CONDITIONS}>
              terms and conditions
            </Link>
            .
          </T>
        </Box>
        <Box className={css._buttonCtnr} flexPri="center" mb={1 / 3}>
          <Button
            className={css._btn}
            full-width
            onClick={acknowledge}
            text={"Got it!"}
          />
        </Box>
        {showPreviewExplainer && (
          <T
            tagName="a"
            className={["text-link", css.backLink]}
            onClick={goToOptOut}
          >
            Back to old site
          </T>
        )}
      </Box>
    </Box>
  );
};

export default PreviewExplainer;
