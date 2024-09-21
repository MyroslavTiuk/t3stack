import { type validIconMap } from "./index";

export interface IconPublicProps {
  icon: keyof typeof validIconMap;
  className?: string;
  ctnrClassName?: string;
  onClick?: () => void;
  rotate?: number;

  inline?: boolean;
  xsmall?: boolean;
  small?: boolean;
  smallMedium?: boolean;
  large?: boolean;
  noSize?: boolean;
  colorGuide?: boolean;
  colorClickable?: boolean;
  colorHalfLink?: boolean;
  alt?: string;
}

export type IconProps = IconPublicProps;
