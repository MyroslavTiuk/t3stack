import React from "react";

import useIsClientside from "../../../../utils/Hooks/useIsClientside";
import PreviewExplainer from "../../layouts/MainLayout/PreviewExplainer";
import { useSession } from "../../modules/Session/SessionProvider";
import Box from "../Box";

import FeedbackButton from "../FeedbackButton";
import css from "./StickyBottom.module.scss";
import { AUTH_STATUS } from "../../modules/Session/Session.types";

export default function StickyBottom() {
  const { userData, authStatus } = useSession();

  const isCSR = useIsClientside();

  const hasAcceptedCookies = userData?.userSettings?.hasAcceptedCookies;
  const viewedPreviewExplainer = userData?.userSettings?.viewedPreviewExplainer;
  return (
    <Box className={css.container}>
      {(userData.profileLoaded || authStatus === AUTH_STATUS.STATE_ANON) &&
      (authStatus === AUTH_STATUS.STATE_LOADING || !isCSR
        ? null
        : !viewedPreviewExplainer || !hasAcceptedCookies) ? (
        <PreviewExplainer />
      ) : null}
      <Box className={css._feedback} flex-col>
        <Box className={css._btn}>
          <FeedbackButton />
        </Box>
      </Box>
    </Box>
  );
}
