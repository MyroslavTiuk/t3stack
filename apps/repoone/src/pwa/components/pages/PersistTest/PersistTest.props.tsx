export interface PersistTestPassedThruProps {}

export type PersistTestPublicProps = PersistTestPassedThruProps;

interface PersistTestCalcedProps {
  add: any;
}

export interface PersistTestProps
  extends PersistTestCalcedProps,
    PersistTestPassedThruProps {}
