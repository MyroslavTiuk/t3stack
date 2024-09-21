import {
  type ACEleProps,
  renderRowDefault,
} from "../../../primitives/Autocomplete/Autocomplete.view";
import { type ExpiryChoice } from "../OptionLeg/OptionLeg.props";
import Loading from "../../../primitives/Loading/Loading.view";
import css from "../../../primitives/Autocomplete/Autocomplete.module.scss";
import React from "react";

export function renderExpiryChoiceRow(
  autocompleteProps: ACEleProps,
  item: ExpiryChoice,
  isMatch: boolean,
  isSelected: boolean,
  value: string,
  getItemVal: (t: ExpiryChoice) => string
): React.ReactNode {
  if (item.date === "Loading...") {
    return (
      <div {...autocompleteProps} className={css.row}>
        <Loading />
      </div>
    );
  }
  return renderRowDefault(
    autocompleteProps,
    item,
    isMatch,
    isSelected,
    value,
    getItemVal
  );
}
