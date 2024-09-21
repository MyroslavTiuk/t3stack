import { pipe, reduce, groupBy, mapObjIndexed } from "ramda";

import {
  type StrategyOverview,
  type StrategyOverviewWithCalculation,
} from "opc-types/lib/StrategyOverview";
import { isUndefined } from "errable";
import { type ObjRecord } from "opc-types/lib/util/ObjRecord";

function addKeys<T>(arr: T[]): [T, number][] {
  return arr.map((item, i) => [item, i]);
}
export type GroupedStrategiesWithCalculation = ObjRecord<
  StrategyOverviewWithCalculation[][]
>;

function groupCalcs<C extends StrategyOverview>(
  calcs: C[],
  maxRows?: number
): ObjRecord<C[][]> {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return pipe(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    groupBy((calc: C) => calc.symbol),
    mapObjIndexed((symbCalcs: C[], _: string) =>
      isUndefined(maxRows)
        ? // * Single column
          symbCalcs.map((x) => [x])
        : pipe(
            () => addKeys(symbCalcs),
            reduce((cols, [calc, i]: [C, number]) => {
              cols[i % maxRows] = (cols[i % maxRows] || ([] as C[])).concat([
                calc,
              ]);
              return cols;
            }, [] as C[][])
          )()
    ),
    (grouped) =>
      pipe(
        () => Object.keys(grouped).sort(),
        (sortedSymbs) =>
          sortedSymbs.map((sortedSymb) => [sortedSymb, grouped[sortedSymb]]),
        Object.fromEntries
      )()
  )(calcs);
}

export default groupCalcs;
