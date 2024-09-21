import { PriceData } from '../../PriceData';

export type PriceDataResp = PriceData;

export type PriceDataRespWSymb = PriceDataResp & { symbol: string };
