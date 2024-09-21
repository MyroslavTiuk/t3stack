import { type FC } from "react";
import React from "react";

import Box from "../Box";
import Tooltip, { type TooltipProps } from "../Tooltip/Tooltip";

import css from "./HelpIcon.module.scss";

export type HelpIconProps = Omit<TooltipProps, "children"> & {
  clickThroughPath?: string;
  helpIconPos?:
    | "top-right"
    | "top-left"
    | "bottom-left"
    | "bottom"
    | "right"
    | "left";
};

const DELAY_TIL_SHOW = 50;
const DELAY_TIL_HIDE = 200;

const HelpIcon: FC<HelpIconProps> = (
  props: HelpIconProps
): ReturnType<typeof Box> => {
  const [showTooltip, setShowTooltip] = React.useState(false);
  const onHoverTimeout = React.useRef<number>(-1);
  const onLeaveTimeout = React.useRef<number>(-1);
  const onMouseOver = React.useCallback(() => {
    clearTimeout(onHoverTimeout.current);
    clearTimeout(onLeaveTimeout.current);
    onHoverTimeout.current = window.setTimeout(
      () => setShowTooltip(true),
      DELAY_TIL_SHOW
    );
  }, [setShowTooltip]);
  const onMouseOut = React.useCallback(() => {
    clearTimeout(onHoverTimeout.current);
    clearTimeout(onLeaveTimeout.current);
    onLeaveTimeout.current = window.setTimeout(
      () => setShowTooltip(false),
      DELAY_TIL_HIDE
    );
  }, [setShowTooltip]);

  return (
    <Box
      className={props.className}
      inline-block
      onMouseLeave={onMouseOut}
      onMouseEnter={onMouseOver}
    >
      <Tooltip
        tip={props.tip}
        wide={props.wide}
        className={css.tooltip}
        clickThroughPath={props.clickThroughPath}
        showing={showTooltip}
        {...(props.helpIconPos ? { [props.helpIconPos]: true } : {})}
      >
        <Box
          className={[
            css.clickTarget,
            props.clickThroughPath && css["--clickable"],
          ]}
        >
          <Box
            className={[
              css._icon,
              props.clickThroughPath && css["--clickable"],
            ]}
            tagName="span"
          >
            ?
          </Box>
        </Box>
      </Tooltip>
    </Box>
  );
};

export default HelpIcon;
