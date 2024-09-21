import React from "react";
import { type FC } from "react";
import { SlideDown } from "react-slidedown";

import { type CompWithChildren } from "opc-types/lib/util/CompWithChildren";

interface DropdownToggleProps extends CompWithChildren {
  open?: boolean;
}

const DropdownToggle: FC<DropdownToggleProps> = (
  props: DropdownToggleProps
) => {
  return (
    <SlideDown className={"opcalc-dropdown-slidedown"}>
      {props.open ? props.children : null}
    </SlideDown>
  );
};

export default DropdownToggle;
