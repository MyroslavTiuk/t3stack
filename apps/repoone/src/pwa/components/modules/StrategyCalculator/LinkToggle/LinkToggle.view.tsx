import { type FC } from "react";
import React from "react";

import clx from "../../../../../utils/Html/clx";
import Box from "../../../primitives/Box";
import Icon from "../../../primitives/Icon";

import { type LinkToggleProps } from "./LinkToggle.props";

import css from "./LinkToggle.module.scss";
import Tooltip from "../../../primitives/Tooltip";

const LinkToggle: FC<LinkToggleProps> = (
  props: LinkToggleProps
): ReturnType<typeof Icon> => {
  const linkToggleCode = (
    <Box
      className={[props.hitAreaClass]}
      onClick={() => props.onClick(!props.state)}
    >
      <Box className={[css.iconSwitcher, props.state && css["--is-linked"]]}>
        <Icon
          className={css._icon}
          icon={"link"}
          small={props.sizeClass === undefined}
          ctnrClassName={clx([
            css._iconCtnr,
            props.sizeClass,
            css["--icon-linked"],
          ])}
          noSize
        />
        <Icon
          className={css._icon}
          icon={"unlink"}
          small={props.sizeClass === undefined}
          ctnrClassName={clx([
            css._iconCtnr,
            props.sizeClass,
            css["--icon-unlinked"],
          ])}
          noSize
        />
      </Box>
    </Box>
  );
  return props.noToolTip ? (
    linkToggleCode
  ) : (
    <Tooltip
      className={css.tooltip}
      emWidth={5}
      tip={props.state ? "Unlink" : "Link"}
    >
      {linkToggleCode}
    </Tooltip>
  );
};

export default React.memo(LinkToggle);
