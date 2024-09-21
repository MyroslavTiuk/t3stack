import { type CompWithClassName } from "opc-types/lib/util/CompWithClassName";

export type QuickStartPanelPublicProps = CompWithClassName;

export interface QuickStartPanelProps extends QuickStartPanelPublicProps {
  showQuick?: boolean;
}
