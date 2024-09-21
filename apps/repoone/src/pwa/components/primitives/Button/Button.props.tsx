import type React from "react";
import { type LinkProps } from "../Link/Link.props";

export interface ButtonPublicProps<A extends any[]> {
  text?: string;
  title?: string;
  children?: React.ReactNode;
  onClick?: (...args: A) => void;
  onClickParams?: A;
  className?: string;
  icon?: React.ReactNode;
  buttonRef?: React.Ref<any>;

  link?: LinkProps["to"];
  linkPayload?: LinkProps["payload"];
  linkQuery?: LinkProps["query"];

  "no-color"?: boolean;
  secondary?: boolean;
  tertiary?: boolean;
  outline?: boolean;
  ghost?: boolean;
  small?: boolean;
  "x-small"?: boolean;
  large?: boolean;
  disabled?: boolean;
  loading?: boolean;
  round?: boolean;
  stout?: boolean;
  square?: boolean;
  "full-width"?: boolean;
  "full-width-mobile"?: boolean;
  "in-set"?: boolean;
  "set-first"?: boolean;
  "set-last"?: boolean;
  type?: "button" | "submit" | "reset" | undefined;
  childrenClassName?: string;
}

export type ButtonProps<A extends any[]> = ButtonPublicProps<A>;
