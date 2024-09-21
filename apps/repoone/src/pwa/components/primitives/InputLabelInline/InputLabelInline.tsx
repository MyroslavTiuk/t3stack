import { type FC } from "react";
import React from "react";

import Box from "../Box";
import T from "../Typo";

import { type CompWithChildren } from "opc-types/lib/util/CompWithChildren";
import { type CompWithClassName } from "opc-types/lib/util/CompWithClassName";

import css from "./InputLabelInline.module.scss";

interface InputLabelInlineProps extends CompWithChildren, CompWithClassName {
  label: string;
  mobileLabel?: string;
  afterLabel?: React.ReactNode;
  disabled?: boolean;
}

const InputLabelInline: FC<InputLabelInlineProps> = (
  props: InputLabelInlineProps
): ReturnType<typeof Box> => {
  return (
    <Box inline-block className={props.className}>
      <Box flexSec="baseline">
        <T
          content-field-label-inline
          anemic
          className={[css.label, props.disabled && css["--disabled"]]}
        >
          {props.mobileLabel ? (
            <>
              <span className="hide-tab-plus">{props.mobileLabel}</span>
              <span className="hide-mob">{props.label}</span>
            </>
          ) : (
            props.label
          )}
        </T>
        {props.afterLabel && <Box flex-1>{props.afterLabel}</Box>}
      </Box>
      {props.children}
    </Box>
  );
};

export default InputLabelInline;
