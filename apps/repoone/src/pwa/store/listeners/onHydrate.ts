import { type ReduxListener } from "redux-listeners";
import { err, ifNotErr, ifNotErrAsync } from "errable";
import { type Action } from "redux";
import { reduce } from "ramda";
import axios from "axios";

import { type Strategy, type StrategyComplete } from "opc-types/lib/Strategy";
import { type ObjRecord } from "opc-types/lib/util/ObjRecord";
import { type PriceData } from "opc-types/lib/PriceData";
import { SITE } from "../../../config/Site";
import Interface from "../../../config/Interface";
import convertV2calc from "../../../utils/Data/TransformStrategy/convertV2calc";
import isStrategyComplete from "../../../utils/Finance/isStrategyComplete";
import isCalcCurrentByLegExpiry from "../../../utils/Finance/isCalcCurrentByLegExpiry";

import calculationsActions from "../actions/calculations";
import userSettingsActions from "../actions/userSettings";
import { type Store } from "opc-types/lib/store/Store";
import { ASYNC_STATUS } from "../../../types/enums/ASYNC_STATUS";
import reportClientError from "../../../services/Sentry/reportClientError";
import { PRICE_RESULT } from "../../../types/enums/PRICE_RESULT";
import selectUnderlyingLeg from "../selectors/currentCalculation/selectUnderlyingLeg";

function getPrices(symbs: string[]) {
  return Promise.all(
    symbs.map((symb) =>
      axios
        .get(`${SITE.API_URL}/price/${symb}`)
        .then((r) => ({
          prices: r.data,
          symbol: symb,
        }))
        .catch((e: any) => {
          if (e?.data?.result) {
            return e.data;
          }
          return {
            result: PRICE_RESULT.UNEXPECTED_FORMAT,
            time: Date.now(),
            stock: null,
            options: null,
          };
        })
    )
  ).then(
    reduce(
      (
        symbPriceMap: ObjRecord<PriceData>,
        data: { prices: any; symbol: string }
      ) => {
        if (data.prices?.success) {
          symbPriceMap[data.symbol.toUpperCase()] = data.prices.data;
        }
        return symbPriceMap;
      },
      {} as ObjRecord<PriceData>
    )
  );
}

function getUniqSymbs(v2calcs: unknown) {
  if (!v2calcs || typeof v2calcs !== "object" || v2calcs === null) return [];
  return Object.values(v2calcs).reduce((acc: string[], calc: unknown) => {
    const sym: undefined | string =
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      calc?.vars?.["underlying-symbol"] || undefined;
    if (!sym || acc.includes(sym)) {
      return acc;
    }
    acc.push(sym);
    return acc;
  }, [] as string[]);
}

const FORCE_REFRESH_V2_CALCS = false;

const onHydrateListener: [string, ReduxListener][] = [
  [
    // todo: move this to a utility or hook off of sessionProvider, to be run when auth state is resolved
    //  Store cookie/persistent redux entry that this has been complete
    "persist/REHYDRATE",
    async (dispatch, action: Action & { payload?: Store }) => {
      const storeCalcs = action?.payload?.calculations;
      const storeUserSettings = action?.payload?.userSettings;
      if (
        !FORCE_REFRESH_V2_CALCS &&
        (storeUserSettings?.oldCalcSyncStatus === ASYNC_STATUS.COMPLETE ||
          (storeCalcs && (storeCalcs || []).length > 0))
      ) {
        const calcs = storeCalcs || [];
        const currentCalcs = calcs.filter((c) =>
          isCalcCurrentByLegExpiry(c, undefined)
        );
        if (calcs.length !== currentCalcs.length) {
          const completeCalcs = currentCalcs.filter((calc) =>
            isStrategyComplete(calc)
          );
          dispatch(
            calculationsActions.setAll(completeCalcs as StrategyComplete[])
          );
        }
        return;
      }

      if (!Interface.REHYDRATE_V2_CALCS) {
        dispatch(
          userSettingsActions.setOldCalcSyncStatus(ASYNC_STATUS.COMPLETE)
        );
      } else if (
        FORCE_REFRESH_V2_CALCS ||
        storeUserSettings?.oldCalcSyncStatus !== ASYNC_STATUS.COMPLETE
      ) {
        dispatch(
          userSettingsActions.setOldCalcSyncStatus(ASYNC_STATUS.LOADING)
        );
        axios
          .get(`${SITE.V2_API_URL}/getSessionCalculations?reqId=0`, {
            withCredentials: true,
          })
          .then((resp) => {
            if (resp.status === 200 && resp?.data?.calculations) {
              return resp.data.calculations;
            }
            return err("Bad format");
          })
          .then(
            ifNotErrAsync(async (v2calcs) => ({
              prices: await getPrices(getUniqSymbs(v2calcs)),
              v2calcs,
            }))
          )
          .then(
            ifNotErr((dto) =>
              Object.values(dto.v2calcs)
                .map((v2calc: unknown) => convertV2calc(v2calc, dto.prices))
                .map((newCalc) =>
                  !dto.prices[selectUnderlyingLeg(newCalc)?.val || ""]
                    ? null
                    : newCalc
                )
            )
          )
          .then(
            ifNotErr((v3calcsMb) => {
              const v3calcsA = Object.values(v3calcsMb).filter(
                (s) => !!s
              ) as Strategy[];

              const v3calcsComplete = v3calcsA.filter((s: Strategy) =>
                isStrategyComplete(s)
              ) as StrategyComplete[];
              if (!v3calcsComplete) return;

              dispatch(
                userSettingsActions.setOldCalcSyncStatus(ASYNC_STATUS.COMPLETE)
              );
              // const currentV3calcs = v3calcsComplete.filter((c) =>
              //   isCalcCurrentByLegExpiry(c, undefined),
              // );
              dispatch(calculationsActions.appendAll(v3calcsComplete));
            })
          )
          .catch((e) => {
            reportClientError({
              id: "import_v2_calcs",
              data: e,
            });
            dispatch(
              userSettingsActions.setOldCalcSyncStatus(ASYNC_STATUS.ERROR)
            );
          });
      }
    },
  ],
];

export default onHydrateListener;
