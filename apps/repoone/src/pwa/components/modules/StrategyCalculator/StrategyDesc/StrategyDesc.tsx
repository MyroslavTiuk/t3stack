import React from "react";
import { type StratName } from "opc-types/lib/StratName";
import { LAYOUT_OPTIONS } from "../../../../../types/enums/LAYOUT_OPTIONS";

import Box from "../../../primitives/Box";
import T from "../../../primitives/Typo";
import Icon from "../../../primitives/Icon";
import ifUndef from "../../../../../utils/Data/ifUndef/ifUndef";
import userSettingsActions from "../../../../store/actions/userSettings";
import { useSession } from "../../Session/SessionProvider";

import css from "./StrategyDesc.module.scss";
import Strategies from "../../../../../model/Strategies";

interface Props {
  stratName: StratName;
}

const StrategyDesc = (props: Props) => {
  const strategy = Strategies.getStrategyFilled(props.stratName);
  const {
    metadata: { helpDescription },
  } = strategy;
  const { dispactionUserSettings, userData } = useSession();
  const defaultOpenState: boolean = ifUndef(
    userData?.userSettings?.showStrategyDesc,
    true
  );
  const layout = ifUndef(
    userData?.userSettings?.layout,
    LAYOUT_OPTIONS.STACKED
  );

  const [isOpen, setIsOpen] = React.useState(defaultOpenState);

  const updateShowStrategyDesc = dispactionUserSettings(
    userSettingsActions.setShowStrategyDesc
  );
  const toggle = React.useCallback(() => {
    setIsOpen((v) => {
      updateShowStrategyDesc(!v);
      return !v;
    });
  }, [setIsOpen, updateShowStrategyDesc]);

  const isSBS = layout === LAYOUT_OPTIONS.SIDE_BY_SIDE;
  return !helpDescription ? null : (
    <Box className={[css.stratDescCtnr, isSBS && css["--panel"]]}>
      {isOpen ? (
        <>
          {isSBS && (
            <Icon
              icon={"close"}
              ctnrClassName={css._closeIcon}
              colorClickable
              xsmall
              onClick={toggle}
            />
          )}
          <Box
            className={css._desc}
            dangerouslySetInnerHTML={{ __html: helpDescription || "" }}
          />
        </>
      ) : (
        <T content-detail clickable onClick={toggle} mt={isOpen ? 1 / 2 : 0}>
          Show strategy description
        </T>
      )}
    </Box>
  );
};

export default React.memo(StrategyDesc);
