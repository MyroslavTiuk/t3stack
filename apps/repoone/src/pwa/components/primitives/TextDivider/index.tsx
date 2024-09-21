import React from "react";

import clx from "../../../../utils/Html/clx";

import css from "./TextDivider.module.scss";

type Props = {
  "no-pad"?: boolean;
  vertical?: boolean;
};

const TextDivider = (props: Props) => (
  <span
    className={clx([
      css["price-divider"],
      props.vertical && css["--vertical"],
      !props["no-pad"] && css["--default-pad"],
    ])}
  >
    {props.vertical ? "" : "/"}
  </span>
);

export default TextDivider;
