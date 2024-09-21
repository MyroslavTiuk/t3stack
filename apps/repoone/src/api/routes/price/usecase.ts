import * as R from "ramda";
import * as Mx from "errable";
import { type t } from "opc-types/lib";
import ENV from "../../../config/Env";
import EXCHANGES from "../../../config/Exchanges";
import { normaliseSymbol } from "../../../utils/Finance/market/market";
import { getPriceData } from "../../services/priceData";
import { type PriceDataResp } from "opc-types/lib/api/responses/PriceDataResp";
// import backgroundUpdate from './backgroundUpdate';
import { cacher, cacherRead, cacherSave } from "../../services/cacher/cacher";
import buildCacherOpts from "./buildCacherOpts";
import { type DTO } from "./types";
import l from "../../../services/logger";

function makeCacheKey({
  fullSymbol,
  month,
}: {
  fullSymbol: string;
  month: t.Optional<string>;
}): string {
  return `getPriceRoute_backgroundUpdate_${fullSymbol}${Mx.ifErr(
    R.always(""),
    month
  )}`;
}

function isUpdateLocked({
  fullSymbol,
  month,
}: {
  fullSymbol: string;
  month: t.Optional<string>;
}): Promise<boolean> {
  const updateCacheKey = makeCacheKey({ fullSymbol, month });
  return cacherRead<t.Optional<boolean>, []>({ key: updateCacheKey }).then(
    Mx.cata(
      (v: t.Optional<boolean>) => Boolean(v),
      (_e: t.ErrorData) => false
    )
  );
}

function lockUpdate({
  fullSymbol,
  month,
}: {
  fullSymbol: string;
  month: t.Optional<string>;
}): Promise<t.Outcome<boolean>> {
  const updateCacheKey = makeCacheKey({ fullSymbol, month });
  return cacherSave(
    {
      key: updateCacheKey,
      time: EXCHANGES.TTL_PRICE_DATA,
    },
    true
  )
    .then(Mx.isVal)
    .catch(R.always(false));
}

function unlockUpdate({
  fullSymbol,
  month,
}: {
  fullSymbol: string;
  month: t.Optional<string>;
}): Promise<t.Outcome<boolean>> {
  const updateCacheKey = makeCacheKey({ fullSymbol, month });
  return cacherSave(
    {
      key: updateCacheKey,
      time: 1,
    },
    false
  )
    .then(Mx.isVal)
    .catch(R.always(false));
}

// function closeToDataExpiry(expiry: number): boolean {
//   return (Date.now() / 1000) < expiry - (60 * (EXCHANGES.TTL_PRICE_DATA_MAX * 0.5));
// }

const getPriceUsecase = async (dto: DTO): Promise<t.Outcome<PriceDataResp>> => {
  // /!\ Temp: better to return sample data-source response to use latest post-processed format
  if (ENV.TEST_OFFLINE) {
    l.warn("Returning sample data");
    const sample = (await import("./sample-resp.json")).default.data;
    return sample as PriceDataResp;
  }

  const fullSymbol: string = normaliseSymbol(dto.symbol);
  const force = Boolean(dto.force);
  const month: t.Optional<string> = undefined;

  // const check = await getPriceData(fullSymbol, month, 0);
  //
  // console.log(check);

  const updateIsLocked: boolean = await (force
    ? isUpdateLocked({ fullSymbol, month })
    : false);

  const forceUpdate = force && !updateIsLocked;

  if (forceUpdate) await lockUpdate({ fullSymbol, month });

  const getPriceDataResult = await cacher(
    buildCacherOpts({
      fullSymbol,
      month,
      shouldUse: () => !forceUpdate,
      onSave: (_v) => {
        if (forceUpdate) {
          unlockUpdate({ fullSymbol, month }).catch(R.always(null));
        }
      },
    }),
    getPriceData
  );

  return Mx.ifNotErr((priceDataResult) => {
    // do something with expiry if needs updating
    return priceDataResult?.result;
  }, getPriceDataResult);

  // todo: enable background fetching again
  // if (!force) {
  //   Mx.ifNotErrAsync((priceDataVal) => {
  //     if (closeToDataExpiry(priceDataVal.expiry)) {
  //       return Promise.resolve(false);
  //     }
  //     return backgroundUpdate(fullSymbol, Date.now())
  //       .catch(R.always(false));
  //   }, priceData)
  //     .catch(R.always(null));
  // }
};

export default getPriceUsecase;
