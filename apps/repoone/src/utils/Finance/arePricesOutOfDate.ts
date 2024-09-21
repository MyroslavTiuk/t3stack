import { type PriceData } from "opc-types/lib/PriceData";
import Exchanges from "../../config/Exchanges";

const arePricesOutOfDate = (
  priceData: PriceData,
  ttl_price_data = Exchanges.TTL_PRICE_DATA,
  time: number = Date.now()
) => {
  if (!priceData.retrievedTime) return true;
  return priceData.retrievedTime < time - ttl_price_data * 1000 * 60;
};

export default arePricesOutOfDate;
