import { type Optional } from "opc-types/lib/util/Optional";
import React, { type ReactElement } from "react";
import * as R from "ramda";

import clx from "../../../../utils/Html/clx";

import css from "./Autocomplete.module.scss";
import { type AutocompleteProps } from "./Autocomplete.props";
import combineClassNames from "../../../../utils/Html/combineClassNames";
import { HIGHLIGHT } from "../../../../consts/HIGHLIGHT";
import Box from "../Box";
import T from "../Typo";

export default function SelectAutocomplete<T>(
  props: AutocompleteProps<T>
): ReactElement<HTMLElement> {
  const getItemValue = props.getItemValue || (R.identity as (i: T) => string);
  const getItemId =
    props.getItemId || props.getItemValue || (R.identity as (i: T) => string);
  const renderRowString = props.renderRowString || getItemValue;

  const onChange = React.useCallback(
    (evt: React.ChangeEvent<HTMLSelectElement>) => {
      const val = evt.target.value;
      const matches = props.items.filter((i: T) => getItemId(i) === val);
      if (matches.length >= 1) {
        props.onSelect(val, matches[0]);
      }
    },
    [props.items, props.onSelect]
  );
  const onClick = React.useCallback(() => {
    props.inputProps?.onFocus && props.inputProps?.onFocus();
  }, [props.inputProps?.onFocus]);

  let hasCustomBlank = false;
  const OptionNodes = props.items.map((item, i) => {
    const val = getItemValue(item);
    if (val === "") {
      hasCustomBlank = true;
    }
    return (
      <option key={i} value={val === "" ? "" : getItemId(item)}>
        {renderRowString(item)}
      </option>
    );
  });
  return (
    <div
      className={clx(
        R.flatten([
          props.className,
          css.selectCtnr,
          css["--has-options"],
          (props.hideDropdownNotch || props.inputProps?.disabled) &&
            css["--hide-notch"],
        ]) as Optional<string>[]
      )}
    >
      <Box
        className={combineClassNames(
          [
            css._currentValue,
            !props.displayValue && !props.value && css["--placeholder"],
            props.inputProps?.highlight === HIGHLIGHT.HIGHLIGHT &&
              css["--highlighted"],
            props.inputProps?.highlight === HIGHLIGHT.WARNING &&
              css["--highlighted-warning"],
            !props.noTypoStylesOnInput && css["--with-typo"],
          ],
          ""
        )}
        onClick={onClick}
        flexPri="start"
      >
        {props.inputProps?.prefix && (
          <T className={css._prefix}>{props.inputProps?.prefix}</T>
        )}

        <Box
          className={props.inputProps?.inputClassName}
          style={
            props.inputProps?.prefixWidthRem
              ? {
                  paddingLeft: `${props.inputProps?.prefixWidthRem}rem`,
                }
              : {}
          }
        >
          <span>{props.displayValue || props.value || props.placeholder}</span>
        </Box>
      </Box>
      <select
        className={css._selectBox}
        onFocus={onClick}
        onChange={onChange}
        value={props.value}
        disabled={props.inputProps?.disabled}
      >
        {!props.value && !hasCustomBlank && <option value="">—</option>}
        {OptionNodes}
      </select>
    </div>
  );
}
