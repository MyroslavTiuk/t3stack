import type React from "react";

export interface ExpandableGroupPublicProps /*extends CompWithChildren*/ {
  groups: Record<string, React.ReactNode>;
  defaultShowing?: Record<string, boolean>;
}

export type ExpandableGroupProps = ExpandableGroupPublicProps;
