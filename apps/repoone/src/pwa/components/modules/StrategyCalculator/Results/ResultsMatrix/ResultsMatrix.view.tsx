import { lensProp, pipe, set } from "ramda";
import React, { type FC } from "react";
import { isNull } from "errable";

import { type ObjRecord } from "opc-types/lib/util/ObjRecord";
import { type StrategyEstimate } from "opc-types/lib/StrategyEstimate";
import { type PositionPair } from "opc-types/lib/PositionPair";
import { type StrategyComplete } from "opc-types/lib/Strategy";
import { type StratLegStock } from "opc-types/lib/StratLegStock";
import { type Nullable } from "opc-types/lib/util/Nullable";

import DISPLAY_VALUE_TYPES from "../../../../../../consts/DISPLAY_VALUE_TYPES";
import { MM_TO_MMM } from "../../../../../../utils/String/DateFormat/DateFormat";
import clx from "../../../../../../utils/Html/clx";
import formatPrice from "../../../../../../utils/String/formatPrice/formatPrice";
import xor from "../../../../../../utils/Data/xor/xor";
import isLast from "../../../../../../utils/Data/isLast/isLast";
import getBestStockPrice from "../../../../../../utils/Finance/getBestStockPrice";
import round from "../../../../../../utils/Data/round/round";
import currentNewYorkYMD from "../../../../../../utils/Time/currentNewYorkYMD";
import getLegsAtStrike from "../../../../../../utils/Finance/getLegsAtStrike";
import selectUnderlyingLeg from "../../../../../store/selectors/currentCalculation/selectUnderlyingLeg";
// import filterOptionLegs from "../../../../../store/selectors/currentCalculation/filterOptionLegs";
// import legsWithIds from "../../../../../store/selectors/currentCalculation/legsWithIds";
import Box from "../../../../primitives/Box";
import T from "../../../../primitives/Typo";
import Spinner from "../../../../primitives/Spinner";
import LegIndicator from "../../../../primitives/LegIndicator/LegIndicator.view";

import { ValueRowCols as renderValueRowCols } from "./ValueRowCols";
import css from "./ResultsMatrix.module.scss";
import calcMaxMinVisibleVals from "./helpers/calcMaxMinVisibleVals";
import { type MATRIX_YAXIS_TYPES } from "../../../../../../types/enums/MATRIX_YAXIS_TYPES";
import RightYAxisOption from "./RightYAxisOption";
import renderYAxisValue from "./helpers/renderYAxisValue";

const DateHeaderMonth = (props: { dates: string[]; today: string }) => {
  return (
    <>
      {pipe(
        () =>
          props.dates.reduce(
            (acc, date) =>
              set(
                lensProp(date.substr(0, 6)),
                (acc[date.substr(0, 6)] || 0) + 1,
                acc
              ),
            {} as Record<string, number>
          ),
        (dateMoCt) =>
          Object.keys(dateMoCt).map((mo, i, mos) => {
            const hasPassed = props.today.substr(0, 6) > mo;
            // If Exp column is the first date col of a month, don't render month name
            return isLast(mos, i) && dateMoCt[mo] === 1 ? null : (
              <th
                key={mo}
                colSpan={isLast(mos, i) ? dateMoCt[mo] - 1 : dateMoCt[mo]}
                className={clx([
                  i === 0
                    ? css.cellTHDateFirst
                    : isLast(mos, i)
                    ? css.cellTHDateLast
                    : undefined,
                  css.cellTHDateMonth,
                  hasPassed && css["--has-passed"],
                ])}
              >
                <T content-detail anemic>
                  {MM_TO_MMM[mo.substr(4, 2)]}
                </T>
              </th>
            );
          }),
        Object.values
      )()}
      <th className={css.cellTHDateAboveExp}>&nbsp;</th>
    </>
  );
};

const DateHeaderDays = (props: { dates: string[]; today: string }) => {
  return (
    <>
      {props.dates.map((date, i) => {
        const hasPassed = props.today > date;
        const isExp = isLast(props.dates, i);
        return (
          <td
            key={date}
            className={clx([
              css.cellTHDateDay,
              isExp && css["--is-last-day"],
              hasPassed && !isExp && css["--has-passed"],
            ])}
          >
            <T
              content-detail={!isExp}
              content-tag={isExp}
              anemic={isExp || hasPassed}
              className={isExp ? css._text : undefined}
            >
              {isExp ? "Exp" : parseInt(date.substr(6, 2), 10)}
            </T>
          </td>
        );
      })}
    </>
  );
};

