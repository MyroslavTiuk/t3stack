import React from "react";
import { isNull } from "errable";

import Box from "../../../primitives/Box";
import T from "../../../primitives/Typo";

import clx from "../../../../../utils/Html/clx";
import cssAutocomplete from "../../../primitives/Autocomplete/Autocomplete.module.scss";
import formatPrice from "../../../../../utils/String/formatPrice/formatPrice";

import type StrikeChoice from "../OptionLeg/types/StrikeChoice";
import css from "../OptionLeg/OptionLeg.module.scss";
import { type Nullable } from "opc-types/lib/util/Nullable";
import Loading from "../../../primitives/Loading/Loading.view";
import LegIndicator from "../../../primitives/LegIndicator/LegIndicator.view";

export enum StrikeSelectorHints {
  EXPIRY = 1,
  TYPE = 2,
}

export const renderStrikeHeader = (hints = 0) => (
  <>
    {hints > 0 && (
      <td
        className={clx([
          css.dropdownTabularRow,
          css["--warning-row"],
          "align-center",
        ])}
        colSpan={4}
      >
        Select {hints & StrikeSelectorHints.EXPIRY ? "Expiry" : ""}
        {hints === StrikeSelectorHints.EXPIRY + StrikeSelectorHints.TYPE &&
          " and "}
        {hints & StrikeSelectorHints.TYPE ? "Type (call/put)" : ""} for pricing
      </td>
    )}
    <Box
      className={[
        css.dropdownTabularRow,
        css["--is-header"],
        css["--id-strikes"],
      ]}
    >
      <Box className={[css._item, css._strike, "align-center"]}>
        <T content-field-label-inline>Strike</T>
      </Box>
      <Box className={[css._item, css._price, "align-center"]}>
        <T content-field-label-inline>Bid–Ask</T>
      </Box>
      <Box className={[css._item, css._delta, "align-right"]}>
        <T content-field-label-inline>Delta</T>
      </Box>
      <Box className={[css._item, css._iv, "align-right"]}>
        <T content-field-label-inline>IV</T>
      </Box>
    </Box>
  </>
);

type ACProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

// todo: convert to component for efficiency
export const renderStrikeRow = (
  autocompleteProps: ACProps,
  item: StrikeChoice,
  isMatch: boolean,
  isSelected: boolean,
  value: string
) => {
  const isAtmRow = item.percFromCur === "ATM";
  const isLoading = item.strike === "Loading...";
  const legAtStkType = item.legsAtStk.reduce((acc, leg) => {
    if (
      acc === "both" ||
      (leg[1] === "put" && acc === "call") ||
      (leg[1] === "call" && acc === "put")
    )
      return "both";
    return leg[1];
  }, null as Nullable<"put" | "call" | "both">);
  const legAtStkAct = item.legsAtStk.reduce((acc, leg) => {
    if (
      acc === "both" ||
      (leg[0] === "buy" && acc === "sell") ||
      (leg[0] === "sell" && acc === "buy")
    )
      return "both";
    return leg[0];
  }, null as Nullable<"buy" | "sell" | "both">);
  const tdClass = `${css._item} ${isAtmRow ? "" : css["_cell-data"]} ${
    css["--type-put"]
  }`;
  return (
    <div
      {...autocompleteProps}
      className={clx([
        css.dropdownTabularRow,
        isMatch && value && cssAutocomplete["--match"],
        isSelected && cssAutocomplete["--highlighted"],
        // Duplicated so that css has scope to apply style rules
        isSelected && css["--highlighted"],
        // item.isITM && !isAtmRow && css['--is-itm'],
        !item.isITM ? css["--strike-above"] : css["--strike-below"],
        isAtmRow && css["--last-price"],
        css["--id-strikes"],
      ])}
    >
      {isAtmRow ? (
        <td className={`${tdClass} align-center`} colSpan={4}>
          <T>
            Last:{" "}
            {!item.priceBid
              ? "-"
              : formatPrice(item.priceBid, { hideDollar: true })}
          </T>
        </td>
      ) : (
        <>
          <T className={[tdClass, css._strike, "align-right"]}>
            {legAtStkType && (
              <Box className={css._legIndicatorHolder}>
                <LegIndicator
                  className={css._legIndicator}
                  opType={legAtStkType}
                  act={legAtStkAct}
                />
              </Box>
            )}
            {isLoading ? (
              <Loading />
            ) : (
              <>
                {item.strike}
                <T tagName={"span"} className={css._perc}>
                  ({item.percFromCur})
                </T>
              </>
            )}
          </T>
          <Box className={[tdClass, css._price, "align-center"]}>
            <T>
              {(item.priceBid &&
                formatPrice(item.priceBid, {
                  hideDollar: true,
                  forceShowCents: true,
                })) ||
                "-"}
              –
              {(item.priceAsk &&
                formatPrice(item.priceAsk, {
                  hideDollar: true,
                  forceShowCents: true,
                })) ||
                "-"}
            </T>
          </Box>
          <Box className={[tdClass, css._delta, "align-right"]}>
            <T>{item.delta}</T>
          </Box>
          <Box className={[tdClass, css._iv, "align-right"]}>
            <T>{!item.iv ? "" : item.iv.toFixed(1)}</T>
          </Box>
        </>
      )}
    </div>
  );
};

export const renderStrikeRowMobile = (item: StrikeChoice) =>
  item.strike === ""
    ? `—– last: ${item.priceAsk} ——`
    : item.strike === "Loading..."
    ? "Loading..."
    : `${item.strike} (${
        !item.priceBid ? "na" : formatPrice(item.priceBid, { hideDollar: true })
      } - ${
        !item.priceAsk ? "na" : formatPrice(item.priceAsk, { hideDollar: true })
      })`;

export const getStrikeItemValue = (item: StrikeChoice): string => item.strike;

// This will find the first !isITM item, which will be ~ATM
export const findATMItem = (strikeChoices: StrikeChoice[]) =>
  strikeChoices.find((item) => !item.isITM);

export const findSelectedItem = (
  strike: Nullable<string>,
  strikeChoices: StrikeChoice[]
) => strikeChoices.find((choice) => choice.strike === strike) || null;

export const addATMdummyOption = (
  strikeChoices: StrikeChoice[],
  curPriceLast: number | null
) => {
  if (isNull(curPriceLast)) return strikeChoices;
  return strikeChoices.reduce((newStkChc, stkChoice, i) => {
    if (
      i >= 1 &&
      parseFloat(stkChoice.strike) >= curPriceLast &&
      parseFloat(strikeChoices[i - 1].strike) < curPriceLast
    ) {
      newStkChc.push({
        strike: "",
        percFromCur: "ATM",
        delta: "",
        priceBid: curPriceLast,
        priceAsk: curPriceLast,
        isITM: true,
        iv: null,
        legsAtStk: [],
      });
    }
    newStkChc.push(stkChoice);
    return newStkChc;
  }, [] as StrikeChoice[]);
};
