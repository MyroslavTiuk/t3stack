import axios from "axios";
import * as E from "errable";

import { chkYahooResponse } from "./chkYahooResponse";
import { makeUrl, proxyUrl } from "./helpers";

const getMonthOptionsAndExpiries = (symb: string, date?: number) => {
  return axios.get(proxyUrl(makeUrl(symb, date))).then(({ data }) => {
    if (!chkYahooResponse(data)) {
      if (data?.optionChain?.result?.length === 0) {
        return E.err("Symbol not found");
      }
      return E.err("Invalid format");
    }
    return data.optionChain.result[0];
  });
};

export default getMonthOptionsAndExpiries;
