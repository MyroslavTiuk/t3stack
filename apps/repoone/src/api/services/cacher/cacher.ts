import md5 from "md5";
import ENV from "../../../config/Env";
import * as Mx from "errable";
import { MESSAGES } from "../../../consts";
import { fill } from "~/utils/Data/dataTransform/dataTransform";
import {
  catchErrors,
  errorFactory,
  errorDataFactory,
} from "../../infrastructure/errorHanding";
import NodeCacher from "./NodeCacher";
import { type t } from "opc-types/lib";

type cacherParamsFilled<R, Args extends any[]> = t.CacherParams<Args> & {
  args: Args;
  shouldUse: (...args: Args) => boolean;
  shouldSave: (result: R, args?: Args) => boolean;
};

export async function cacher<R, A extends any[]>(
  _params: t.CacherParams<A>,
  fn: ((...args: A) => Promise<t.Outcome<R>>) | ((...args: A) => t.Outcome<R>),
  injectCacheBridge?: t.CacherBridge
): Promise<t.Outcome<R>> {
  const usedCacheBridge = injectCacheBridge || NodeCacher;
  const params = fill(_params, {
    args: [],
    shouldUse: () => true,

    shouldSave: (_: R) => true,
  }) as cacherParamsFilled<R, A>;
  const keyWArgs: string = await (params.key +
    ((params.args || []).length ? "@" + md5(JSON.stringify(params.args)) : ""));

  return (
    Promise.resolve(
      Mx.fromFalsey(
        errorDataFactory(MESSAGES.CACHE_NOT_ENABLED),
        ENV.GLOBAL_CACHE && params.shouldUse.apply(undefined, params.args)
      )
    )
      .then(
        Mx.ifNotErrAsync(async (_) => {
          return await usedCacheBridge.read<R>(keyWArgs);
        })
      )
      .then(
        Mx.ifNotErr((val: R | undefined) =>
          val !== undefined ? val : errorFactory(MESSAGES.CACHE_KEY_EMPTY)
        )
      )
      // "Err" state -> execute the function
      .then(
        Mx.ifErrAsync<t.ErrorData, R, t.ErrorData>(
          (_: t.ErrorData): Promise<t.Outcome<R>> => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return Promise.resolve<t.Outcome<R>>(fn(...params.args)).then(
              Mx.ifNotErr<t.ErrorData, R, R>((resultVal: R) => {
                if (params.shouldSave(resultVal, params.args)) {
                  const expiryTime: number =
                    params.expiry ||
                    Date.now() / 1000 + 60 * (params.time || 0);
                  usedCacheBridge
                    .save(keyWArgs, expiryTime, resultVal)
                    .catch(catchErrors("Unexpected error saving cache"));
                }
                return resultVal;
              })
            );
          }
        )
      )
      .catch(catchErrors("Unexpected error in cacher"))
  );
}

export const cacherSave = <T, A extends any[]>(
  _params: t.CacherParams<A>,
  value: T
) => {
  const params = fill(_params, {
    shouldUse: () => false,
  }) as cacherParamsFilled<T, A>;
  return cacher<T, A>(params, () => value);
};

export const cacherRead = async <T, A extends any[]>(
  _params: t.CacherParams<A>
) => {
  const params = fill(_params, {
    shouldSave: () => false,
  }) as cacherParamsFilled<T, A>;
  return cacher<t.Optional<T>, A>(params, (): undefined => undefined);
};
