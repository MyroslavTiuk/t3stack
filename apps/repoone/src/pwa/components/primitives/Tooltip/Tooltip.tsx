import React, { type FC } from "react";

import { type CompWithClassName } from "opc-types/lib/util/CompWithClassName";

import combineClassNames from "../../../../utils/Html/combineClassNames";
import Box from "../Box";
import Link from "../Link/Link.view";

import css from "./Tooltip.module.scss";

export interface TooltipProps extends CompWithClassName {
  children?: React.ReactNode;
  tip: string | React.ReactNode;
  wide?: boolean;
  strong?: boolean;
  right?: boolean;
  left?: boolean;
  bottom?: boolean;
  "bottom-left"?: boolean;
  "bottom-right"?: boolean;
  "hard-bottom-left"?: boolean;
  "top-left"?: boolean;
  "hard-top-left"?: boolean;
  "top-right"?: boolean;
  showing?: boolean;
  clickThroughPath?: string;
  clickThroughText?: string;
  emWidth?: number;
  "no-touch"?: boolean;
  block?: boolean;
}

const Tooltip: FC<TooltipProps> = (
  props: TooltipProps
): ReturnType<typeof Box> => {
  const classNames = combineClassNames([css.container], props.className);
  const posTop =
    !props.bottom &&
    !props.left &&
    !props.right &&
    !props["bottom-left"] &&
    !props["bottom-right"] &&
    !props["hard-bottom-left"] &&
    !props["top-right"] &&
    !props["hard-top-left"] &&
    !props["top-left"];
  return (
    <Box className={classNames} inline-block={!props.block}>
      {props.children || null}
      <Box
        flex-col
        style={{ minWidth: `${props.emWidth || (props.wide ? 18 : 12)}em` }}
        className={[
          css.tooltip,
          props.showing === undefined && css["--show-on-hover"],
          props["no-touch"] && css["--no-touch"],
          props.showing && css["--showing"],
          props.strong && css["--strong"],
          typeof props.tip === "string" && css["--basic"],
          props.wide && css["--wide"],
          props.right && css["--pos-right"],
          props.left && css["--pos-left"],
          props.bottom && css["--pos-bottom"],
          props["bottom-left"] && css["--pos-bottomLeft"],
          props["bottom-right"] && css["--pos-bottomRight"],
          props["hard-bottom-left"] && css["--pos-hardBottomLeft"],
          props["top-left"] && css["--pos-topLeft"],
          props["hard-top-left"] && css["--pos-hardTopLeft"],
          props["top-right"] && css["--pos-topRight"],
          posTop && css["--pos-top"],
        ]}
      >
        {props.tip}
        {props.clickThroughPath && (
          <Link to={props.clickThroughPath} className={css._link}>
            {props.clickThroughText || "Learn more"}
          </Link>
        )}
      </Box>
    </Box>
  );
};

export default Tooltip;
