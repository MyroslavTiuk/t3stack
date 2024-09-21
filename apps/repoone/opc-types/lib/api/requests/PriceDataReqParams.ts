import { Optional } from '../../util/Optional';

export type PriceDataReqParams = {
  params: {
    // * For traditional Node route path params
    symbol?: string;
    month: Optional<string>;
  };
  query: {
    // * For NextJS auto-routing pages/api
    symbol: string;
    force: Optional<number>;
  };
};
