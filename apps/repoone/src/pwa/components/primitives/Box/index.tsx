import React, { type FC, type ReactElement } from "react";
import { omit } from "ramda";

import { type BoxProps } from "./Box.props";
import clx from "../../../../utils/Html/clx";
import getUtilClasses from "../../../../utils/Html/getUtilClasses";

export const NON_TAG_PROPS = [
  "mt",
  "mr",
  "mb",
  "ml",
  "mh",
  "mv",
  "pt",
  "pr",
  "pb",
  "pl",
  "ph",
  "pv",
  "p",
  "h",
];

const Box: FC<BoxProps> = ({
  className,
  flex: flex,
  "flex-1": flex1,
  "flex-col": flexCol,
  "flex-center": flexCenter,
  "flex-wrap": flexWrap,
  "inline-block": inlineBlock,
  "formatted-content": formattedContent,
  flexPri,
  flexSec,
  children,
  tagName,
  ...props
}: BoxProps): ReactElement<"div"> => {
  const Tag = tagName || "div";
  const utilClasses = getUtilClasses(props);

  const tagProps = omit(NON_TAG_PROPS, props);

  return (
    // @ts-ignore
    <Tag
      className={clx([
        className && clx(className),
        (flex || flexCol || flexCenter || flexPri || flexSec || flexWrap) &&
          "flex",
        formattedContent && "formatted-content",
        flexCol && "--col",
        flexCenter && "--center",
        flexWrap && "--wrap",
        flexPri && `--pri-${flexPri}`,
        flexSec && `--sec-${flexSec}`,
        flex1 && "flex-1",
        inlineBlock && "inline-block",
        ...utilClasses,
      ])}
      {...tagProps}
    >
      {children || null}
    </Tag>
  );
};

export default React.memo(Box);
