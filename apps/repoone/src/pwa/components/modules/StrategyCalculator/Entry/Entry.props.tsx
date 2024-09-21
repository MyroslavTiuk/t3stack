import { type Strategy } from "opc-types/lib/Strategy";

export interface EntryPassedProps {
  currentCalc: Strategy;
}

export type EntryPublicProps = EntryPassedProps;

interface EntryCalcedProps {}

export interface EntryProps extends EntryPassedProps, EntryCalcedProps {}
