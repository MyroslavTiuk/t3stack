import { type CSSProperties } from "react";
import type React from "react";
import { type UtilProps } from "../../../../utils/Html/getUtilClasses";

type InheritedProps = Partial<
  Omit<
    React.BaseHTMLAttributes<any>,
    "className" | "tagName" | "children" | "style"
  >
>;

export interface BoxPublicProps extends InheritedProps, UtilProps {
  children?: React.ReactNode;
  className?: string | (string | undefined | false)[];
  tagName?: string;
  style?: CSSProperties;
  // CSS shortcuts
  flex?: boolean;
  "flex-col"?: boolean;
  "flex-center"?: boolean;
  "flex-wrap"?: boolean;
  "flex-1"?: boolean;
  flexPri?:
    | "start"
    | "center"
    | "end"
    | "stretch"
    | "space-between"
    | "space-around"
    | "space-evenly";
  flexSec?: "start" | "center" | "end" | "baseline" | "stretch";
  "inline-block"?: boolean;
  "formatted-content"?: boolean;
}

export type BoxProps = BoxPublicProps;
