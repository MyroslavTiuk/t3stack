import { Nullable } from './util/Nullable';

interface StratLegStockValues {
  act: Nullable<'buy' | 'sell'>;
  val: string;
  name: string;
  num: Nullable<number>;
  curPriceUpdated: Nullable<number>;
  curPriceBid: Nullable<number>;
  curPriceAsk: Nullable<number>;
  curPriceLast: Nullable<number>;
  price: Nullable<number>;
  dividendDate?: string;
  dividendAmount?: number; // %
  contractsPerShare?: number; // i.e. 100
}

interface StratLegStockSettings {
  allowPurchase: boolean;
  changeAct: boolean;
  suggestedNumEle?: string[];
  suggestedNum: number[];
}

export interface StratLegStockDef {
  type: 'stock';
  defaults?: Partial<StratLegStockValues>;
  settings?: Partial<StratLegStockSettings>;
}

export interface StratLegStock extends StratLegStockDef, StratLegStockValues {
  defaults: StratLegStockValues;
  settings: StratLegStockSettings;
}

export interface StratLegStockComplete
  extends Omit<StratLegStock, 'curPriceBid' | 'curPriceAsk' | 'curPriceLast'> {
  curPriceBid: number;
  curPriceAsk: number;
  curPriceLast: number;
}
