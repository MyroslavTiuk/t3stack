import type React from "react";
import { type Optional } from "opc-types/lib/util/Optional";

export interface LinkPublicProps {
  children: React.ReactNode;
  /**
   * to: the route to link to, as a string
   *
   * Contents of payload will be automatically replaced in the to string
   * E.g. `to/:payloadVar` (where payload: { payloadVar: 'payloadVal' })
   */
  to: string;
  /**
   * payload: data to pass into the route path params
   */
  payload?: Record<string, string | number>;
  query?: Record<string, string | number>;
  shallow?: boolean;
  scroll?: boolean;
  title?: string;
  /**
   * if payload replacement functionality is inadequate, use friendlyAlias as an override
   */
  // friendlyAlias?: string;
  className?: Optional<string>;
  activeClass?: string;
  onClick?: () => void;
}

export type LinkProps = LinkPublicProps;
