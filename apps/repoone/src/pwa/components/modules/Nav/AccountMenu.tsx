import React, { useCallback } from "react";

import Box from "../../primitives/Box";
import { useModalContext } from "../../primitives/Modal/ModalProvider";
import T from "../../primitives/Typo";
import Card from "../../primitives/Card/Card.view";

import { useSession } from "../Session/SessionProvider";
import UserSettingsModal from "../UserSettings/UserSettings.container";
import { UserSettingsTabOptions } from "../UserSettings/UserSettings.types";
import css from "./Nav.module.scss";

export default function AccountMenu({
  closeAccountMenu,
}: {
  closeAccountMenu: () => void;
}): JSX.Element {
  // @ts-ignore
  const { onLogout, userData } = useSession();
  const { showModal } = useModalContext();
  const onOpenUpdateAccountModal = useCallback(
    (initialActiveTab: UserSettingsTabOptions) => {
      showModal({
        // eslint-disable-next-line react/display-name
        content: () => (
          <UserSettingsModal initialActiveTab={initialActiveTab} />
        ),
      });

      closeAccountMenu();
    },
    [showModal, closeAccountMenu]
  );
  return (
    <Card no-pad className={css.accountMenu}>
      <Box
        className={css._menuItem}
        onClick={() => onOpenUpdateAccountModal(UserSettingsTabOptions.Account)}
      >
        <T>Account</T>
      </Box>
      <Box
        className={css._menuItem}
        onClick={() =>
          onOpenUpdateAccountModal(UserSettingsTabOptions.Calculator)
        }
      >
        <T>Calculator Settings</T>
      </Box>

      <Box className={css.menuDivider} />

      <Box
        onClick={() => {
          closeAccountMenu();
          onLogout();
        }}
        className={css._menuItem}
      >
        <T>Sign out</T>
        <T className={css._subMenu}>Logged in as: {userData.emailAddress}</T>
      </Box>
    </Card>
  );
}
