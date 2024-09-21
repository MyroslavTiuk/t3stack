import { type OptionsChain } from "opc-types/lib/OptionsChain";
import { type Nullable } from "opc-types/lib/util/Nullable";
import { type Strategy } from "opc-types/lib/Strategy";
import { type CHAIN_COLUMN_CHOICE } from "../../../../../types/enums/CHAIN_COLUMN_CHOICES";

export interface OptionsChainPassedProps {
  close: () => void;
  isDraggable?: boolean;
}

export type OptionsChainPublicProps = OptionsChainPassedProps;

export interface OptionsChainCalcedProps {
  prices: OptionsChain;
  curPrice: number;
  defaultExpiry: Nullable<string>;
  onSelectOption: (
    expiry: string,
    type: "call" | "put",
    strike: number,
    price: number,
    iv: number
  ) => void;
  currentCalc: Strategy;
  currentLeg: string;
  chainColumns: string[];
  setChainColumns: (cols: string[]) => void;
  columnsChoice: CHAIN_COLUMN_CHOICE;
}

export interface OptionsChainProps
  extends OptionsChainPassedProps,
    OptionsChainCalcedProps {}
