import { type FC } from "react";
import React from "react";
import { omit } from "ramda";

import getUtilClasses from "../../../../utils/Html/getUtilClasses";
import clx from "../../../../utils/Html/clx";

import { type TypoPublicProps } from "./Typo.props";
import css from "./Typo.module.scss";

const VALID_TYPES = [
  "content",
  "content-detail",
  "content-detail-minor",
  "content-caption",
  "content-feature",
  "content-pragmatic",
  "content-field-label-inline",
  "content-tag",
  "content-tag-clickable",
  "content-hint",
  "content-field-label",
  "content-fields-set-label",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
];

const TAG_MAP: Record<string, string> = {
  "content-tag": "span",
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
  default: "p",
};

function getTypeStyle(props: TypoPublicProps) {
  for (const i in VALID_TYPES) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (props[VALID_TYPES[i]]) {
      return VALID_TYPES[i];
    }
  }
  return "";
}

const NON_TAG_PROPS = VALID_TYPES.concat([
  "anemic",
  "clickable",
  "subtle",
  "hinted",
  "hint",
  "no-weight",
  "no-margin",
  "tagName",
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
]);

const T: FC<TypoPublicProps> = ({
  className,
  tagName,
  ...props
}: TypoPublicProps) => {
  const typeClass: string = getTypeStyle(props);
  const utilClasses = getUtilClasses(props);

  const Tag = tagName || TAG_MAP[typeClass] || TAG_MAP.default;

  const tagProps = omit(NON_TAG_PROPS, props);

  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    <Tag
      {...tagProps}
      className={clx(
        (
          [
            css[typeClass],
            props.anemic && css["--is-anemic"],
            props.clickable && css["--is-clickable"],
            props.subtle && css["--subtle"],
            props.hinted && css["--is-hinted"],
            props.hint && css["--hint"],
            props["no-margin"] && css["--no-margin"],
            props["no-weight"] && css["--no-weight"],
          ] as (string | false)[]
        )
          .concat(utilClasses)
          .concat(className || [])
      )}
    >
      {props.children}
    </Tag>
  );
};

export default React.memo(T);

export const P = ({ children, ...props }: TypoPublicProps) => (
  <T content {...props}>
    {children}
  </T>
);
