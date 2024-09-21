import { type CompWithChildren } from "opc-types/lib/util/CompWithChildren";
import { type UtilProps } from "../../../../utils/Html/getUtilClasses";

export interface CardPublicProps extends CompWithChildren, UtilProps {
  className?: string | (string | undefined | false)[];
  "no-pad"?: boolean;
  "no-radius"?: boolean;
  "high-contrast"?: boolean;
  inset?: boolean;
  level2?: boolean;
}

export type CardProps = CardPublicProps;
