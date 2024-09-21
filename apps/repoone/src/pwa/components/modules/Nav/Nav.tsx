/* eslint-disable no-unused-expressions */
/* eslint-disable no-underscore-dangle */
import React, {
  type FC,
  type ReactElement,
  useCallback,
  useEffect,
  useState,
} from "react";

// import useMediaQuery from "../../../../utils/Hooks/useMediaQuery";
import Icon from "../../primitives/Icon";
import MobileMenu from "../../primitives/MobileMenu";
// import { useModalContext } from "../../primitives/Modal/ModalProvider";

import useModal from "../../primitives/Modal/useModal";
// import { type UserSettingsTabOptions } from "../UserSettings/UserSettings.types";
import css from "./Nav.module.scss";
import { type NavProps } from "./Nav.props";

const Nav: FC<NavProps> = (_props: NavProps): ReactElement<"div"> => {
  const [openState, setOpenState] = useState(false);
  const closeMenu = useCallback(() => setOpenState(false), [setOpenState]);
  const { setModalOpen } = useModal();
  //const { onLogout, userHasRegistered, authStatus } = useSession();
  // const useBurgerMenu = useMediaQuery("tablet-down");
  // const trackUI = useDispaction(analyticsActions.basicInteraction);
  // const trackCalculatorClick = usePartialledCallback(trackUI, [
  //   'Clicked Nav: Calculator',
  // ]);

  useEffect(() => {
    setModalOpen(openState);
    if (openState) {
      // @ts-ignore
      window?.scrollTo && window?.scrollTo(0, 0);
    }
  }, [openState]);

  // const { showModal } = useModalContext();
  // const onOpenUpdateAccountModal = useCallback(
  //   (initialActiveTab: UserSettingsTabOptions) => {
  //     showModal({
  //       // eslint-disable-next-line react/display-name
  //       content: () => (
  //         // <UserSettingsModal initialActiveTab={initialActiveTab} />
  //         <div></div>
  //       ),
  //     });

  //     closeMenu();
  //   },
  //   [showModal, closeMenu]
  // );

  return (
    <MobileMenu
      menuClass={css.mobileMenu}
      overlayClass={css.mobileMenuOverlay}
      openButtonColor={"#fffffff8"}
      closeButtonComponent={
        <Icon
          icon={"close"}
          onClick={closeMenu}
          ctnrClassName={css.closeBtn}
          small
        />
      }
      isExpanded={openState}
      onExpandedUpdated={setOpenState}
    >
      <div></div>
    </MobileMenu>
  );
};

export default Nav;
