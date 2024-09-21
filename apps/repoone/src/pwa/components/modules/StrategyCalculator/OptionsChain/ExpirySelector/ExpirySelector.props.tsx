import { type OptionsChain } from "opc-types/lib/OptionsChain";
import { type Nullable } from "opc-types/lib/util/Nullable";

export interface ExpirySelectorPublicProps {
  prices: OptionsChain;
  onSelectExpiry: (exp: string) => void;
  curExpiry: Nullable<string>;
}

export type ExpirySelectorProps = ExpirySelectorPublicProps;
