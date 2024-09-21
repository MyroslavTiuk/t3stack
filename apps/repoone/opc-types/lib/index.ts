import { Optional as OptionalType } from 'errable';

import { CacherBridge as CacherBridgeType } from './api/CacherBridge';
import { CacherParams as cacherParamsType } from './api/CacherParams';
import { constMap as constMapType } from './constMap';
import { Outcome as OutcomeType } from './Outcome';

import { ErrorData as ErrorDataType } from './api/ErrorData';

import { PriceData as PriceDataType } from './PriceData';
import { OptionData as OptionDataType } from './OptionData';
import { OptionsChainImm as OptionsChainType } from './OptionsChain';
import { StockData as StockDataType } from './StockData';

// tslint:disable-next-line:no-namespace
export namespace t {
  export type CacherBridge = CacherBridgeType;
  export type CacherParams<A extends any[]> = cacherParamsType<A>;
  export type constMap = constMapType;
  export type ErrorData = ErrorDataType;
  export type OptionsChain = OptionsChainType;
  export type PriceData = PriceDataType;
  export type StockData = StockDataType;
  export type Outcome<T> = OutcomeType<T>;
  export type Optional<T> = OptionalType<T>;
}
