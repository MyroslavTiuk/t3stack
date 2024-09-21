import { type Map } from "immutable";
import { type OptionsChainImm } from "opc-types/lib/OptionsChain";
import { type StockData } from "opc-types/lib/StockData";
import { type Nullable } from "opc-types/lib/util/Nullable";

type MontageItem = {
  security_type?: string;
  expiration_date?: string;
  expiration_month?: string; // is this really here
  strike_price?: string;
  put_call_code?: string;
  put_call_codeX?: string;
  current_price?: string;
  current_priceX?: string;
  netChg?: string;
  netChgX?: string;
  bid?: string;
  bidX?: string;
  ask?: string;
  askX?: string;
  bid_size?: string;
  bid_sizeX?: string;
  ask_size?: string;
  ask_sizeX?: string;
  open?: string;
  openX?: string;
  iv?: string;
  ivX?: string;
  open_intereste?: string;
  open_interesteX?: string;
  volume?: string;
  volumeX?: string;
  delta?: string;
  deltaX?: string;
  gamma?: string;
  gammaX?: string;
  theta?: string;
  thetaX?: string;
  rho?: string;
  rhoX?: string;
  vega?: string;
  vegaX?: string;
  theo?: string;
  theoX?: string;
};

export type OMQuoteDetails = {
  symbol: string;
  security_type: string;
  exchange_id: number;
  current_price: number;
  price_change: number;
  price_change_percent: number;
  bid: number;
  ask: number;
  bid_size: number;
  ask_size: number;
  open: number;
  high: number;
  low: number;
  close: number;
  prev_day_close: number;
  volume: number;
  iv30: number;
  iv30_change: number;
  iv30_change_percent: number;
  seqno: number;
  last_trade_time: string;
  tick: string;
  open_interest: Nullable<number>;
  settlement_price: Nullable<number>;
  settlement_date: Nullable<string>;
};

export type OptionsMontage = {
  Option_Montage_List: Array<MontageItem>;
  exp_Month_List: Array<{ value: string; text: string }>;
  quote_details: OMQuoteDetails;
};

export type postVars = Map<string, string>;

export type DataInfo = {
  optionsInfo: OptionsChainImm;
  stockInfo: StockData;
};
