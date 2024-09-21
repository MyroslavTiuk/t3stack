import { type Nullable } from "opc-types/lib/util/Nullable";
import { type Strategy } from "opc-types/lib/Strategy";
import { type DefaultOptLeg } from "../../../../utils/Data/TransformStrategy/TransformStrategy";

export interface CalculatorPublicProps {
  initCurrentCalc: Nullable<Strategy>;
  defaultOptLegs: DefaultOptLeg[];
  prices: Array<any>;
  additionalDataChain: {
    price: string | number;
    strike: string | number;
    type: string;
    iv: string | number;
    legId: "option";
    expiry: string;
  };
}

export type CalculatorProps = CalculatorPublicProps;

export enum MobTabs {
  SAVED,
  SETUP,
  RESULTS,
}
