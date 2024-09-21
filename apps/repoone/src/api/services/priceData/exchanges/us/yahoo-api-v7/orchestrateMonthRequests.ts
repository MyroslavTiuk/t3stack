import * as E from "errable";

import { type YahooDataResult } from "./types";
import getMonthOptionsAndExpiries from "./getMonthOptionsAndExpiries";

type ErrOrColl<Er> = E.Errable<Er[], never> | any[];
// This is a bit loose, as in Error state, the Errable.data accumulates both the errors of type Er, as well
//  as the success types (which are still any)
function E_all<D extends any[], Er>(
  errables: E.Errable<Er, any>[]
): E.Errable<any[], D> {
  // @ts-ignore
  return (
    (errables.reduce(
      (
        acc: undefined | ErrOrColl<Er>,
        errable: E.Errable<Er, any>
      ): ErrOrColl<Er> => {
        if (E.isUndefined(acc)) {
          if (E.isErr(errable)) {
            return new E.Err(errable.message, [errable.data as Er]);
          }
          return [errable] as D;
        }
        if (E.isErr(acc)) {
          if (E.isErr(errable)) {
            return new E.Err(
              `${acc.message}; ${errable.message}`,
              acc.data.concat([errable.data] as Er[])
            );
          }
          return new E.Err(
            acc.message,
            // `${acc.message}; [OK]`,
            acc.data.concat([errable.data] as Er[])
          );
        }
        if (E.isErr(errable)) {
          return new E.Err(errable.message, acc.concat([errable.data] as Er[]));
        }
        return acc.concat([errable]) as D;
      },
      undefined as undefined | ErrOrColl<Er>
    ) as unknown as E.Errable<any[], D>) || []
  );
}

export const orchestrateMonthRequests = async (
  symb: string,
  dataResult: YahooDataResult
) => {
  const curMo = E.fromFalsey(
    "No current expiration date",
    dataResult.options[0]?.expirationDate
  );
  const allMo = E.fromFalsey(
    "No expiration dates",
    !!dataResult.expirationDates.length && dataResult.expirationDates
  );

  const dates = E_all<[number, number[]], string>([curMo, allMo]);

  const data = Promise.resolve(dates)
    .then(
      E.ifNotErrAsync(([curDate, allDates]) => {
        return Promise.all(
          allDates
            .filter((futureDate) => futureDate !== curDate)
            .map((futureDate) => getMonthOptionsAndExpiries(symb, futureDate))
        );
      })
    )
    .then(
      E.ifNotErr((x) => {
        return E_all<YahooDataResult[], any>(x);
      })
    )
    .then(
      E.ifNotErr((futureResults) => ({
        ...dataResult,
        options: [
          dataResult.options[0],
          ...futureResults.map((futureResult) => futureResult.options[0]),
        ],
      }))
    );

  return data;
};
