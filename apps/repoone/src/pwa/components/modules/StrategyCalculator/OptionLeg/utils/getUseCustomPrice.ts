import { type Nullable } from "opc-types/lib/util/Nullable";

const getUseCustomPrice = (
  price: Nullable<number>,
  priceLow: Nullable<number>,
  priceHigh: Nullable<number>
): boolean => {
  if (!price) {
    return false;
  } else {
    if (price >= (priceLow || 0) && price <= (priceHigh || Infinity)) {
      return false;
    } else {
      return true;
    }
  }
};

export default getUseCustomPrice;