export interface ResultsMatrixProps {
  className?: string;
  currentCalc: StrategyComplete;
  stratEst: StrategyEstimate;
  isBuffering: boolean;
  showPositionDetail: (pair: PositionPair) => void;
  setSecondaryYAxisType: (val: MATRIX_YAXIS_TYPES) => void;
}

export function getScale(currentCalc: StrategyComplete) {
  return (
    100 *
    (currentCalc.legs.reduce((minNum: null | number, legId) => {
      const { num } = currentCalc.legsById[legId];
      return num !== null && (minNum === null || num < minNum)
        ? currentCalc.legsById[legId].num
        : minNum;
    }, null) || 1)
  );
}

const getRelativePosition = (
  step: number,
  range: [number, number],
  legStrike: number
) => {
  const lowNum = range[0] - step / 2;
  const highNum = range[1] + step / 2;
  const percPos = 100 - (100 * (legStrike - lowNum)) / (highNum - lowNum);
  return percPos > 100 || percPos < 0 ? null : percPos;
};

const renderCurLegsIndicators = (
  stratEst: StrategyEstimate,
  currentCalc: StrategyComplete
) => {
  const theoStrikes = Object.keys(stratEst.theoPoints)
    .map(parseFloat)
    .sort((a, b) => a - b);
  if (theoStrikes.length < 2) return null;
  const range = [theoStrikes[0], theoStrikes[theoStrikes.length - 1]] as [
    number,
    number
  ];
  const step = round(theoStrikes[1] - theoStrikes[0], 2);
  // const opLegs = legsWithIds(filterOptionLegs(currentCalc));
  const legsAtStrikes = getLegsAtStrike(currentCalc.legsById);

  return Object.keys(legsAtStrikes).map((stk) => {
    const legsAtStk = legsAtStrikes[stk];
    const legAtStkType = (legsAtStk || []).reduce((acc, leg) => {
      if (
        acc === "both" ||
        (leg[1] === "put" && acc === "call") ||
        (leg[1] === "call" && acc === "put")
      )
        return "both";
      return leg[1];
    }, null as Nullable<"put" | "call" | "both">);
    const legAtStkAct = (legsAtStk || []).reduce((acc, leg) => {
      if (
        acc === "both" ||
        (leg[0] === "buy" && acc === "sell") ||
        (leg[0] === "sell" && acc === "buy")
      )
        return "both";
      return leg[0];
    }, null as Nullable<"buy" | "sell" | "both">);
    const relativePosition = getRelativePosition(step, range, parseFloat(stk));
    if (isNull(relativePosition)) return null;
    // if (currentCalc.stage ) {
    // }
    return (
      <Box
        className={css._indicator}
        key={stk}
        style={{ top: `${relativePosition}%` }}
      >
        <LegIndicator
          opType={legAtStkType}
          act={legAtStkAct}
          vertically-center
          // @ts-ignore
          letter={currentCalc.stage ? currentCalc.stage : undefined}
        />
      </Box>
    );
  });
};

const getRowIncs = (theoPrices: number[]) => {
  const incs = theoPrices.reduce((acc, tp, i) => {
    if (i === 0) return acc;
    const tInc = round(theoPrices[i - 1] - tp, 2);
    acc[tInc] = (acc[tInc] || 0) + 1;
    return acc;
  }, {} as ObjRecord<number>);
  const sortedIncs = Object.entries(incs)
    .sort((a, b) => (b[1] || 0) - (a[1] || 0))
    .slice(0, 2)
    .filter((pair) => (pair[1] || 0) >= 4)
    .map((pair) => parseFloat(pair[0]));
  return sortedIncs;
};

