import React, { type ReactElement } from "react";
import NextLink from "next/link";

import orUndef from "../../../../utils/Data/orUndef/orUndef";
import clx from "../../../../utils/Html/clx";

import { type ButtonProps } from "./Button.props";

import css from "./Button.module.scss";
import Icon from "../Icon";
import Box from "../Box";
import { useLinkProps } from "../Link/Link.view";

const Button = <A extends any[]>(
  props: ButtonProps<A>
): ReactElement<"div"> => {
  if (!props.text && !props.children) {
    throw new Error("Button requires either `text` or `children` prop");
  }
  const onClickHandler = React.useCallback(
    () =>
      !props.disabled && props.onClick
        ? props.onClick(...((props?.onClickParams || []) as unknown as A))
        : null,
    [props.onClick, props.disabled, ...(props?.onClickParams || [])]
  );
  const child = props.children || <span>{props.text}</span>;

  const classNames = clx([
    css["button-main"],
    props.className,
    !props.secondary &&
      !props.tertiary &&
      !props["no-color"] &&
      css["--style-primary"],
    props.square && css["--style-square"],
    props.secondary && css["--style-secondary"],
    props.tertiary && css["--style-tertiary"],
    props.outline && css["--style-outline"],
    props.ghost && css["--style-ghost"],
    props.large && css["--size-large"],
    props.small && css["--size-small"],
    props.round && css["--style-round"],
    props.stout && css["--style-stout"],
    props["x-small"] && css["--size-x-small"],
    props.disabled && css["--state-disabled"],
    props["full-width"] && css["--var-full-width"],
    props["full-width-mobile"] && css["--var-full-width-mobile"],
    props["in-set"] && css["--inSet"],
    props["set-first"] && css["--first"],
    props["set-last"] && css["--last"],
  ]);
  const linkProps = useLinkProps({
    query: props.linkQuery,
    payload: props.linkPayload,
    to: props.link || "",
  });
  const linkOnClick = React.useCallback(() => {
    props.onClick &&
      props.onClick(...((props?.onClickParams || []) as unknown as A));
  }, [props.onClick, ...(props?.onClickParams || [])]);
  if (props.link) {
    return (
      <NextLink {...linkProps} legacyBehavior>
        <a className={classNames} onClick={linkOnClick} title={props.title}>
          {child}
        </a>
      </NextLink>
    );
  }

  return (
    <button
      onClick={onClickHandler}
      className={classNames}
      ref={props.buttonRef}
      disabled={props.disabled}
      type={props.type}
      title={props.title}
    >
      {props.loading && (
        <Box flex className={["--center", css["loading-indicator"]]}>
          <Icon icon="loading" />
        </Box>
      )}
      <span
        className={clx([
          css.buttonContent,
          orUndef(props.loading && css["--loading"]),
          props.childrenClassName,
        ])}
      >
        {child}
      </span>
    </button>
  );
};

export default React.memo(Button);
