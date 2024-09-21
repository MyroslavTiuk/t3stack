import { pipe, map, identity, reverse, isNil, negate } from "ramda";

import { type Nullable } from "opc-types/lib/util/Nullable";
import round from "../../../../../../utils/Data/round/round";
import type * as RCSlider from "react-compound-slider";

interface Params {
  range: [Nullable<number>, Nullable<number>];
  val: Nullable<number>;
  reverse?: boolean;
  onUpdate?: (newVal: any) => void;
  onChange: (newVal: any) => void;
  showMinus?: true;
  showTag?: boolean;
}

const half = (range: Params["range"]) =>
  round((range[0] || 0) + ((range[1] || 0) - (range[0] || 0)) / 2, 2);

export function usePriceSliderProps(params: Params) {
  const usedRange = (
    params.range[0] || params.range[1] ? params.range : [0, 0]
  ) as [number, number];
  const reverseSeq = params.reverse;
  return {
    showMinus: params.showMinus || false,
    mode: 1 as RCSlider.SliderProps["mode"],
    step: 0.01,
    values: [
      isNil(params.val)
        ? half(usedRange)
        : !reverseSeq
        ? params.val
        : negate(params.val),
    ],
    domain: pipe(
      () => usedRange,
      (x) => (!reverseSeq ? identity(x) : map(negate, x)),
      <(ps: number[]) => number[]>(!reverseSeq ? identity : reverse)
    )(),
    ticksContainerProps: {
      values: pipe(
        () => [usedRange[0], half(usedRange), usedRange[1]],
        !reverseSeq ? identity : map(negate)
      )(),
    },
    onUpdate: (v: number) => {
      const normalisedV = !reverseSeq ? v : negate(v);
      !isNil(v) && params.onUpdate?.(normalisedV.toString());
    },
    onChange: (v: number) => {
      const normalisedV = !reverseSeq ? v : negate(v);
      !isNil(v) && params.onChange?.(normalisedV.toString());
    },
    reverse: params.reverse,
    showTag: params.showTag,
  };
}
