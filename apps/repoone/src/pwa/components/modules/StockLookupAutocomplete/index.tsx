import React, { type MutableRefObject, useState } from "react";
import { always, pipe } from "ramda";
import { recoverUndefined } from "errable";

import { type CompWithClassName } from "opc-types/lib/util/CompWithClassName";
import { type Optional } from "opc-types/lib/util/Optional";
import { type Nullable } from "opc-types/lib/util/Nullable";

import Autocomplete from "../../primitives/Autocomplete";
import Box from "../../primitives/Box";
import Icon from "../../primitives/Icon";
import clx from "../../../../utils/Html/clx";
import orUndef from "../../../../utils/Data/orUndef/orUndef";
import optionableStocks, {
  popularStocks,
} from "../../../../model/optionableStocks";

import autoCompleteCss from "../../primitives/Autocomplete/Autocomplete.module.scss";
import entryCss from "../StrategyCalculator/Entry/Entry.module.scss";
import { useSession } from "../Session/SessionProvider";
import fmtInputToState from "../StrategyCalculator/StockLeg/utils/fmtInputToState";
import { calculatorActions } from "../../../store/actions";
import useSelectorSafe from "~/pwa/store/selectors/useSelectorSafe";
import type { Strategy } from "../../../../../opc-types/lib/Strategy";
import calcActions from "~/pwa/store/actions/calculator";
import { useDispatch } from "react-redux";

interface Props extends CompWithClassName {
  val: string;
  onChange: (val: string) => void;
  onSelect: (val: string) => void;
  inputClassName?: string;
  error?: string;
  autoScrollOffset?: number;
  inputRef?: MutableRefObject<Nullable<HTMLInputElement>>;
}

const SEARCH_FOR_UNKNOWN = "SEARCH_FOR_UNKNOWN";

const renderRow = (
  autocompleteProps: Record<string, any>,
  item: [string, string],
  _isMatch: boolean,
  isSelected: boolean,
  _value: string
) => {
  const isSearchUnknownRow = item[1] === SEARCH_FOR_UNKNOWN;

  return (
    <div
      {...autocompleteProps}
      key={item[0]}
      className={clx([
        autoCompleteCss.row,
        isSearchUnknownRow && autoCompleteCss["--custom-search-row"],
        isSelected && autoCompleteCss["--highlighted"],
      ])}
    >
      {isSearchUnknownRow
        ? `Search for symbol: ${item[0]}`
        : `${item[0]} – ${item[1]}`}
    </div>
  );
};

const getValItemValue = (item: [string, string]) => item[0];

const filterValStocks = (item: [string, string], val: string) => {
  return item[0].concat("|", item[1]).toLowerCase().includes(val.toLowerCase());
};

// autocomplete results should already be matching, so no need to run an algoritm on it again
const alwaysTrue = always(true);

const sortStocksVsVal =
  (val: string) => (b: [string, string], a: [string, string]) => {
    const B = b.map((_) => _.toUpperCase());
    const A = a.map((_) => _.toUpperCase());
    return B[0] === val
      ? -1
      : A[0] === val
      ? 1
      : B[0].indexOf(val) === 0
      ? -1
      : A[0].indexOf(val) === 0
      ? 1
      : B[1].indexOf(val) === 0
      ? -1
      : A[1].indexOf(val) === 0
      ? 1
      : B[0] < A[0]
      ? -1
      : B[0] > A[0]
      ? 1
      : 0;
  };

