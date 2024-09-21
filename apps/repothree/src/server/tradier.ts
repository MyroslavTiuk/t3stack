import axios from "axios";
import { format } from "date-fns";
import { type OptionType } from "trackgreeks-database";
import { env } from "~/env.mjs";

export async function getStockPrice(symbol: string) {
  const { data } = await axios.get(
    `https://api.tradier.com/v1/markets/quotes?symbols=${symbol}`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${env.TRADIER_TOKEN}`,
      },
    }
  );
  const lastPrice = data?.quotes?.quote?.last;
  return lastPrice ? (lastPrice as number) : null;
}

export async function getOptionPrice({
  symbol,
  strikePrice,
  expirationDate,
  optionType,
}: {
  symbol: string;
  strikePrice: number;
  expirationDate: Date;
  optionType: OptionType;
}) {
  const { data } = await axios.get(
    `https://api.tradier.com/v1/markets/options/chains?symbol=${symbol}&expiration=${format(
      expirationDate,
      "yyyy-MM-dd"
    )}`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${env.TRADIER_TOKEN}`,
      },
    }
  );

  const lastPrice = data?.options?.option?.find(
    (option: { strike: number; option_type: "call" | "put" }) =>
      option.strike === strikePrice &&
      option.option_type.toLowerCase() === optionType.toLowerCase()
  ).last;

  return lastPrice ? (lastPrice as number) : null;
}
