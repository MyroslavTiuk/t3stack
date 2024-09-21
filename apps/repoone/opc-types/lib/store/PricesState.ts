import { PriceData } from '../PriceData';
import { AsyncData } from './AsyncData';

export type PricesState = AsyncData<Record<string, PriceData>>;
