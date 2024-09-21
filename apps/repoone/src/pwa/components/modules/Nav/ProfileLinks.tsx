import React, { useCallback, useState } from "react";

import ROUTE_PATHS from "../../../../consts/ROUTE_PATHS";
import useMediaQuery from "../../../../utils/Hooks/useMediaQuery";
import Box from "../../primitives/Box";
import Button from "../../primitives/Button";
import Icon from "../../primitives/Icon";
import Link from "../../primitives/Link";
import { useModalContext } from "../../primitives/Modal/ModalProvider";
import T from "../../primitives/Typo";

import ModalContainer from "../../primitives/Modal/ModalContainer";
import LoginRegistrationContainer, {
  LoginRegistrationTabOptions,
} from "../Session/LoginRegistration.container";
import { AUTH_STATUS } from "../Session/Session.types";
import { UserSettingsTabOptions } from "../UserSettings/UserSettings.types";
import AccountMenu from "./AccountMenu";
import css from "./Nav.module.scss";
import portfolioPageName from "../../pages/Portfolio/portfolio.page-name";

interface ProfileProps {
  closeMenu: () => void;
  authStatus: AUTH_STATUS;
  registrationStatus: boolean;
  onLogout: () => void;
  onOpenUpdateAccountModal: (initialActiveTab: UserSettingsTabOptions) => void;
}

const ProfileLinks = ({
  closeMenu,
  authStatus,
  registrationStatus,
  onOpenUpdateAccountModal,
  onLogout,
}: ProfileProps) => {
  // Note: query should keep in sync with mixin mobile-menu-size value
  const isMobileSize = useMediaQuery("tablet-down");
  const [isAccountMenuVisible, setIsAccountMenuVisible] = useState(false);

  const { showModal, hideModal } = useModalContext();
  const onLogin = useCallback(() => {
    showModal({
      // eslint-disable-next-line react/display-name
      content: () => (
        <LoginRegistrationContainer
          initialActiveTab={LoginRegistrationTabOptions.Login}
          onLoginSuccess={hideModal}
        />
      ),
    });
  }, [showModal]);

  const onRegister = useCallback(() => {
    showModal({
      // eslint-disable-next-line react/display-name
      content: () => (
        <LoginRegistrationContainer
          initialActiveTab={LoginRegistrationTabOptions.Register}
          onLoginSuccess={hideModal}
        />
      ),
    });
  }, [showModal]);

  const onCloseAccountMenu = useCallback(() => {
    setIsAccountMenuVisible(false);
  }, [setIsAccountMenuVisible]);

  const onAccountMenuClicked = useCallback(() => {
    setIsAccountMenuVisible((currentValue) => !currentValue);
  }, [setIsAccountMenuVisible]);

  // eslint-disable-next-line no-constant-condition
  if (1) {
    if (!registrationStatus && authStatus !== AUTH_STATUS.STATE_LOADING) {
      return isMobileSize ? (
        <Box onClick={closeMenu} className={css["nav-link-ctnr"]}>
          <T className={css._link} onClick={onLogin}>
            Login/Register
          </T>
        </Box>
      ) : (
        <>
          <Button
            outline
            secondary
            className={css.loginButton}
            onClick={onLogin}
          >
            Login
          </Button>
          <Button secondary onClick={onRegister}>
            {" "}
            Register
          </Button>
        </>
      );
    } else if (authStatus === AUTH_STATUS.STATE_LOADING) {
      // todo: on STATE_LOADING, disable buttons / show loading ?
      return isMobileSize ? (
        <Box onClick={closeMenu} className={css["nav-link-ctnr"]}>
          <T className={css._link} onClick={onLogin}>
            Login/Register
          </T>
        </Box>
      ) : (
        <Box className={css.loginLoading}>
          <Box flex-center className={css._loadingCtnr}>
            <Icon icon="loading" />
          </Box>
          <Box style={{ visibility: "hidden" }}>
            <Button outline secondary className={css.loginButton}>
              Login
            </Button>
            <Button secondary> Register</Button>
          </Box>
        </Box>
      );
    } else if (AUTH_STATUS.STATE_AUTHED && registrationStatus) {
      return isMobileSize ? (
        <>
          <Box className={[css.footerSpace, css.menuDivider]} />
          <Box className={css["nav-link-ctnr"]} onClick={closeMenu}>
            <T
              onClick={() =>
                onOpenUpdateAccountModal(UserSettingsTabOptions.Calculator)
              }
              className={css._link}
            >
              Calculator Settings
            </T>
          </Box>
          <Box className={css["nav-link-ctnr"]}>
            <T
              onClick={() => {
                onLogout();
                closeMenu();
              }}
              className={css._link}
            >
              Sign out
            </T>
          </Box>
        </>
      ) : (
        <>
          <Box className={[css["nav-link-ctnr"], css.portfolio]}>
            <Link
              to={ROUTE_PATHS.PORTFOLIO}
              className={css._link}
              activeClass={css["--active"]}
            >
              {portfolioPageName.titleCase}
            </Link>
          </Box>
          <ModalContainer
            onClickOutside={onCloseAccountMenu}
            onEscapeKeyPressed={onCloseAccountMenu}
            className={[css["nav-link-ctnr"], css.accountMenuIcon]}
          >
            <Icon
              icon="user"
              className={css.icon}
              onClick={onAccountMenuClicked}
            />
            {isAccountMenuVisible && (
              <AccountMenu closeAccountMenu={onCloseAccountMenu} />
            )}
          </ModalContainer>
        </>
      );
    }
  }
  return null;
};

export default ProfileLinks;
