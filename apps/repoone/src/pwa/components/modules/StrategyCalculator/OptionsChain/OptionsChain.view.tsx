import React, { type FC, useContext } from "react";
import { ifVal, isUndefined } from "errable";
import { flatten, isNil } from "ramda";

import { type OptionData } from "opc-types/lib/OptionData";
import { type OptionsChain_types } from "opc-types/lib/OptionsChain";
import { type Strategy } from "opc-types/lib/Strategy";
import { type StratLegOpt } from "opc-types/lib/StratLegOpt";
import { type Nullable } from "opc-types/lib/util/Nullable";
import { type Optional } from "opc-types/lib/util/Optional";

import { TIME_DECAY_BASIS } from "../../../../../types/enums/TIME_DECAY_BASIS";

import Box from "../../../primitives/Box";
import Icon from "../../../primitives/Icon";
import LegIndicator from "../../../primitives/LegIndicator/LegIndicator.view";
import TextDivider from "../../../primitives/TextDivider";
import T from "../../../primitives/Typo";
import ModalContainer from "../../../primitives/Modal/ModalContainer";
import Spinner from "../../../primitives/Spinner";
import round from "../../../../../utils/Data/round/round";
// import { matchPrice } from "../../../../../utils/Finance/matchPrice";
import useMediaQuery from "../../../../../utils/Hooks/useMediaQuery";
import clx from "../../../../../utils/Html/clx";
import { codeToExp } from "../../../../../utils/String/DateFormat/DateFormat";
// import opTypeKey from "../../../../../utils/String/opTypeKey/opTypeKey";
import filterOptionLegs from "../../../../store/selectors/currentCalculation/filterOptionLegs";
import legsWithIds from "../../../../store/selectors/currentCalculation/legsWithIds";
import timeTilExpiry from "../../../../../utils/Time/timeTilExpiry";
import { FINANCE } from "../../../../../config/Finance";
import nbsp from "../../../../../utils/Html/nbsp";
// import calcMid from "../../../../../utils/Finance/calcMid";
import formatPercent from "../../../../../utils/String/formatPercent/formatPercent";

import getFirstExp from "./utils/getFirstExp";
import getStrikesFromChain from "./utils/getStrikesFromChain";
import ExpirySelector from "./ExpirySelector";
import css from "./OptionsChain.module.scss";
import { type OptionsChainProps } from "./OptionsChain.props";
import { CHAIN_COLUMN_CHOICE } from "../../../../../types/enums/CHAIN_COLUMN_CHOICES";
import { NewSavedCalcsContext } from "../NewSavedCalculations/NewSavedCalculationsContext";
import { INPUT_METHODS } from "opc-types/lib/INPUT_METHODS";
import useSelectorSafe from "~/pwa/store/selectors/useSelectorSafe";
import { MultiStrikeCalculation } from "../../../../../../opc-types/lib/store/CurrentCalculationState";

const formatPriceInt = (x: number) => x.toFixed(0);
const formatPrice = (x: number) => x.toFixed(2); // makeFormatPrice({ forceShowCents: true, hideDollar: true });

