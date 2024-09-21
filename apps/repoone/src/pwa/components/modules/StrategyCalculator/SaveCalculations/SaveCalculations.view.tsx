import { type Strategy } from "opc-types/lib/Strategy";
import { type Nullable } from "opc-types/lib/util/Nullable";
import React from "react";
import Box from "../../../primitives/Box";
import Button from "../../../primitives/Button";
import T from "../../../primitives/Typo";
import { AUTH_STATUS } from "../../Session/Session.types";

// @ts-ignore
import css from "./SaveCalculations.module.scss";
import useCalculationSaver from "../../../../../services/UserData/useCalculationSaver";
import useMediaQuery from "../../../../../utils/Hooks/useMediaQuery";

interface Props {
  formCompleted: boolean;
  currentCalc: Nullable<Strategy>;
  onClickSave?: () => void;
}
export default function SaveCalculations({
  formCompleted,
  currentCalc,
  onClickSave,
}: Props) {
  const { authStatus, onLogin, statusIcon, statusString } = useCalculationSaver(
    {
      formCompleted,
      currentCalc,
    }
  );

  return null;

  const isMob = useMediaQuery("mobile-only");

  const onClickSaveCb = React.useCallback(() => {
    onClickSave && onClickSave();
    onLogin();
  }, [onClickSave, onLogin]);

  if (authStatus === AUTH_STATUS.STATE_ANON && formCompleted) {
    return isMob ? (
      <Button
        small
        onClick={onClickSaveCb}
        className={css.saveCalculationsButton}
      >
        Save<span className={css.fullBit}> calculation</span>
      </Button>
    ) : (
      <T
        content-pragmatic
        clickable
        onClick={onClickSaveCb}
        className={css.saveCalculationsButton}
      >
        <span className={css.fullBit}>Create account to </span>
        <span className={css.mobBit}>save</span>
      </T>
    );
  }

  return (
    <Box className={css.saveCalculations}>
      <Box className={css._iconTextContainer}>
        {statusIcon}
        <T content-pragmatic anemic className={css._label}>
          {statusString}
        </T>
      </Box>
      {/*<Box*/}
      {/*  className={clx([*/}
      {/*    css._iconTextContainer,*/}
      {/*    (formCompleted || loading) && css['--active'],*/}
      {/*  ])}*/}
      {/*  onClick={onCloneCalculation}*/}
      {/*>*/}
      {/*  <Icon*/}
      {/*    icon="copy"*/}
      {/*    small*/}
      {/*    className={css._icon}*/}
      {/*    ctnrClassName={css._iconContainer}*/}
      {/*  />*/}
      {/*  <T content-pragmatic anemic className={css._label}>*/}
      {/*    Clone*/}
      {/*  </T>*/}
      {/*</Box>*/}
      {/*<Box*/}
      {/*  className={clx([*/}
      {/*    css._iconTextContainer,*/}
      {/*    (formCompleted || loading) && css['--active'],*/}
      {/*  ])}*/}
      {/*  onClick={() => alert('Share not yet available')}*/}
      {/*>*/}
      {/*  <Icon*/}
      {/*    icon="share"*/}
      {/*    small*/}
      {/*    className={css._icon}*/}
      {/*    ctnrClassName={css._iconContainer}*/}
      {/*  />*/}
      {/*  <T content-pragmatic anemic className={css._label}>*/}
      {/*    Share*/}
      {/*  </T>*/}
      {/*</Box>*/}
    </Box>
  );
}
