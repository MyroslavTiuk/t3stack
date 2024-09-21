import type React from "react";
import { type CompWithChildren } from "opc-types/lib/util/CompWithChildren";
import { type HtmlHeadProps } from "../../core/HtmlHead/HtmlHead.props";

export interface MainLayoutPublicProps extends CompWithChildren {
  showLogoTitleMobile?: boolean;
  nestedCard?: boolean;
  card?: boolean;
  theme?: string;
  initialPageTitle?: string;
  customTopLeft?: React.ReactNode;
  noSticky?: boolean;
}

export interface MainLayoutProps extends MainLayoutPublicProps, HtmlHeadProps {}
