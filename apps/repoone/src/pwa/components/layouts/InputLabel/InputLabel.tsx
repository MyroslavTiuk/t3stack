import { type FC } from "react";
import React from "react";

import { type CompWithChildren } from "opc-types/lib/util/CompWithChildren";
import Box from "../../primitives/Box";
import T from "../../primitives/Typo";

import css from "./InputLabel.module.scss";

interface InputLabelProps extends CompWithChildren {
  label: string;
  inline?: boolean;
  labelClassName?: string;
  inputClassName?: string;
  "dont-use-label-tag"?: boolean;
  "inline-fullsize"?: boolean;
}

const InputLabel: FC<InputLabelProps> = (
  props: InputLabelProps
): ReturnType<typeof Box> => {
  return (
    <Box
      className={[
        css.container,
        props.inline || props["inline-fullsize"]
          ? css["--inline"]
          : css["--side-by-side"],
      ]}
    >
      <Box
        tagName={props["dont-use-label-tag"] ? "div" : "label"}
        className={css._label}
      >
        <T
          className={[css._labelText, props.labelClassName]}
          content-field-label-inline
          mr={1 / 3}
        >
          {props.label}
        </T>
        <Box className={[css._inputCtnr, props.inputClassName]}>
          {props.children}
        </Box>
      </Box>
    </Box>
  );
};

export default InputLabel;
