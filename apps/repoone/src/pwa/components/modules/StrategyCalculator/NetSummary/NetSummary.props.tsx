import { type Nullable } from "opc-types/lib/util/Nullable";
import { type ObjRecord } from "opc-types/lib/util/ObjRecord";
import { type Optional } from "opc-types/lib/util/Optional";
import { type Strategy } from "opc-types/lib/Strategy";

export interface NetSummaryPassedProps {}

export interface NetSummaryPublicProps extends NetSummaryPassedProps {
  currentCalc: Optional<Strategy>;
}

export interface NetSummaryCalcedProps {
  spreadPriceAsPerLegs: Nullable<number>;
  spreadPriceRangeAsPerLegs: [Nullable<number>, Nullable<number>];
  setSpreadPrice: (num: number) => void;
  greeks: ObjRecord<Nullable<number>>;
}

export interface NetSummaryProps
  extends NetSummaryPassedProps,
    NetSummaryCalcedProps {}
