import { type Nullable, type Optional } from "errable";
import { isNil } from "ramda";

import round from "../Data/round/round";

const calcMid = (
  b: Nullable<Optional<number>>,
  a: Nullable<Optional<number>>
) => {
  if (isNil(a)) return null;
  const useB = b || 0;
  return round((a + useB) / 2, 2);
};

export default calcMid;
