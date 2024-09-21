import * as Mx from "errable";
import R from "ramda";

import { Map, type Seq } from "immutable";
import moment from "moment-timezone";

import { MESSAGES } from "../../../../../../consts";
import {
  FMT_YYYY_MM_DD,
  FMT_YYYY_MM_DD_HHMM,
  MS_PER_DAY,
} from "../../../../../../consts/DATE_TIME";

import { type t } from "opc-types/lib";
import { type OptionsMontage } from "./types";
import { type Optional } from "opc-types/lib/util/Optional";
import {
  type OptionsChain_typesImm,
  type OptionsChainImm,
} from "opc-types/lib/OptionsChain";

import {
  errorDataFactory,
  errorFactory,
} from "../../../../../infrastructure/errorHanding";
import { extractSingleValue } from "../../../../../../utils/String/strings";

export function validateResponse(
  symb: string,
  month: t.Optional<string>,
  optResult: string
): Promise<t.Outcome<OptionsMontage>> {
  return Promise.resolve(
    extractSingleValue(optResult, /{"Option_Montage_List":(.*?)}}/)
  )
    .then(
      Mx.fromNull(errorDataFactory(MESSAGES.OPTIONS_NOT_FOUND, { code: 2 }))
    )
    .then(
      Mx.withNotErr(
        R.pipe(
          (x: string[]): string => x[0] || "",
          (body: string): string => `{"Option_Montage_List":${body}}}`,
          (_) => JSON.parse(_) as OptionsMontage
        )
      )
    )
    .then(
      Mx.ifNotErr(
        (montage: OptionsMontage): t.Outcome<OptionsMontage> =>
          montage.Option_Montage_List !== undefined
            ? montage
            : errorFactory(MESSAGES.OPTIONS_NOT_FOUND, { code: 2 })
      )
    );
}

const parseOptFloat = (s: Optional<string>) => (s ? parseFloat(s || "") : 0);

export function extractOptionData(
  optResult: OptionsMontage
): t.Outcome<OptionsChainImm> {
  const timeNow = Date.now();
  const nyTimeNow = moment
    .tz(timeNow, "America/New_York")
    .format(FMT_YYYY_MM_DD_HHMM);

  const daylightSavingsAdjustmentFraction = 22 / 24;
  const minValidExpDate =
    nyTimeNow.substr(9, 5) > "16:00"
      ? moment
          .tz(
            timeNow + MS_PER_DAY * daylightSavingsAdjustmentFraction,
            "America/New_York"
          )
          .format(FMT_YYYY_MM_DD)
      : nyTimeNow.substr(0, 8);

  const extractedOptions = optResult.Option_Montage_List.reduce(
    (acc: OptionsChainImm, op) => {
      if (op.security_type !== "option") return acc;

      const expDate = `${op.expiration_date?.substr(
        6,
        4
      )}${op.expiration_date?.substr(0, 2)}${op.expiration_date?.substr(3, 2)}`;

      if (expDate < minValidExpDate) return acc;

      const acc2 =
        acc.get(expDate) === undefined
          ? acc.set(
              expDate,
              Map({ p: Map(), c: Map() }) as OptionsChain_typesImm
            )
          : acc;

      const xf = parseFloat(op.strike_price || "");

      const cpSuffix = [false, true];
      return cpSuffix.reduce((acc3: t.OptionsChain, isX: boolean) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const opType: string = R.pipe(
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          R.always(isX ? op.put_call_codeX : op.put_call_code),
          (code: string) => (<Record<string, string>>{ C: "c", P: "p" })[code]
        )();

        return acc3.setIn([expDate, opType, xf], {
          c: parseOptFloat(isX ? op.netChgX : op.netChg),
          l: parseOptFloat(isX ? op.current_priceX : op.current_price),
          b: parseOptFloat(isX ? op.bidX : op.bid),
          a: parseOptFloat(isX ? op.askX : op.ask),
          iv: parseOptFloat(isX ? op.ivX : op.iv) * 100,
          v: parseOptFloat(isX ? op.volumeX : op.volume),
          i: parseOptFloat(isX ? op.open_interesteX : op.open_intereste),
          g: parseOptFloat(isX ? op.gammaX : op.gamma),
          d: parseOptFloat(isX ? op.deltaX : op.delta),
        });
      }, acc2);
    },
    Map() as OptionsChainImm
  );

  return extractedOptions.size > 0
    ? extractedOptions
    : errorFactory("Could not extract options from retrieved data source");
}

export type Txp = {
  months: string[];
  optionsInfo: t.OptionsChain;
};

export function addEmptyMonths({ optionsInfo, months }: Txp): t.OptionsChain {
  const expDates: Seq<number, string> = optionsInfo
    .keySeq()
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    .map((m: number): string => m.toString());

  return months.reduce(
    (acc: t.OptionsChain, month: string) =>
      expDates.find(
        (foundMonth: string): boolean => foundMonth.substr(0, 6) === month
      ) !== undefined
        ? acc
        : acc.set(parseInt(month, 10).toString(), null),
    optionsInfo
  );
}