const renderChainCell = ({
  op,
  ...props
}: {
  headingCode: string;
  op: Optional<OptionData>;
  first: boolean;
  last: boolean;
  put?: boolean;
  call?: boolean;
  onSelectOption: (
    type: "put" | "call",
    strike: number,
    price: number,
    iv: number
  ) => void;
  strike: number;
  guides: StratLegOpt;
}) => {
  const xcls = flatten([
    props.first ? css["--first"] : [],
    props.last ? css["--last"] : [],
    props.put ? css["--type-put"] : [],
    props.call ? css["--type-call"] : [],
    css[`--code-${props.headingCode}`],
  ]) as string[];
  const clsDataRight = clx([css["_cell-data"], "align-right", ...xcls]);
  const recommendedSide =
    !props.guides?.opType ||
    (props.guides?.opType === "put" && props.put) ||
    (props.guides?.opType === "call" && props.call);

  if (!op) {
    return (
      <td className={clx([css["_cell-data"], "align-center", ...xcls])}>-</td>
    );
  }

  switch (props.headingCode) {
    // todo: these will change format and have actions, some may be duplicate but keeps expressiveness
    case "l":
      return (
        <td
          key="l"
          className={clx([clsDataRight, !!op.l && css["--is-clickable-cell"]])}
          onClick={() =>
            op.l &&
            props.onSelectOption(
              props.call ? "call" : "put",
              props.strike,
              op.l,
              op.iv
            )
          }
        >
          {!op.l ? "-" : formatPrice(op.l)}
        </td>
      );
    case "b":
      return (
        <td
          key="b"
          className={clx([
            clsDataRight,
            !!op.b && css["--is-clickable-cell"],
            recommendedSide &&
              props.guides?.act !== "buy" &&
              css["--is-recommended"],
            recommendedSide &&
              props.guides?.act === "buy" &&
              css["--is-discouraged"],
          ])}
          onClick={() =>
            op.b &&
            props.onSelectOption(
              props.call ? "call" : "put",
              props.strike,
              op.b,
              op.iv
            )
          }
        >
          <span className={css._text}>{!op.b ? "-" : formatPrice(op.b)}</span>
        </td>
      );
    case "m":
      return (
        <td
          key="m"
          className={clx([
            clsDataRight,
            !!op.b && !!op.a && css["--is-clickable-cell"],
            recommendedSide && css["--is-recommended"],
          ])}
          onClick={() =>
            op.b &&
            op.a &&
            props.onSelectOption(
              props.call ? "call" : "put",
              props.strike,
              round((op.b + op.a) / 2, 2),
              op.iv
            )
          }
        >
          <span className={css._text}>
            {!op.b || !op.a ? "-" : formatPrice((op.b + op.a) / 2)}
          </span>
        </td>
      );
    case "a":
      return (
        <td
          key="a"
          className={clx([
            clsDataRight,
            !!op.a && css["--is-clickable-cell"],
            recommendedSide &&
              props.guides?.act !== "sell" &&
              css["--is-recommended"],
            recommendedSide &&
              props.guides?.act === "sell" &&
              css["--is-discouraged"],
          ])}
          onClick={() =>
            op.a &&
            props.onSelectOption(
              props.call ? "call" : "put",
              props.strike,
              op.a,
              op.iv
            )
          }
        >
          <span className={css._text}>{!op.a ? "-" : formatPrice(op.a)}</span>
        </td>
      );
    case "i":
      return (
        <td key="i" className={clsDataRight}>
          {isNil(op.i) ? "-" : op.i}
        </td>
      );
    case "iv":
      return (
        <td key={"iv"} className={clsDataRight}>
          {isNil(op.iv)
            ? "-"
            : round(op.iv, op.iv >= 100 ? 0 : op.iv >= 10 ? 1 : 2)}
        </td>
      );
    case "v":
      return (
        <td key="v" className={clsDataRight}>
          {isNil(op.v) ? "-" : op.v}
        </td>
      );
    case "c":
      return (
        <td
          key="c"
          className={clx([
            css._chg,
            clsDataRight,
            !isNil(op.c) && op.c > 0 && css["--chg-plus"],
            !isNil(op.c) && op.c < 0 && css["--chg-neg"],
          ])}
        >
          {!isNil(op.c) && op.c > 0 ? "+" : ""}
          {isNil(op.c) ? "-" : formatPrice(op.c)}
        </td>
      );
    case "d":
      return (
        <td key="d" className={clsDataRight}>
          {isNil(op.d) ? "-" : round(op.d, 2)}
        </td>
      );
    default:
      return null;
  }
};

const getLegsAtStrike = (stk: number, curCalc: Strategy) =>
  legsWithIds(filterOptionLegs(curCalc)).filter(
    (optLeg) =>
      (typeof optLeg.strike === "string"
        ? parseFloat(optLeg.strike)
        : optLeg.strike) === stk
  );

// const chainDetailsOptions: [CHAIN_COLUMN_CHOICE, string][] = [
//   [CHAIN_COLUMN_CHOICE.SIMPLE, "Simple"],
//   [CHAIN_COLUMN_CHOICE.DETAILS, "Details"],
// ];
// const getValChainDetailOptions = (i: [CHAIN_COLUMN_CHOICE, string]) => i[1];
// const getValChainDetailId = (i: [CHAIN_COLUMN_CHOICE, string]) => i[0];

