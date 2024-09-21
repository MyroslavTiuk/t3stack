import React, { useCallback, useState } from "react";

import { useModalContext } from "../../primitives/Modal/ModalProvider";
import Box from "../../primitives/Box";
import { useSession } from "../Session/SessionProvider";
import { AUTH_STATUS } from "../Session/Session.types";

import AcceptTermsAndConditions from "./AcceptTermsAndConditions";
import css from "./TermsAndConditions.module.scss";

export default function useTNC() {
  const { authStatus, userData } = useSession();

  const hasAcceptedTNC = userData?.userSettings?.hasAcceptedTNC || false;

  const [tncModalShown, setTncModalShown] = useState(hasAcceptedTNC);
  const setTncModalShownTrue = React.useCallback(
    () => setTncModalShown(true),
    [setTncModalShown]
  );

  const isLoadingTNCacceptanceStatus =
    authStatus === AUTH_STATUS.STATE_LOADING ||
    (authStatus === AUTH_STATUS.STATE_AUTHED && !userData?.profileLoaded);

  const { showModal, hideModal } = useModalContext();
  const showAcceptTNCModal = useCallback(() => {
    showModal({
      // eslint-disable-next-line react/display-name
      content: () => (
        <Box className={css.popupCtnr} flex-col flexPri="center">
          <AcceptTermsAndConditions onAcceptTNC={hideModal} />
        </Box>
      ),
      onCloseModal: () => {
        setTncModalShownTrue();
      },
    });
  }, [showModal]);

  return {
    showAcceptTNCModal,
    hasAcceptedTNC,
    isLoadingTNCacceptanceStatus,
    tncModalShown,
    setTncModalShown,
    setTncModalShownTrue,
  };
}