const StockLookupAutocomplete = (props: Props) => {
  const dispatch = useDispatch();
  const [fieldError, setFieldError] = React.useState<Optional<string>>();
  React.useEffect(() => {
    setFieldError(props.error);
  }, [props.error]);
  const [isBlurring, setIsBlurring] = useState(false);
  const { dispactionUserSettings, userData } = useSession();
  const recentStocks = popularStocks(userData.userSettings.recentStockSymbols);

  const storeCurCalc = useSelectorSafe<Nullable<Strategy>>(
    (store) => store.currentCalculation,
    null
  );

  const storeCurCalcs = useSelectorSafe<Nullable<Strategy>>(
    // @ts-ignore
    (store) => store.currentCalculations,
    null
  );

  const filteredOptionableStocks = React.useMemo(() => {
    const val = props.val.toUpperCase().split(" -")[0].trim();
    return pipe(
      () => orUndef(val == "" && recentStocks),
      recoverUndefined(
        () =>
          optionableStocks
            .filter((stockData) => filterValStocks(stockData, val))
            .sort(sortStocksVsVal(val))
            .slice(0, 10) as [string, string][]
      ),
      (list) =>
        !val ||
        (list.length > 0 && list.find((sd) => sd[0].toUpperCase() === val))
          ? list
          : ([[val, SEARCH_FOR_UNKNOWN], ...list] as [string, string][])
    )();
  }, [props.val]);

  // Some hacks here, as the SyntheticEvent doesn't contain the info we need to deal with the situation
  //   where the user blurs the input field because they have clicked on the search icon
  const onBlur = React.useCallback(
    (val: string) => {
      if (!isBlurring) {
        setFieldError(undefined);
        setIsBlurring(true);
        props.onSelect(val);
        setTimeout(() => setIsBlurring(false), 200);
      }
    },
    [props.onSelect, isBlurring]
  );

  const updateRecentStockSymbols = dispactionUserSettings(
    calculatorActions.changeSymbol
  );

  const fmtVal = fmtInputToState("val");
  const onSelect = React.useCallback(
    (val: string) => {
      const symbols = val.split(",");
      console.log(symbols);
      if (symbols.length > 1) {
        // @ts-ignore
        if (storeCurCalcs.length == 0 && storeCurCalc) {
          dispatch(
            calcActions.setCurrentCalcs(
              symbols.slice(0, 5).map((s) => ({
                ...storeCurCalc,
                legsById: {
                  ...storeCurCalc.legsById,
                  underlying: {
                    ...storeCurCalc.legsById.underlying,
                    val: fmtVal(s.trim()),
                  },
                },
              }))
            )
          );
        }

        const trimmedVal = fmtVal(symbols[0]);
        if (!trimmedVal.length) return;

        onBlur(trimmedVal);
        updateRecentStockSymbols(trimmedVal);
        return;
      }
      const trimmedVal = fmtVal(val);
      if (!trimmedVal.length) return;

      onBlur(trimmedVal);
      updateRecentStockSymbols(trimmedVal);
    },
    [fmtVal, updateRecentStockSymbols, onBlur]
  );

  const clearSearch = React.useCallback(() => {
    props.onChange("");
    props.onSelect("");
    props.inputRef?.current?.focus();
  }, [props.onChange, props.onSelect]);

  return (
    <>
      <Autocomplete
        items={filteredOptionableStocks}
        className={props.className}
        allowFreeEntry
        getItemValue={getValItemValue}
        checkItemMatch={alwaysTrue}
        value={props.val || ""}
        // value={symbols.length > 0 ? symbols.reduce((a, b) => `${a}, ${b}`) : ""}
        onChange={props.onChange}
        onSelect={onSelect}
        placeholder={`Search stocks and indexes`}
        renderRow={renderRow}
        hideDropdownNotch
        autoScrollOffset={props.autoScrollOffset}
        inputRef={props.inputRef || undefined}
        inputProps={{
          className: props.inputClassName,
          preIcon: (
            <Box className={entryCss["search-icon"]} ml={1 / 4}>
              <Icon
                ctnrClassName={entryCss["_iconCtnr"]}
                className={entryCss["_icon"]}
                icon={"search"}
                xsmall
              />
            </Box>
          ),
          icon: props.val ? (
            <Icon
              ctnrClassName={entryCss["symbInputCloseIcon"]}
              icon={"close"}
              small
              onClick={clearSearch}
            />
          ) : undefined,
          prefixWidthRem: 1,
          error: fieldError,
          highlight: props.val.length === 0 || undefined,
          spellCheck: false,
        }}
      />
    </>
  );
};

export default StockLookupAutocomplete;
