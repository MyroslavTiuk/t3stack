import React, { type FC } from "react";

import Box from "../../../../primitives/Box";
import T from "../../../../primitives/Typo";
import AcceptTermsAndConditions from "../../../TermsAndConditions/AcceptTermsAndConditions";
import { useSession } from "../../../Session/SessionProvider";
import Spinner from "../../../../primitives/Spinner";

import css from "./MatrixPlaceholder.module.scss";

interface MatrixPlaceholderProps {
  isBuffering: boolean;
  showAgreeTNClink: boolean;
}

const MatrixPlaceholder: FC<MatrixPlaceholderProps> = ({
  isBuffering,
  showAgreeTNClink,
}: MatrixPlaceholderProps): ReturnType<typeof Box> => {
  const hasAcceptedTNC =
    useSession()?.userData?.userSettings?.hasAcceptedTNC || false;

  return (
    <Box flex-col className={["--center", css.main]} flex>
      {isBuffering ? (
        <Spinner />
      ) : showAgreeTNClink && !hasAcceptedTNC ? (
        <AcceptTermsAndConditions />
      ) : (
        <T content-hint className={css["placeholder-text"]}>
          Estimates will appear here once you complete your trade's details.
        </T>
      )}
    </Box>
  );
};

export default MatrixPlaceholder;
