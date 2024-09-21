import { type FC } from "react";
import React from "react";

import { type CompWithChildren } from "opc-types/lib/util/CompWithChildren";
import Box from "../Box";
import T from "../Typo";

import css from "./FieldSet.module.scss";
import { type CompWithClassName } from "opc-types/lib/util/CompWithClassName";
import combineClassNames from "../../../../utils/Html/combineClassNames";
import { type HelpIconProps } from "../HelpIcon/HelpIcon";
import HelpIcon from "../HelpIcon";

interface FieldSetProps extends CompWithChildren, CompWithClassName {
  title?: string;
  basic?: boolean;
  helpIconText?: string;
  helpClickThroughPath?: string;
  helpIconPos?: HelpIconProps["helpIconPos"];
  "no-pad"?: boolean;
}

const FieldSet: FC<FieldSetProps> = (
  props: FieldSetProps
): ReturnType<typeof Box> => {
  const className = combineClassNames(
    [
      css.container,
      props.basic && css["--basic"],
      !props["no-pad"] && css["--padded"],
    ],
    props.className
  );

  return (
    <Box tagName={props.basic ? undefined : "fieldset"} className={className}>
      {props.title && (
        <T
          content-fields-set-label={!props.basic}
          h5={props.basic}
          tagName="legend"
          className={css._title}
        >
          {props.title}
          {props.helpIconText && (
            <HelpIcon
              helpIconPos={props.helpIconPos}
              tip={props.helpIconText}
              clickThroughPath={props.helpClickThroughPath}
              className={css._helpIcon}
              wide
            />
          )}
        </T>
      )}
      <Box className={[css._children]}>{props.children}</Box>
    </Box>
  );
};

export default FieldSet;
