import React, { type FC } from "react";
import { pipe } from "ramda";
import { useRouter } from "next/router";
import NextLink, { type LinkProps } from "next/link";

import { type LinkProps as AppLinkProps } from "./Link.props";
import clx from "../../../../utils/Html/clx";
import orUndef from "../../../../utils/Data/orUndef/orUndef";
import buildQueryString from "../../../../utils/String/buildQueryString";
import { PATHS_NEED_DOTHTML } from "../../../../consts/ROUTE_PATHS";
import addDotHtml from "./addDotHtml";

type UseLinkPropsParams = {
  query: AppLinkProps["query"];
  payload: AppLinkProps["payload"];
  to: AppLinkProps["to"];
};

export const useLinkProps = (props: UseLinkPropsParams): LinkProps => ({
  href: !props.query ? props.to : { pathname: props.to, query: props.query },
  as: !props.payload
    ? undefined
    : pipe(
        () =>
          Object.keys(props?.payload || {}).reduce(
            (acc: string, elem: string) =>
              acc.replace(
                `[${elem}]`,
                props?.payload?.[elem]?.toString() || ""
              ),
            props.to
          ),
        (payloadAs) =>
          !props.query
            ? payloadAs
            : `${payloadAs}?${buildQueryString(props.query)}`,
        (url) => (PATHS_NEED_DOTHTML.includes(props.to) ? addDotHtml(url) : url)
      )(),
});

const useIsActive = (testPath: string): boolean =>
  testPath.length <= 2
    ? // eslint-disable-next-line react-hooks/rules-of-hooks
      testPath === useRouter()?.pathname
    : // eslint-disable-next-line react-hooks/rules-of-hooks
      useRouter()?.pathname.startsWith(testPath);

const Link: FC<AppLinkProps> = ({ children, ...props }: AppLinkProps) => {
  const className = props.className === undefined ? "link" : props.className;
  const activeClass = orUndef(
    // eslint-disable-next-line react-hooks/rules-of-hooks
    props.activeClass && useIsActive(props.to) && props.activeClass
  );

  const calcedNextLinkProps = useLinkProps({
    query: props.query,
    payload: props.payload,
    to: props.to,
  });

  const nextLinkProps: LinkProps = {
    ...calcedNextLinkProps,
    shallow: props.shallow,
    scroll: props.scroll,
  };
  const aTagProps: { title?: string } = {};
  if (props.title) aTagProps.title = props.title;

  return (
    <NextLink {...nextLinkProps} legacyBehavior>
      {typeof children === "string" ? (
        <a
          onClick={props.onClick}
          className={clx([className, activeClass])}
          {...aTagProps}
        >
          {children}
        </a>
      ) : (
        children
      )}
    </NextLink>
  );
};

export default React.memo(Link);
