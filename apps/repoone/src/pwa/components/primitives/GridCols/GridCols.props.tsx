import { type CompWithChildren } from "opc-types/lib/util/CompWithChildren";
import { type CompWithClassName } from "opc-types/lib/util/CompWithClassName";

export interface GridColsPublicProps
  extends CompWithChildren,
    CompWithClassName {
  "dont-hide-content"?: boolean;
}

export type GridColsProps = GridColsPublicProps;
