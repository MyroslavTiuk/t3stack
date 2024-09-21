export interface LinkTogglePublicProps {
  state: boolean;
  onClick: (val: boolean) => void;
  hitAreaClass?: string;
  sizeClass?: string;
  noToolTip?: boolean;
}

export type LinkToggleProps = LinkTogglePublicProps;
