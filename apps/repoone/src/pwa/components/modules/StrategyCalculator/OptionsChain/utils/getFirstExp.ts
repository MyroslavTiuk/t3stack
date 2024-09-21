import { type OptionsChain } from "opc-types/lib/OptionsChain";
import { pipe } from "ramda";

const getFirstExp = (chain: OptionsChain) =>
  pipe(Object.keys, (keys) => (keys?.length ? keys[0] : null))(chain);

export default getFirstExp;
