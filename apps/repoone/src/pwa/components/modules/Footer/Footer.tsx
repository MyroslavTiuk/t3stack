import React, { type FC, useCallback } from "react";

import { type StratName } from "opc-types/lib/StratName";
import { type CompWithChildren } from "opc-types/lib/util/CompWithChildren";

import ROUTE_PATHS from "../../../../consts/ROUTE_PATHS";
import CONTENT_PATHS from "../../../../consts/CONTENT_PATHS";
import { useModalContext } from "../../primitives/Modal/ModalProvider";
import Box from "../../primitives/Box";
import T from "../../primitives/Typo";
import Link from "../../primitives/Link/Link.view";
import { useSession } from "../Session/SessionProvider";
import { AUTH_STATUS } from "../Session/Session.types";
import UserSettingsContainer from "../UserSettings/UserSettings.container";
import { UserSettingsTabOptions } from "../UserSettings/UserSettings.types";
import LoginRegistrationContainer, {
  LoginRegistrationTabOptions,
} from "../Session/LoginRegistration.container";

import Strategies from "../../../../model/Strategies";
import Hr from "../../primitives/Hr";

import css from "./Footer.module.scss";

type FooterProps = {};

const strats = Strategies.getStrategies();

const CALCULATORS: [StratName, string][] = (
  Object.keys(strats) as StratName[]
).map((stratKey) => [stratKey, `${strats[stratKey].title} calculator`]);

// const LEARN_OPTIONS: [string, string][] = [
//   ["path", "Introduction to options trading"],
// ];

const Group = ({ children }: CompWithChildren) => (
  <Box className={css.group} mb={1}>
    {children}
  </Box>
);
const MenuHeader = ({ children }: CompWithChildren) => (
  <T className={css._header} content mb={1 / 2}>
    {children}
  </T>
);
const MenuBody = ({ children }: CompWithChildren) => (
  <Box tagName={"ul"} className={css._menu} flex-col>
    {children}
  </Box>
);

const Footer: FC<FooterProps> = (): // props: FooterProps
ReturnType<typeof Box> => {
  const session = useSession();
  const { showModal, hideModal } = useModalContext();

  const onSettingsClick = useCallback(
    (initialActiveTab: UserSettingsTabOptions) => {
      showModal({
        // eslint-disable-next-line react/display-name
        content: () => (
          <UserSettingsContainer initialActiveTab={initialActiveTab} />
        ),
      });
    },
    [showModal, hideModal]
  );

  const onLoginClick = useCallback(
    (initialActiveTab: LoginRegistrationTabOptions) => {
      showModal({
        // eslint-disable-next-line react/display-name
        content: () => (
          <LoginRegistrationContainer
            initialActiveTab={initialActiveTab}
            onLoginSuccess={hideModal}
          />
        ),
      });
    },
    [showModal, hideModal]
  );

  return (
    <Box>
      <Box flexPri={"stretch"} className={"theme-override--dark"}>
        <Group>
          <MenuHeader>All calculators</MenuHeader>
          <Box tagName={"ul"} className={css.colMenu} flex-wrap>
            {CALCULATORS.map((linkInfo) => (
              <Box className={css._item} key={linkInfo[0]}>
                <Link
                  className={css.itemLink}
                  to={ROUTE_PATHS.CALCULATOR}
                  payload={{ strat: linkInfo[0] }}
                >
                  {linkInfo[1]}
                </Link>
              </Box>
            ))}
          </Box>
        </Group>
      </Box>
      <Box
        flexPri={"stretch"}
        flex-wrap
        className={"theme-override--dark"}
        mt={3}
      >
        <Group>
          <MenuHeader>Help</MenuHeader>
          <MenuBody>
            <Link className={css.itemLink} to={ROUTE_PATHS.HELP}>
              Frequently asked questions
            </Link>
            <Link className={css.itemLink} to={ROUTE_PATHS.CONTACT}>
              Contact us
            </Link>
          </MenuBody>
        </Group>
        <Group>
          <MenuHeader>About</MenuHeader>
          <MenuBody>
            <Link
              className={css.itemLink}
              to={ROUTE_PATHS.ABOUT}
              title={"About Options Profit Calculator"}
            >
              About OPCalc
            </Link>
            <Link className={css.itemLink} to={ROUTE_PATHS.FEATURES}>
              Features
            </Link>
            <Link className={css.itemLink} to={CONTENT_PATHS.ABOUT_WHATS_NEW}>
              What's new
            </Link>
            <Box ml={1 / 3} style={{ width: "3rem" }} mv={1 / 2}>
              <Hr />
            </Box>
            <Link
              className={css.itemLink}
              to={ROUTE_PATHS.TERMS_AND_CONDITIONS}
            >
              Terms and Conditions
            </Link>
            <Link className={css.itemLink} to={ROUTE_PATHS.PRIVACY_POLICY}>
              Privacy Policy
            </Link>
            {/* todo: Sitemap? */}
          </MenuBody>
        </Group>
        <Group>
          <MenuHeader>My OPCalc</MenuHeader>
          <MenuBody>
            {session.authStatus === AUTH_STATUS.STATE_AUTHED ? (
              <>
                <Link className={css.itemLink} to={ROUTE_PATHS.PORTFOLIO}>
                  My Portfolio
                </Link>
                <T
                  className={[css.itemLink]}
                  tagName="a"
                  onClick={() =>
                    onSettingsClick(UserSettingsTabOptions.Account)
                  }
                >
                  Account
                </T>
                <T
                  className={[css.itemLink]}
                  tagName="a"
                  onClick={() =>
                    onSettingsClick(UserSettingsTabOptions.Calculator)
                  }
                >
                  Calculator settings
                </T>
              </>
            ) : (
              <>
                <T
                  className={[css.itemLink, "text-link"]}
                  onClick={() =>
                    onLoginClick(LoginRegistrationTabOptions.Login)
                  }
                >
                  Login
                </T>
                <T
                  className={[css.itemLink, "text-link"]}
                  onClick={() =>
                    onLoginClick(LoginRegistrationTabOptions.Register)
                  }
                >
                  Register
                </T>
              </>
            )}
          </MenuBody>
        </Group>
      </Box>
      <T className={[css.copyright, "align-center"]} mt={2}>
        &copy; Options Profit Calculator 2008-2020
      </T>
    </Box>
  );
};

export default Footer;
