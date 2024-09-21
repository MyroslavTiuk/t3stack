export interface NavPassedProps {}

export type NavPublicProps = NavPassedProps;

interface NavCalcedProps {}

export interface NavProps extends NavPassedProps, NavCalcedProps {}
