export interface StrategySelectorPublicProps {
  symb?: string;
  plain?: boolean;
  splitCustom?: boolean;
}

interface StrategySelectorCalcedProps {
  onStratClick?: () => void;
}

export type StrategySelectorProps = StrategySelectorPublicProps &
  StrategySelectorCalcedProps;

export type State = {
  searchTerm: string;
};