const ResultsMatrix: FC<ResultsMatrixProps> = (
  props: ResultsMatrixProps
): ReturnType<typeof Box> => {
  const displayType =
    props.currentCalc?.displayValueType || DISPLAY_VALUE_TYPES.ROI_MAX_RISK;
  const curPrice =
    getBestStockPrice(
      props.currentCalc?.legsById[
        props.currentCalc.underlyingElement
      ] as StratLegStock
    ) || 0;
  const theoPrices = React.useMemo(
    () =>
      Object.keys(props.stratEst.theoPoints)
        .map(parseFloat)
        .sort((a, b) => b - a),
    [props.stratEst.theoPoints]
  );
  const priceUseDecimal = !!React.useMemo(
    () => theoPrices.find((stk) => stk !== Math.round(stk)),
    [theoPrices]
  );

  const dates = React.useMemo(
    () => Object.keys(props.stratEst?.theoPoints?.[theoPrices[0]] || {}),
    [props.stratEst]
  );
  const scaleForDispValStratValue = getScale(props.currentCalc);
  const itmGtCurPrice = false;
  const maxMinVisibleVals = calcMaxMinVisibleVals(
    displayType,
    scaleForDispValStratValue,
    props
  );
  const today = currentNewYorkYMD();

  const symb = React.useMemo(
    () => selectUnderlyingLeg(props.currentCalc)?.val,
    [props.currentCalc]
  );

  const cpIncs1 = getRowIncs(theoPrices).map((x) => Math.round(x * 100));
  const cpIncs =
    cpIncs1.includes(33) && cpIncs1.includes(34) ? [100 / 3] : cpIncs1;
  const cMatrixMaxPrice = Math.round(theoPrices[0] * 100);
  return (
    <Box className={[css.container, props.className]}>
      {props.isBuffering && (
        <Box flex className={["--center", css.buffering]}>
          <Spinner />
        </Box>
      )}
      <Box flex className={["flex-col lg:flex-row"]}>
        <table className={css.table}>
          <thead>
            <tr>
              <th rowSpan={2} className={css.cellBlank}>
                &nbsp;
              </th>
              <th rowSpan={2} className={css.cellAxisTL}>
                {symb}
              </th>
              <DateHeaderMonth dates={dates} today={today} />
              <th rowSpan={2} className={css.cellAxisTR}>
                <RightYAxisOption
                  selectedType={props.currentCalc.matrixSecondaryYAxisType}
                  onChange={props.setSecondaryYAxisType}
                />
              </th>
            </tr>
            <tr>
              <DateHeaderDays dates={dates} today={today} />
            </tr>
          </thead>
          <tbody>
            {theoPrices.map((price, i) => {
              const cPrice = Math.round(price * 100);
              // Note: This skips additional theoPrice points which were added because they were strikes or
              //  other inflection points.  They are skipped because it messes up the y-scale (and legindicators)
              const mods = cpIncs.map((cpInc) => {
                const rm = Math.round(cMatrixMaxPrice - cPrice) % cpInc;
                if (rm <= 1 || cpInc - rm <= 1) return 0;
              });
              if (i > 0 && !mods.includes(0)) {
                return null;
              }
              const isITM = xor(price <= curPrice, itmGtCurPrice);
              const rowClasses = [
                isITM ? css["--is-itm"] : undefined,
                i === 0 ? css["--is-first"] : undefined,
                i === theoPrices.length - 1 ? css["--is-last"] : undefined,
              ];
              return (
                <tr key={price} className={clx(rowClasses)}>
                  {i === 0 && (
                    <td className={css.cellCurLegs} rowSpan={theoPrices.length}>
                      {renderCurLegsIndicators(
                        props.stratEst,
                        props.currentCalc
                      )}
                    </td>
                  )}
                  <td className={css.cellTHStk}>
                    <T content-detail>
                      {formatPrice(price, {
                        hideDollar: true,
                        forceShowCents: priceUseDecimal,
                      })}
                    </T>
                  </td>
                  {renderValueRowCols({
                    // key: price,
                    initPos: props.stratEst.initial,
                    theoValues: props.stratEst.theoPoints[price],
                    displayType,
                    summary: props.stratEst.summary,
                    strategyScale: scaleForDispValStratValue,
                    strike: price,
                    showPositionDetail: props.showPositionDetail,
                    maxMinVisibleVals,
                    today,
                  })}
                  <td className={css.cellTHStk}>
                    <T content-detail>
                      {renderYAxisValue({
                        price,
                        curPrice,
                        priceUseDecimal,
                        currentCalc: props.currentCalc,
                        type: props.currentCalc.matrixSecondaryYAxisType,
                      })}
                    </T>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <Box className={css.scrollSpacer} />
      </Box>
    </Box>
  );
};

export default React.memo(ResultsMatrix);
