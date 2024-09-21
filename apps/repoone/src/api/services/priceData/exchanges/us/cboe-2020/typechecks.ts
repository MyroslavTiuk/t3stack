export type CboeOption = {
  option: string;
  last_trade_price: number;
  bid: number;
  ask: number;
  volume: number;
  open_interest: number;
  iv?: number;
  theta?: number;
  theo?: number;
  delta?: number;
  gamma?: number;
  vega?: number;
  change?: number;
};

export function checkResponse(x: any): x is { data: NonNullable<unknown> } {
  return typeof x === "object" && typeof x.data === "object";
}

export function checkOptionsArray(x: any): x is { options: any[] } {
  return Array.isArray(x.options);
}

export function checkStockData(
  x: any
): x is { current_price: number; ask: number; bid: number; iv30?: number } {
  return (
    typeof x === "object" &&
    typeof x?.current_price === "number" &&
    typeof x?.ask === "number" &&
    typeof x?.bid === "number"
  );
}

export function checkOption(x: any): x is CboeOption {
  return (
    typeof x === "object" &&
    typeof x?.option === "string" &&
    typeof x?.last_trade_price === "number" &&
    typeof x?.bid === "number" &&
    typeof x?.ask === "number" &&
    typeof x?.volume === "number" &&
    typeof x?.open_interest === "number"
  );
}
