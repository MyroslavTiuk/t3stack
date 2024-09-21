import { type FC } from "react";
import React from "react";

import T from "../../../primitives/Typo";
import { type CompWithChildren } from "opc-types/lib/util/CompWithChildren";
import { isUndefined } from "errable";
import useMediaQuery from "../../../../../utils/Hooks/useMediaQuery";

interface Props extends CompWithChildren {
  editable?: boolean;
  mb?: number;
}

const Title: FC<Props> = (props: Props) => {
  const isMobile = useMediaQuery("mobile-only");
  // todo: make editable
  return (
    <T
      h3={!isMobile}
      h5={isMobile}
      tagName="h1"
      mb={isUndefined(props.mb) ? 2 : props.mb}
    >
      {props.children}
    </T>
  );
};

export default Title;