const renderChainRow = (props: {
  strike: number;
  strikesHaveDec: boolean;
  callData: OptionData;
  putData: OptionData;
  headings: string[];
  showCalls: boolean;
  showPuts: boolean;
  curPrice: number;
  onSelectOption: (
    type: "put" | "call",
    strike: number,
    price: number,
    iv: number
  ) => void;
  guides: StratLegOpt;
  curLegId: string;
  curCalc: Strategy;
  multiStages: MultiStrikeCalculation[] | null;
}) => {
  const dualView = props.showCalls && props.showPuts;
  const percFromCur = (props.strike - props.curPrice) / props.curPrice;
  const percFromCurDoubleDig = Math.abs(round(percFromCur * 100, 1)) >= 10;
  const percFromCurStr = `${percFromCur > 0 ? "+" : ""}${formatPercent(
    percFromCur,
    percFromCurDoubleDig ? 0 : 1
  )}`;
  const itmOtmCls =
    props.curPrice > props.strike ? "--strike-above" : "--strike-below";
  const curLegs = getLegsAtStrike(props.strike, props.curCalc);
  const curCallLegs = curLegs.filter((opLeg) => opLeg.opType === "call");
  const curPutLegs = curLegs.filter((opLeg) => opLeg.opType === "put");
  const curFocusedlegs =
    !dualView && props.showCalls
      ? curCallLegs
      : !dualView && props.showPuts
      ? curPutLegs
      : [];

  const strikeTd = (
    <td
      className={clx([
        css["_cell-data"],
        css["_cell-strike"],
        "align-right",
        !dualView && css["--is-clickable-cell"],
      ])}
      onClick={() => {
        if (!dualView && props.showCalls) {
          const price =
            props.guides.act === "buy"
              ? props.callData.a
              : props.guides.act === "sell"
              ? props.callData.b
              : round((props.callData.b + props.callData.a) / 2, 2);
          props.callData.b &&
            props.callData.a &&
            ////////////////////////////////////////////////// onSelect to save strike
            props.onSelectOption(
              "call",
              props.strike,
              price,
              props.callData.iv
            );
        } else if (!dualView && props.showPuts) {
          const price =
            props.guides.act === "buy"
              ? props.putData.a
              : props.guides.act === "sell"
              ? props.putData.b
              : round((props.putData.b + props.putData.a) / 2, 2);
          props.putData.b &&
            props.putData.a &&
            props.onSelectOption("put", props.strike, price, props.putData.iv);
        }
      }}
    >
      {props.multiStages &&
        props.multiStages?.find(
          // @ts-ignore
          (s) => s.legsById[props.curLegId]?.strike == props.strike
        ) && (
          <Box className={[css["_leg-indicator"]]}>
            <LegIndicator
              opType={"call"}
              act={"buy"}
              letter={
                props.multiStages
                  ? props.multiStages?.find(
                      // @ts-ignore
                      (s) => s.legsById[props.curLegId]?.strike == props.strike
                    )?.stage
                  : undefined
              }
            />
          </Box>
        )}
      {!dualView && curFocusedlegs.length ? (
        // todo: This misses situations where user is buying and selling same side at same strike (edge case)
        <Box
          className={[
            css["_leg-indicator"],
            curFocusedlegs[0].legId === props.curLegId && css["--is-dimmed"],
          ]}
        >
          {/*TODO: Add stage indicator*/}
          {(!props.multiStages || props.multiStages.length == 0) && (
            <LegIndicator
              opType={curFocusedlegs[0].opType}
              act={curFocusedlegs[0].act}
              letter={
                props.multiStages
                  ? props.multiStages?.find(
                      // @ts-ignore
                      (s) => s.legsById[props.curLegId]?.strike
                    )?.stage
                  : undefined
              }
            />
          )}
        </Box>
      ) : dualView && curCallLegs.length ? (
        <Box
          className={[
            css["_leg-indicator"],
            curCallLegs[0].legId === props.curLegId && css["--is-dimmed"],
          ]}
        >
          curCallLegs[0].opType
          <LegIndicator
            opType={curCallLegs[0].opType}
            act={curCallLegs[0].act}
            letter={
              props.multiStages
                ? props.multiStages?.find(
                    // @ts-ignore
                    (s) => s.legsById[props.curLegId]?.strike
                  )?.stage
                : undefined
            }
          />
        </Box>
      ) : null}
      {dualView && curPutLegs.length ? (
        <Box
          className={[
            css["_leg-indicator"],
            css["--on-right"],
            curPutLegs[0].legId === props.curLegId && css["--is-dimmed"],
          ]}
        >
          <LegIndicator
            opType={curPutLegs[0].opType}
            act={curPutLegs[0].act}
            pointLeft
            letter={
              props.multiStages
                ? props.multiStages?.find(
                    // @ts-ignore
                    (s) => s.legsById[props.curLegId]?.strike
                  )?.stage
                : undefined
            }
          />
        </Box>
      ) : null}
      {(props.strikesHaveDec ? formatPrice : formatPriceInt)(props.strike)}
      <T
        tagName="span"
        className={[
          css._percFromCur,
          percFromCurDoubleDig && css["--rpad-1dig"],
        ]}
      >
        ({percFromCurStr})
      </T>
    </td>
  );

  return (
    <tr key={props.strike} className={clx([css["_row-data"], css[itmOtmCls]])}>
      {!dualView && strikeTd}
      {!props.showCalls
        ? null
        : props.headings.map((headingCode, i) =>
            renderChainCell({
              // key={headingCode}
              headingCode,
              op: props.callData,
              onSelectOption: props.onSelectOption,
              strike: props.strike,
              first: i === 0,
              last: i === props.headings.length - 1,
              guides: props.guides,
              call: true,
            })
          )}
      {dualView && strikeTd}
      {!props.showPuts
        ? null
        : props.headings.map((headingCode, i) =>
            renderChainCell({
              // key: headingCode,
              headingCode,
              op: props.putData,
              onSelectOption: props.onSelectOption,
              strike: props.strike,
              first: i === 0,
              last: i === props.headings.length - 1,
              guides: props.guides,
              put: true,
            })
          )}
    </tr>
  );
};

