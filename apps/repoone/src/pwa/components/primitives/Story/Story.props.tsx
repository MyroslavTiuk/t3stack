import { type CompWithChildren } from "opc-types/lib/util/CompWithChildren";

export interface StoryPublicProps extends CompWithChildren {
  title: string;
  className?: string;
  desc?: string;
}

export type StoryProps = StoryPublicProps;
