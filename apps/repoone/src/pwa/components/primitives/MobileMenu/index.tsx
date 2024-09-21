import { type FC } from "react";
import React from "react";

import type Box from "../Box";

import css from "./MobileMenu.module.scss";
import { type CompWithChildren } from "opc-types/lib/util/CompWithChildren";
import Icon from "../Icon";

interface MobileMenuProps extends CompWithChildren {
  menuClass?: string;
  overlayClass?: string;
  isExpanded?: boolean;
  onExpandedUpdated?: (state: boolean) => void;
  openButtonComponent?: React.ReactNode;
  closeButtonComponent?: React.ReactNode;
  openButtonColor?: string;
  direction?: "left" | "right";
}

const clx = (arr: (string | false | undefined)[]) =>
  arr.filter((c) => !!c).join(" ");

const MobileMenu: FC<MobileMenuProps> = (
  props: MobileMenuProps
): ReturnType<typeof Box> => {
  const [isExpanded, setExpanded] = React.useState(false);
  const onMenuButtonClick = React.useCallback(() => {
    const newIsExpanded = !isExpanded;
    setExpanded(newIsExpanded);
    props.onExpandedUpdated && props.onExpandedUpdated(newIsExpanded);
  }, [isExpanded, setExpanded, props.onExpandedUpdated]);
  const onOverlayClick = React.useCallback(() => {
    props.onExpandedUpdated && props.onExpandedUpdated(false);
    setExpanded(false);
  }, [setExpanded, props.onExpandedUpdated]);
  React.useEffect(() => {
    if (props.isExpanded !== undefined) {
      setExpanded(props.isExpanded);
    }
  }, [props.isExpanded]);

  return (
    <>
      <div
        className={clx([
          css.overlay,
          props.overlayClass || css["--style-default"],
          isExpanded && css["--is-expanded"],
        ])}
        onClick={onOverlayClick}
      />

      {!isExpanded ? (
        props.openButtonComponent !== undefined ? (
          props.openButtonComponent
        ) : (
          <div
            className={css.openBtn}
            style={
              props.openButtonColor ? { color: props.openButtonColor } : {}
            }
            onClick={onMenuButtonClick}
          >
            <hr />
            <hr />
            <hr />
          </div>
        )
      ) : props.closeButtonComponent !== undefined ? (
        props.closeButtonComponent
      ) : (
        <div
          className={css.closeBtn}
          style={props.openButtonColor ? { color: props.openButtonColor } : {}}
          onClick={onMenuButtonClick}
        >
          <hr />
          <hr />
        </div>
      )}
      <div
        className={clx([
          css.menuCtnr,
          props.direction === "left" && css["--dir-left"],
          props.direction !== "left" && css["--dir-right"],
          isExpanded && css["--is-expanded"],
          props.menuClass || css["--style-default"],
        ])}
      >
        <div className="h-full">
          <div className="flex justify-between bg-white px-5 py-5">
            <h3 className=" text-sm font-extrabold text-red-700">
              Saved Calculations
            </h3>
            <div
              className="flex cursor-pointer flex-col items-center justify-center"
              style={{ rotate: "180deg" }}
              onClick={onMenuButtonClick}
            >
              <Icon icon="double-h-caret" small />
            </div>
          </div>
          <p className="p-5 italic text-gray-500">
            Calculations you make will appear here
          </p>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
