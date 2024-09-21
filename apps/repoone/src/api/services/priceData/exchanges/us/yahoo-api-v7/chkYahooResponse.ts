import { type YahooDataOutlineSuccess } from "./types";

export const chkYahooResponse = (
  respData: any
): respData is YahooDataOutlineSuccess => {
  return (
    Array.isArray(respData?.optionChain?.result) &&
    respData?.optionChain?.result?.length > 0 &&
    Array.isArray(respData?.optionChain?.result?.[0]?.expirationDates) &&
    Array.isArray(respData?.optionChain?.result?.[0]?.strikes) &&
    Array.isArray(respData?.optionChain?.result?.[0]?.options) &&
    typeof respData?.optionChain?.result?.[0]?.quote === "object" &&
    respData?.optionChain?.error === null
  );
};
