import React from "react";
import ROUTE_PATHS from "../../../../consts/ROUTE_PATHS";
import Box from "../../primitives/Box";
import Icon from "../../primitives/Icon";
import Link from "../../primitives/Link";
import T from "../../primitives/Typo";
import portfolioPageName from "../../pages/Portfolio/portfolio.page-name";

import { useSession } from "../Session/SessionProvider";
import { UserSettingsTabOptions } from "../UserSettings/UserSettings.types";
import css from "./Nav.module.scss";

interface Props {
  onOpenUpdateAccountModal: (initialActiveTab: UserSettingsTabOptions) => void;
}
export default function AccountMenuMobile({ onOpenUpdateAccountModal }: Props) {
  const { userData } = useSession();
  return (
    <>
      <Box
        className={[css.mobileAccountMenu, css["nav-link-ctnr"]]}
        onClick={() => onOpenUpdateAccountModal(UserSettingsTabOptions.Account)}
      >
        <div className={css.iconContainer}>
          <Icon icon="user" className={css.icon} />
        </div>
        <div className={css.loggedInAs}>
          <T className={css._desc}>Logged in as:</T>
          <T className={css._emailAddress}>{userData.emailAddress}</T>
        </div>
      </Box>
      <Box className={[css["nav-link-ctnr"], css.myPortfolio]}>
        <Link
          to={ROUTE_PATHS.PORTFOLIO}
          className={css._link}
          activeClass={css["--active"]}
        >
          {portfolioPageName.titleCase}
        </Link>
      </Box>
      <Box className={[css.headerSpace, css.menuDivider]} />
    </>
  );
}
