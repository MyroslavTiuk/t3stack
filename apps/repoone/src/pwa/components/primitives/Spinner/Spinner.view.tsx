import { type FC } from "react";
import React from "react";

import clx from "../../../../utils/Html/clx";

import { type SpinnerProps } from "./Spinner.props";
import css from "./Spinner.module.scss";

const Spinner: FC<SpinnerProps> = (props: SpinnerProps) => {
  return (
    <svg
      className={clx([
        props.className,
        css.spinner,
        props.small && css["--small"],
      ])}
      width="65px"
      height="65px"
      viewBox="0 0 66 66"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        className={css.path}
        fill="none"
        strokeWidth="6"
        strokeLinecap="round"
        cx="33"
        cy="33"
        r="30"
      />
    </svg>
  );
};

export default Spinner;
