import { type FC } from "react";
import React from "react";
import { type CompWithClassName } from "opc-types/lib/util/CompWithClassName";

import combineClassNames from "../../../../utils/Html/combineClassNames";
import Box from "../Box";

import css from "./DropdownMenu.module.scss";
import useToggleState from "../../../../utils/Hooks/useToggleState";
import ModalContainer from "../Modal/ModalContainer";

interface DropdownMenuProps extends CompWithClassName {
  position?: "bottomLeft" | "bottomRight";
  triggerClass?: string | (string | undefined | false)[];
  noPadding?: boolean;
  noDefaultStyles?: boolean;
  children: [React.ReactNode, React.ReactNode];
}

const useDropdownMenu = () => {
  const {
    value: isOpen,
    toggle: toggleOpen,
    enable: open,
    disable: close,
  } = useToggleState();

  return {
    isOpen,
    toggleOpen,
    open,
    close,
  };
};
const DropdownMenu: FC<DropdownMenuProps> = (
  props: DropdownMenuProps
): ReturnType<typeof Box> => {
  const logic = useDropdownMenu();
  const className = combineClassNames(
    [!props.noDefaultStyles && css.container],
    props.className
  );

  return (
    <Box className={className}>
      <ModalContainer
        onClickOutside={logic.close}
        onEscapeKeyPressed={logic.close}
      >
        <Box onClick={logic.toggleOpen} className={css.trigger}>
          {props.children[0]}
        </Box>
        {logic.isOpen && (
          <Box
            className={[
              !props.noDefaultStyles && css.menuCtnr,
              (props.position === "bottomLeft" ||
                props.position === undefined) &&
                css["--bottomLeft"],
              props.position === "bottomRight" && css["--bottomRight"],
              "z-50",
            ]}
          >
            {props.children[1]}
          </Box>
        )}
      </ModalContainer>
    </Box>
  );
};

export default DropdownMenu;
