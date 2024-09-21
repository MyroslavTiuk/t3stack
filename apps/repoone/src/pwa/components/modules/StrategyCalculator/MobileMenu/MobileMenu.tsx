import React, { type FC } from "react";

import { type CompWithClassName } from "opc-types/lib/util/CompWithClassName";
import Box from "../../../primitives/Box";
import T from "../../../primitives/Typo";

import css from "./MobileMenu.module.scss";
import combineClassNames from "../../../../../utils/Html/combineClassNames";
import Icon from "../../../primitives/Icon";
import { MobTabs } from "../StrategyCalculator.props";

interface MobileMenuProps extends CompWithClassName {
  mobSelectedTab: MobTabs;
  onClickSavedTab: () => void;
  calcUpdateAvailable: boolean;
  calculating: boolean;
  onClickSetupTab: () => void;
  onClickEstimatesTab: () => void;
  children?: { before?: React.ReactNode; after?: React.ReactNode };
  savedCalcsDisabled?: boolean;
}

const MobileMenu: FC<MobileMenuProps> = (
  props: MobileMenuProps
): ReturnType<typeof Box> => {
  const combinedClasses = combineClassNames([css.mobileMenu], props.className);
  return (
    <Box className={combinedClasses}>
      <Box flexSec="center" className={css._inner}>
        {props.children?.before && props.children?.before}
        <Box
          className={[
            css._tab,
            props.mobSelectedTab === MobTabs.SAVED && css["--selected"],
            props.savedCalcsDisabled && css["--disabled"],
          ]}
          onClick={
            !props.savedCalcsDisabled ? props.onClickSavedTab : undefined
          }
        >
          <Icon icon="multi-select" className={css._icon} />
          <T className={css._link}>Calcs</T>
        </Box>
        <Box
          className={[
            css._tab,
            props.mobSelectedTab === MobTabs.SETUP && css["--selected"],
            props.calculating && css["--is-updating"],
          ]}
          onClick={props.onClickSetupTab}
        >
          <T className={css._link}>Setup</T>
        </Box>
        <Box
          className={[
            css._tab,
            props.mobSelectedTab === MobTabs.RESULTS && css["--selected"],
            props.calcUpdateAvailable && css["--has-update"],
            props.calculating && css["--is-updating"],
          ]}
          onClick={props.onClickEstimatesTab}
        >
          <T className={css._link}>Estimates</T>
        </Box>
        {props.children?.after && props.children?.after}
      </Box>
    </Box>
  );
};

export default MobileMenu;