// const headerTitleMap: Record<string, string> = {
//   l: "Last",
//   c: "Chg",
//   b: "Bid",
//   m: "Mid",
//   a: "Ask",
//   i: "Open int.",
//   v: "Volume",
//   d: "Delta",
//   iv: "Imp Vol.",
// };

const headerTitleMapShort: Record<string, string> = {
  l: "Last",
  c: "Chg",
  b: "Bid",
  m: "Mid",
  a: "Ask",
  i: "OI",
  v: "Vol.",
  d: "Delta",
  iv: "IV",
};

const ChainHeadings = (props: { headings: string[] }) => (
  <>
    {props.headings.map((headingCode, i) => {
      const xcls = [
        i === 0 ? css["--first"] : undefined,
        i === props.headings.length - 1 ? css["--last"] : undefined,
        css[`--code-${headingCode}`],
      ] as Optional<string>[];
      return (
        <th key={headingCode} className={clx(xcls)}>
          <span className={css._text}>{headerTitleMapShort[headingCode]}</span>
        </th>
      );
    })}
  </>
);

const STRIKE_DISPLAY_LIMIT = 10;

const OptionsChainView: FC<OptionsChainProps> = (
  props: OptionsChainProps
): ReturnType<typeof Box> => {
  const { defaultExpiry, prices, currentLeg, currentCalc, curPrice, close } =
    props;

  const [curExpiry, setCurExpiry] = React.useState(
    defaultExpiry || getFirstExp(prices) || ""
  );

  const curLeg = currentCalc.legsById[currentLeg] as StratLegOpt;
  // const legName = curLeg.name;
  const isMobile = useMediaQuery("mobile-only");

  const onSelectOption = React.useCallback(
    (type: "put" | "call", strike: number, price: number, iv: number) =>
      props.onSelectOption(curExpiry, type, strike, price, iv),
    [curExpiry, props.onSelectOption]
  );

  const curOptions: Nullable<OptionsChain_types> = prices[curExpiry] || null;

  const headings = props.chainColumns;

  const strikes = React.useMemo(
    () => ifVal(getStrikesFromChain, prices[curExpiry]),
    [prices, curExpiry]
  );
  const strikesHaveDec = React.useMemo(
    // @ts-ignore
    () => !strikes || !isUndefined(strikes.find((x) => Math.round(x) !== x)),
    [strikes]
  );

  const [showCalls, setShowCalls] = React.useState(curLeg?.opType !== "put");
  const [showPuts, setShowPuts] = React.useState(
    curLeg?.opType === "put" || (curLeg?.opType === null && !isMobile)
  );

  const showOpType = React.useCallback(
    (opType: string) => {
      opType === "calls"
        ? setShowCalls(true)
        : opType === "puts"
        ? setShowPuts(true)
        : undefined;
      if (isMobile) {
        opType === "calls"
          ? setShowPuts(false)
          : opType === "puts"
          ? setShowCalls(false)
          : undefined;
      }
    },
    [showCalls, showPuts, isMobile]
  );

  // const bestPriceData = pipe(
  //   () =>
  //     curLeg.expiry && curLeg.strike && curLeg.opType
  //       ? {
  //           expiry: curLeg.expiry,
  //           strike: curLeg.strike,
  //           opType: curLeg.opType,
  //         }
  //       : undefined,
  //   ifNotUndefined((p) => ({
  //     ...p,
  //     prevPrices: prices[p.expiry]?.[opTypeKey(p.opType)]?.[p.strike],
  //     newPrices: prices[curExpiry]?.[opTypeKey(p.opType)]?.[p.strike],
  //   }))
  // )();
  // const bestPrice =
  //   curLeg.expiry === curExpiry
  //     ? curLeg.price
  //     : pipe(
  //         () => bestPriceData,
  //         ifNotUndefined(({ prevPrices, newPrices }) =>
  //           newPrices
  //             ? matchPrice(
  //                 curLeg.price || 0,
  //                 !curLeg.price || !prevPrices ? {} : prevPrices,
  //                 newPrices
  //               )
  //             : undefined
  //         )
  //       )();
  // const bestPriceDesc = !bestPriceData?.newPrices
  //   ? ""
  //   : bestPriceData.newPrices.b == bestPrice
  //   ? " (bid)"
  //   : bestPriceData.newPrices.a == bestPrice
  //   ? " (ask)"
  //   : (calcMid(bestPriceData.newPrices.b, bestPriceData.newPrices.a) || -1) ==
  //     bestPrice
  //   ? " (mid)"
  //   : "";

  // const chooseButton = false;
  // curExpiry && curLeg.strike && curLeg.opType && bestPrice
  //   ? `${formatPrice(
  //       curLeg.strike,
  //     )} ${curLeg.opType.toLowerCase()} @ $${formatPrice(
  //       bestPrice,
  //     )}${bestPriceDesc}`
  //   : null;

  // const useCurrentExpiry = React.useCallback(() => {
  //   if (curLeg && curLeg.opType && curLeg.strike && bestPrice) {
  //     const newIv =
  //       prices[curExpiry]?.[opTypeKey(curLeg.opType)]?.[curLeg.strike].iv;
  //     newIv &&
  //       props.onSelectOption(
  //         curExpiry,
  //         curLeg.opType,
  //         curLeg.strike,
  //         bestPrice,
  //         newIv
  //       );
  //   }
  // }, [curExpiry, curLeg, props.onSelectOption]);

  const [strikeITM, strikeOTM] = React.useMemo(() => {
    const newStrikeITM: number[] = [];
    const newStrikeOTM: number[] = [];

    // @ts-ignore
    strikes?.forEach((item) => {
      if (item >= curPrice) {
        newStrikeITM.push(item);
        return;
      }

      if (item < curPrice) {
        newStrikeOTM.push(item);
      }
    });

    return [newStrikeITM, newStrikeOTM];
  }, [strikes]);

  const [limitITMDisplayed, setLimitITMDisplayed] = React.useState<boolean>(
    strikeITM?.length >= STRIKE_DISPLAY_LIMIT
  );
  const [limitOTMDisplayed, setLimitOTMDisplayed] = React.useState<boolean>(
    strikeOTM?.length >= STRIKE_DISPLAY_LIMIT
  );

  const idxOfCurStkOTM = !curLeg.strike
    ? -1
    : strikeOTM.findIndex((stk) => stk === curLeg.strike);
  const idxOfCurStkITM = !curLeg.strike
    ? -1
    : strikeITM.findIndex((stk) => stk === curLeg.strike);
  const strikeDisplayed = [
    ...(limitOTMDisplayed
      ? strikeOTM.filter((val, index) => {
          if (
            index > strikeOTM.length - STRIKE_DISPLAY_LIMIT ||
            (idxOfCurStkOTM !== -1 && index >= idxOfCurStkOTM - 3)
          )
            return true;
          return false;
        })
      : strikeOTM),
    ...(limitITMDisplayed
      ? strikeITM.filter((val, index) => {
          if (
            index < STRIKE_DISPLAY_LIMIT ||
            (idxOfCurStkITM !== -1 && index <= idxOfCurStkITM + 3)
          )
            return true;
          return false;
        })
      : strikeITM),
  ];

  const dte = Math.ceil(
    timeTilExpiry(curExpiry, TIME_DECAY_BASIS.CALENDAR_DAYS) *
      FINANCE.DFLT_DAYS_PER_YEAR
  );

  // React.useMemo(() => {
  //   const match = chainDetailsOptions.find((x) => x[0] === props.columnsChoice);
  //   return match ? match[1] : props.columnsChoice || '';
  // }, [chainDetailsOptions, props.columnsChoice]);
  const showDetailCols = props.columnsChoice === CHAIN_COLUMN_CHOICE.DETAILS;
  const showDetailToggleNodeAbove = showPuts && showCalls && !showDetailCols;
  const detailToggleNode = (
    <Box flexSec="center">
      <input
        type="checkbox"
        className="styled --small"
        checked={showDetailCols}
        onClick={() =>
          props.setChainColumns([
            showDetailCols
              ? CHAIN_COLUMN_CHOICE.SIMPLE
              : CHAIN_COLUMN_CHOICE.DETAILS,
          ])
        }
      />
      <T
        content-detail
        className={css.clickable}
        onClick={() =>
          props.setChainColumns([
            showDetailCols
              ? CHAIN_COLUMN_CHOICE.SIMPLE
              : CHAIN_COLUMN_CHOICE.DETAILS,
          ])
        }
      >
        &nbsp;Detail columns
      </T>
    </Box>
  );

  const newSavedCalculations = useContext(NewSavedCalcsContext);

  const currentMultiStrikes = useSelectorSafe((s) => s.multiStrike, null);

  return (
    <>
      <div
        className={`${
          newSavedCalculations &&
          newSavedCalculations.calculatorUserViewSettings.optionLegStyle ===
            INPUT_METHODS.INLINE &&
          "grid-cols-2 lg:grid"
        }`}
      >
        <Box className={`${css["_stick-left"]} r-2`}>
          <Icon
            icon={"close"}
            ctnrClassName={clx([
              css.closeIcon,
              props.isDraggable && css["--draggable"],
            ])}
            onClick={close}
          />
          <Box className={css["expiry-selector"]}>
            <T
              className={[css._header, props.isDraggable && css["--draggable"]]}
              content-fields-set-label
            >
              Expiry month
            </T>
            <Box className={css["_expiry-scroller"]} mt={1 / 2}>
              <ExpirySelector
                prices={prices}
                onSelectExpiry={setCurExpiry}
                curExpiry={curExpiry}
              />
            </Box>
          </Box>
          {isMobile && (
            <Box flexPri="space-between" flexSec="end" mt={1}>
              <Box className={[css["cell-heading"], "align-left"]}>
                {showCalls ? (
                  <T tagName="span" content-tag className={css["_text"]}>
                    Calls
                  </T>
                ) : (
                  <T
                    tagName="span"
                    content-tag-clickable
                    clickable
                    className={[css["_text"], css["--text-link"]]}
                    onClick={() => showOpType("calls")}
                  >
                    Calls
                  </T>
                )}
                <Box className={css._text} inline-block>
                  <TextDivider />
                </Box>
                {showPuts ? (
                  <T tagName="span" content-tag className={css["--_text"]}>
                    Puts
                  </T>
                ) : (
                  <T
                    tagName="span"
                    content-tag-clickable
                    clickable
                    className={[css["_text"], css["--text-link"]]}
                    onClick={() => showOpType("puts")}
                  >
                    Puts
                  </T>
                )}
              </Box>
              {detailToggleNode}
            </Box>
          )}
        </Box>
        <Box
          className={[
            css.chain,
            `${
              newSavedCalculations &&
              newSavedCalculations.calculatorUserViewSettings.optionLegStyle ===
                INPUT_METHODS.INLINE &&
              "-order-1"
            }`,
          ]}
          flexPri="start"
          mt={!isMobile ? 1 : 0}
        >
          <table className={css._table}>
            <thead>
              <tr className={css["_row-type-header"]}>
                {!isMobile &&
                  (showPuts && showCalls ? (
                    <th
                      colSpan={
                        1 +
                        (showCalls ? headings.length : 1) +
                        (showPuts ? headings.length : 1)
                      }
                    >
                      <Box flexPri="space-around" flexSec="end">
                        <Box flex-1 className={css["cell-heading"]}>
                          <Box flex-1 className={css._text}>
                            <T
                              tagName="span"
                              content-tag
                              className={[
                                css["--text"],
                                css["--with-hide-button"],
                              ]}
                              mr={1 / 3}
                            >
                              Calls
                            </T>
                            {/*<Icon xsmall icon="close" colorClickable onClick={() => setShowCalls(false)} inline />*/}
                            <T
                              tagName="span"
                              content-tag-clickable
                              clickable
                              hinted
                              className={[css["--text-link"]]}
                              onClick={() => setShowCalls(false)}
                            >
                              (hide)
                            </T>
                          </Box>
                        </Box>
                        <T content-tag>
                          {codeToExp(curExpiry)} ({dte} days)
                        </T>
                        <Box
                          flex-1
                          flex-col
                          className={css["cell-heading"]}
                          flexSec="stretch"
                          style={{ position: "relative" }}
                        >
                          {
                            <Box
                              mr={1 / 3}
                              inline-block
                              inline-flex
                              flexPri="end"
                              style={
                                showDetailToggleNodeAbove
                                  ? {}
                                  : { position: "absolute", right: 0 }
                              }
                            >
                              {detailToggleNode}
                            </Box>
                          }
                          <Box flex-1 className={css._text}>
                            <T
                              tagName="span"
                              content-tag
                              className={[
                                css["--text"],
                                css["--with-hide-button"],
                              ]}
                              mr={1 / 3}
                            >
                              Puts
                            </T>
                            <T
                              tagName="span"
                              content-tag-clickable
                              clickable
                              hinted
                              className={css["--text-link"]}
                              onClick={() => setShowPuts(false)}
                            >
                              (hide)
                            </T>
                          </Box>
                        </Box>
                      </Box>
                    </th>
                  ) : (
                    <th colSpan={1 + headings.length}>
                      <Box flexSec="center" flexPri="space-between" mb={1 / 4}>
                        <Box
                          className={[css["cell-heading"], "align-left"]}
                          flex-1
                          ml={1 / 3}
                        >
                          <T
                            tagName="span"
                            content-tag
                            className={[css["_text"], "align-left"]}
                          >
                            {showCalls ? "Calls" : showPuts ? "Puts" : ""}
                            {" – "}
                            {codeToExp(curExpiry)} ({dte} days)
                          </T>
                        </Box>
                        <Box flexSec="center" flexPri="end">
                          <Box className={[css["cell-heading"]]}>
                            <T
                              ml={1}
                              tagName="span"
                              content-tag-clickable
                              clickable
                              hinted
                              className={[css._text, css["--text-link"]]}
                              onClick={() =>
                                showOpType(showCalls ? "puts" : "calls")
                              }
                            >
                              {showCalls ? "Puts" : "Calls"}
                            </T>
                          </Box>
                          <Box ml={1 / 2} mr={1 / 3} inline-block>
                            {detailToggleNode}
                          </Box>
                        </Box>
                      </Box>
                    </th>
                  ))}
              </tr>
              <tr className={css["_row-header"]}>
                {!(showCalls && showPuts) && (
                  <th className={css["_cell-strike"]}>Strike</th>
                )}
                {!showCalls ? null : <ChainHeadings headings={headings} />}
                {showCalls && showPuts && (
                  <th className={css["_cell-strike"]}>Strike</th>
                )}
                {!showPuts ? null : <ChainHeadings headings={headings} />}
              </tr>
            </thead>
            <tbody>
              {limitOTMDisplayed && (
                <tr className={css["_row-data"]}>
                  <td
                    colSpan={
                      1 +
                      (showCalls ? headings.length : 0) +
                      (showPuts ? headings.length : 0)
                    }
                    className={css["show-hidden-strikes"]}
                    align="center"
                  >
                    <T
                      content-tag-clickable
                      clickable
                      hinted
                      onClick={() => setLimitOTMDisplayed(false)}
                    >
                      Show lower strikes
                    </T>
                  </td>
                </tr>
              )}
              {curOptions &&
                strikeDisplayed?.map((x, i) => (
                  <React.Fragment key={`${curExpiry}-${x}`}>
                    {renderChainRow({
                      curPrice,
                      strike: x,
                      strikesHaveDec,
                      callData: curOptions.c[x],
                      putData: curOptions.p[x],
                      headings,
                      showCalls,
                      showPuts,
                      onSelectOption,
                      //////////////// onClick on button
                      guides: curLeg,
                      curCalc: currentCalc,
                      curLegId: currentLeg,
                      multiStages: currentMultiStrikes,
                    })}
                    {x < curPrice &&
                      i < strikeDisplayed.length - 1 &&
                      strikeDisplayed[i + 1] >= curPrice && (
                        //////////////// row on the table as a button
                        <tr
                          className={clx([
                            css["_row-data"],
                            css["--last-traded"],
                          ])}
                        >
                          {!(showCalls && showPuts) ? (
                            <>
                              <td
                                className={clx([
                                  "ph-1-3",
                                  "align-right",
                                  css._price,
                                ])}
                              >
                                {curPrice}
                              </td>
                              <td colSpan={headings.length}>(Last price)</td>
                            </>
                          ) : (
                            <>
                              <td colSpan={headings.length} align="right">
                                Last price:
                              </td>
                              <td align="center" className={css._price}>
                                {curPrice}
                              </td>
                              <td colSpan={headings.length} align="center">
                                {nbsp}
                              </td>
                            </>
                          )}
                        </tr>
                      )}
                  </React.Fragment>
                ))}
              {limitITMDisplayed && (
                <tr className={css["_row-data"]}>
                  <td
                    colSpan={
                      1 +
                      (showCalls ? headings.length : 0) +
                      (showPuts ? headings.length : 0)
                    }
                    className={css["show-hidden-strikes"]}
                    align="center"
                  >
                    <T
                      content-tag-clickable
                      clickable
                      hinted
                      onClick={() => setLimitITMDisplayed(false)}
                    >
                      Show higher strikes
                    </T>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <Box className={css._spacer} />
        </Box>
        <Box mt={1 / 2}>
          {curLeg?.act && (
            <T content-detail>
              You are {curLeg.act}ing this option;{" "}
              <Box tagName="span" className={css.textBold}>
                {curLeg.act === "buy" ? "Mid and Ask" : "Bid and Mid"}
              </Box>{" "}
              prices are{" "}
              <Box tagName="span" className={css.fauxHighlight}>
                highlighted
              </Box>
              .
            </T>
          )}
        </Box>
      </div>
    </>
  );
};

type OptionsChainValidatorProps = Omit<
  OptionsChainProps,
  "prices" | "currentCalc" | "currentLeg"
> & {
  prices: Optional<OptionsChainProps["prices"]>;
  currentCalc: Nullable<OptionsChainProps["currentCalc"]>;
  currentLeg: Nullable<OptionsChainProps["currentLeg"]>;
};

const OptionsChainValidator = (props: OptionsChainValidatorProps) => {
  const { prices, currentCalc, currentLeg, close } = props;

  const isLoading = !prices || !currentCalc || !currentLeg;
  return (
    <ModalContainer
      //////////// modal pop-up
      onClickOutside={close}
      onEscapeKeyPressed={close}
      className={[css.container].concat(
        isLoading ? ["--center --col mt-16 flex md:mt-0"] : ["mt-16 md:mt-0"]
      )}
    >
      {isLoading || !prices || !currentCalc || !currentLeg ? (
        <>
          <Icon icon={"close"} ctnrClassName={css.closeIcon} onClick={close} />
          <Spinner />
          <T content-hint mt={1 / 3}>
            Updating prices
          </T>
        </>
      ) : (
        <OptionsChainView
          {...props}
          prices={prices}
          currentCalc={currentCalc}
          currentLeg={currentLeg}
        />
      )}
    </ModalContainer>
  );
};

export default React.memo(OptionsChainValidator);
