import { ObjRecord } from "../../util/ObjRecord";

export type FinderReqParams = {
  params: {
    // * For traditional Node route path params
  };
  query: {
    symbol: string;
    targetting: string;
    priceFrom?: string;
    priceTo?: string;
    date: string;
    currentPrice: string;
    budgetCost: string;
    budgetExclExp: string;
    sell?: string;
    ivHist: string;
    strategies?: ObjRecord<string>;
    specificExpiry?: string;
    sortBy?: "ror" | "rorAnn" | "pop" | "popXRor";
  };
};
