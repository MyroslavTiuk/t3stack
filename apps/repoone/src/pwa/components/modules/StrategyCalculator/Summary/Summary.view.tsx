import React, { type FC } from "react";

import { type StrategyEstimate } from "opc-types/lib/StrategyEstimate";

import { type Nullable } from "opc-types/lib/util/Nullable";
import type Box from "../../../primitives/Box";

import clx from "../../../../../utils/Html/clx";
import useDependentMemo from "../../../../../utils/Hooks/useDependentMemo";
import isInfinite from "../../../../../utils/Data/isInfinite";

import stratEstToSummaryData from "./utils/stratEstToSummaryData";
import { TdStatPair } from "./TdStatPair";
import css from "./Summary.module.scss";

type SummaryProps = {
  twoCol?: boolean;
  stratEst: Nullable<StrategyEstimate>;
  isCalculating: boolean;
};

const emptyRow = { label: "", val: "" };

const Summary: FC<SummaryProps> = (
  props: SummaryProps
): ReturnType<typeof Box> => {
  const rowData = useDependentMemo(stratEstToSummaryData, [props.stratEst]);
  // const sd1 = React.useMemo(
  //   () =>
  //     props.stratEst?.summary?.prices1SD
  //       ? Object.keys(props.stratEst.summary.prices1SD).map((n) =>
  //           round(parseFloat(n), 2),
  //         )
  //       : ['', ''],
  //   [props.stratEst?.summary],
  // );
  // const sd2 = React.useMemo(
  //   () =>
  //     props.stratEst?.summary?.prices2SD
  //       ? Object.keys(props.stratEst.summary.prices2SD).map((n) =>
  //           round(parseFloat(n), 2),
  //         )
  //       : ['', ''],
  //   [props.stratEst?.summary],
  // );

  return (
    <table
      className={clx([
        css.summary,
        (props.isCalculating || !props.stratEst) && css["--is-calculating"],
      ])}
    >
      <tbody>
        {props.twoCol ? (
          <>
            <tr>
              <TdStatPair {...rowData.entryCost} />
              <TdStatPair {...rowData.maxProfit} />
            </tr>
            <tr>
              <TdStatPair {...rowData.maxRisk} />
              <TdStatPair {...rowData.roiMaxRisk} />
            </tr>
            {rowData.collateral && rowData.roiCollateral && (
              <tr>
                <TdStatPair {...rowData.collateral} />
                <TdStatPair {...rowData.roiCollateral} />
              </tr>
            )}
            {rowData.breakevens.val ? (
              <>
                <tr>
                  <TdStatPair {...rowData.breakevens} valSpansDesc />
                  <TdStatPair {...(rowData.pop || emptyRow)} />
                  {/*<TdStatPair {...emptyRow} />*/}
                </tr>
                {/*{rowData.pop && (*/}
                {/*  <tr>*/}
                {/*    <TdStatPair {...(rowData.pop || emptyRow)} spanTwoCols valSpansDesc />*/}
                {/*  </tr>*/}
                {/*)}*/}
              </>
            ) : (
              rowData.warning && (
                <tr>
                  <TdStatPair {...rowData.warning} spanTwoCols />
                </tr>
              )
            )}
          </>
        ) : (
          <>
            <tr>
              <TdStatPair {...rowData.entryCost} />
            </tr>
            <tr>
              <TdStatPair {...rowData.maxProfit} />
            </tr>
            <tr>
              <TdStatPair {...rowData.maxRisk} />
            </tr>
            {!(
              isInfinite(props?.stratEst?.summary?.maxRisk || Infinity) &&
              props?.stratEst?.summary?.collateral
            ) && (
              <tr>
                <TdStatPair {...rowData.roiMaxRisk} />
              </tr>
            )}
            {rowData.collateral && (
              <tr>
                <TdStatPair {...rowData.collateral} />
              </tr>
            )}
            {rowData.roiCollateral && (
              <tr>
                <TdStatPair {...rowData.roiCollateral} />
              </tr>
            )}
            {rowData.breakevens.val && (
              <tr>
                <TdStatPair
                  {...rowData.breakevens}
                  valSpansDesc={rowData.breakevens.val.length >= 2}
                />
              </tr>
            )}
            {rowData.pop && (
              <tr>
                <TdStatPair {...rowData.pop} />
              </tr>
            )}
            {rowData.warning && (
              <tr>
                <TdStatPair {...rowData.warning} />
              </tr>
            )}
          </>
        )}

        {/* rowData.maxRisk1SD && rowData.maxRisk1SD.val !== rowData.maxRisk.val && (
          <>
            <tr><TdStatPair {...orEmpty(rowData.roiRisk1SD) } /></tr>
            <tr><TdStatPair {...rowData.maxRisk1SD } /></tr>
          </>
        ) */}
        {/* rowData.maxRisk2SD && rowData.maxRisk2SD.val !== rowData.maxRisk.val && (
          <>
            <tr><TdStatPair {...orEmpty(rowData.roiRisk2SD) } /></tr>
            <tr><TdStatPair {...rowData.maxRisk2SD } /></tr>
          </>
        )*/}
        {/*
          {(sd1 || sd2) && (
            <tr>
              <td colSpan={4} className={clx([css['_label'], css['--minor'], css['--text-right']])}>
                { sd1 && `1SD: ${sd1[0]}–${sd1[1]}` }
                { sd1 && sd2 && <TextDivider /> }
                { sd2 && `2SD: ${sd2[0]}–${sd2[1]}` }
              </td>
            </tr>
          )} */}
      </tbody>
    </table>
  );
};

export default React.memo(Summary);
