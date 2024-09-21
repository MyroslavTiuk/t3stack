// todo:
//  - aria compatibility
//  - ghost input for autocomplete behind element - what if first match has different first characters?

import React, { type FocusEvent, type ReactElement } from "react";
import { isUndefined, notUndefined } from "errable";
import * as R from "ramda";

import { type Nullable } from "opc-types/lib/util/Nullable";
import { type Optional } from "opc-types/lib/util/Optional";
import clx from "../../../../utils/Html/clx";
import orUndef from "../../../../utils/Data/orUndef/orUndef";
import useDependentCallback from "../../../../utils/Hooks/useDependentCallback";
import indexOf from "../../../../utils/Data/indexOf/indexOf";
import useMediaQuery from "../../../../utils/Hooks/useMediaQuery";

import Input from "../Input";
import {
  type AutocompleteProps,
  type AutocompletePublicProps,
} from "./Autocomplete.props";
import css from "./Autocomplete.module.scss";
import SelectAutocomplete from "./SelectAutocomplete.view";
import combineClassNames from "../../../../utils/Html/combineClassNames";

// This is used only for UI debugging
const FORCE_STAY_OPEN = false;
const AUTO_SCROLL_OFFSET_CONST = 14;

export type ACEleProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

export function renderRowDefault<T>(
  autocompleteProps: ACEleProps,
  item: T,
  isMatch: boolean,
  isSelected: boolean,
  value: string,
  getItemValue: (i: T) => string
) {
  const itemValue = getItemValue(item);
  if (typeof itemValue !== "string")
    throw new Error(
      "getItemValue returned non-string in default renderRow for Autocomplete"
    );

  return (
    <div
      {...autocompleteProps}
      className={clx([
        css.row,
        orUndef(isMatch && value && css["--match"]),
        orUndef(isSelected && css["--highlighted"]),
      ])}
    >
      {itemValue}
    </div>
  );
}

const isString = (x: any): x is string => typeof x === "string";

function checkItemMatchDefault<T>(
  item: T,
  value: string,
  getItemValue?: (item: T) => string
) {
  const itemVal = isString(item)
    ? (item as string)
    : getItemValue && getItemValue(item);
  if (isUndefined(itemVal)) return false;
  return itemVal?.toLowerCase().includes(value?.toLowerCase());
}

// returns the handler, needed to pass in the generic
function getKeyDownHandler<T>() {
  return (
    [
      selectionRef,
      inputRef,
      nextElementRef,
      disableSelectBySpace,
      setHasFocus,
      onChange,
      onSelect,
      setSelectedItemAndRef,
      getItemValue,
    ]: [
      React.MutableRefObject<{ selectedItem: T | null; matches: T[] }>,
      React.MutableRefObject<Nullable<HTMLInputElement>>,
      Optional<React.MutableRefObject<Nullable<Element>>>,
      boolean | undefined,
      React.Dispatch<React.SetStateAction<boolean>>,
      AutocompleteProps<T>["onChange"],
      AutocompleteProps<T>["onSelect"],
      (item: Nullable<T>) => void,
      (item: T) => string
    ],
    [e]: [KeyboardEvent]
  ) => {
    if (["ArrowDown", "ArrowUp"].includes(e.key)) {
      e.preventDefault();
      const { matches: _m, selectedItem: _si } = selectionRef.current;
      const selectedItemIdx = _m.findIndex((item) => item === _si);
      if (e.key === "ArrowDown") {
        if (selectedItemIdx === _m.length - 1) return false;
        setSelectedItemAndRef(_m[selectedItemIdx + 1]);
      }
      if (e.key === "ArrowUp") {
        if (selectedItemIdx === 0) return false;
        setSelectedItemAndRef(_m[selectedItemIdx - 1]);
      }
    } else if (
      ["Tab", "Enter"]
        .concat(!disableSelectBySpace ? ["Space"] : [])
        .includes(e.key)
    ) {
      if (selectionRef.current.selectedItem === null) {
        inputRef.current?.blur();
        setHasFocus(false);
        return false;
      }
      onChange && onChange(getItemValue(selectionRef.current.selectedItem));
      onSelect(
        getItemValue(selectionRef.current.selectedItem),
        selectionRef.current.selectedItem
      );
      if (["Enter", "Space"].includes(e.key)) {
        // @ts-ignore (I'm checking for presence before calling)
        nextElementRef?.current?.focus && nextElementRef?.current?.focus();
        // todo: browser security prevents simulating 'Tab' for next element, must solve by someEl.focus()
        // inputRef.current.dispatchEvent(new KeyboardEvent('keypress',{'code':'Tab'}));
        e.preventDefault(); // ??
      }
      inputRef.current?.blur();
      setHasFocus(false);
    } else if (["Escape"].includes(e.key)) {
      inputRef.current?.blur();
      setHasFocus(false);
    }
    return false;
  };
}

function AutocompleteView<T>({
  hasFocus,
  setHasFocus,
  ...props
}: AutocompleteProps<T>): ReactElement<HTMLElement> {
  const autoScrollOffset = props.autoScrollOffset ?? 0;
  const isMobile = useMediaQuery("mobile-only");
  const ownInputRef = React.useRef(null as Nullable<HTMLInputElement>);
  const inputRef = props.inputRef || ownInputRef;
  const keyDownListenerRef = React.useRef(
    null as Nullable<(...args: [KeyboardEvent]) => boolean>
  );
  const dropdownRef = React.useRef(null as Nullable<HTMLElement>);
  const selectionRef = React.useRef({
    matches: [] as T[],
    selectedItem: null as Nullable<T>,
  });

  const [selectedItem, setSelectedItem] = React.useState(null as Nullable<T>);
  const [matches, setMatches] = React.useState([] as T[]);

  const renderRow = props.renderRow || renderRowDefault;
  const getItemValue = props.getItemValue || (R.identity as (i: T) => string);
  const checkItemMatch = props.checkItemMatch || checkItemMatchDefault;

  const setSelectedItemAndRef = React.useCallback(
    (item: Nullable<T>) => {
      setSelectedItem(item);
      selectionRef.current.selectedItem = item;
    },
    [setSelectedItem, selectionRef]
  );

  const filteredItems = React.useMemo(() => {
    const optionalFilterItemFn = props.filterItems;
    return !optionalFilterItemFn
      ? props.items
      : props.items.filter((chkItem) =>
          optionalFilterItemFn(chkItem, props.value)
        );
  }, [props.items, props.filterItems, props.value]);
  const sortedItems = React.useMemo(
    () =>
      !props.sortItems ? filteredItems : filteredItems.sort(props.sortItems),
    [filteredItems, props.sortItems]
  );

  // * When typed value changes, update matches
  React.useLayoutEffect(() => {
    setMatches(
      sortedItems.filter((item) =>
        checkItemMatch(item, props.value, getItemValue)
      )
    );
  }, [props.value, checkItemMatch, getItemValue]);

  // * When matches update, auto-select the first item, and update ref value
  React.useLayoutEffect(() => {
    setSelectedItemAndRef(matches.length ? matches[0] : null);
    selectionRef.current.matches = matches;
  }, [matches, selectionRef, setSelectedItemAndRef]);

  React.useLayoutEffect(
    function scrollToLatestMatch() {
      const dropdownEle = dropdownRef.current;
      if (
        !(
          hasFocus &&
          dropdownEle &&
          // @ts-ignore (no harm in trying)
          dropdownEle.scrollTo &&
          // @ts-ignore (no harm in trying)
          dropdownEle.getElementsByClassName &&
          matches &&
          matches.length
        )
      )
        return;
      const matchEles: HTMLCollectionOf<Element> =
        dropdownEle.getElementsByClassName(css["--match"]);
      const dropdownHeight = dropdownEle.offsetHeight;
      const dropdownScrolled = dropdownEle.scrollTop;
      // @ts-ignore (blatent lie, offsetTop does exist on Element)
      const matchOffset = matchEles[0]?.offsetTop;
      // @ts-ignore (blatent lie)
      const matchHeight = matchEles[0]?.offsetHeight;
      if (
        !matchEles?.length ||
        (matchOffset < dropdownHeight - matchHeight &&
          dropdownScrolled < matchOffset)
      )
        return;
      dropdownEle.scrollTo(0, matchOffset);
    },
    [hasFocus, matches, dropdownRef]
  );

  React.useLayoutEffect(
    function ensureSelectedItemIsInView() {
      const dropdownEle = dropdownRef.current;
      if (
        !(
          hasFocus &&
          dropdownEle &&
          // @ts-ignore (no harm in trying)
          dropdownEle.scrollTo &&
          dropdownEle.getElementsByClassName
        )
      )
        return;
      const selectedItemIdx = indexOf(selectedItem, props.items);
      if (selectedItemIdx === null) return;

      const dropdownHeight = dropdownEle.offsetHeight;
      const dropdownScrolled = dropdownEle.scrollTop;

      const selectedItemEle = dropdownEle.children[selectedItemIdx];
      // @ts-ignore (blatent lie, offsetTop does exist on Element)
      const selectedOffset = selectedItemEle?.offsetTop;
      // @ts-ignore (blatent lie)
      const selectedHeight = selectedItemEle?.offsetHeight;
      if (selectedOffset < dropdownScrolled) {
        dropdownEle.scrollTo(0, selectedOffset);
      } else if (
        selectedOffset + selectedHeight >
        dropdownScrolled + dropdownHeight
      ) {
        dropdownEle.scrollTo(
          0,
          selectedOffset - (dropdownHeight - selectedHeight)
        );
      }
    },
    [hasFocus, dropdownRef, selectedItem, props.items, props.getItemValue]
  );

  const onSelectGate = React.useCallback(
    (val: string, item?: T) => {
      if (!item && !props.allowFreeEntry) {
        if (selectionRef.current.selectedItem) {
          const selectedVal = getItemValue(selectionRef.current.selectedItem);
          props.onChange && props.onChange(selectedVal);
          props.onSelect(selectedVal, selectionRef.current.selectedItem);
          return;
        }
        props.onChange && props.onChange(props.revertValue || "");
        props.onSelect(props.revertValue || "", undefined);
        return;
      }
      props.onSelect(val, item);
    },
    [
      props.onSelect,
      props.onChange,
      props.revertValue,
      selectionRef,
      getItemValue,
    ]
  );

  const onKeyDown = useDependentCallback(getKeyDownHandler<T>(), [
    selectionRef,
    inputRef,
    props.nextElementRef,
    props.disableSelectBySpace,
    setHasFocus,
    props.onChange,
    onSelectGate,
    setSelectedItemAndRef,
    getItemValue,
  ]);

  // * Manage onkeydown listeners
  const onFocus = React.useCallback(
    (e?: FocusEvent<HTMLInputElement>) => {
      setHasFocus(true);
      inputRef.current?.select();
      inputRef.current?.addEventListener("keydown", onKeyDown, false);
      keyDownListenerRef.current = onKeyDown;
      setMatches(sortedItems);
      if (props.inputProps?.onFocus) {
        props.inputProps?.onFocus(e);
      }
    },
    [
      props.inputProps?.onFocus,
      sortedItems,
      inputRef,
      setHasFocus,
      onKeyDown,
      keyDownListenerRef,
    ]
  );

  // * When opening dropdown, remove any previous selectedItem
  React.useLayoutEffect(() => {
    if (hasFocus) setSelectedItemAndRef(null);
  }, [hasFocus]);

  React.useLayoutEffect(
    function scrollToDefaultScrolledItemOnOpen() {
      const dropdownEle = dropdownRef.current;
      if (
        !(
          hasFocus &&
          !props.value &&
          notUndefined(props.defaultScrolledItem) &&
          dropdownEle &&
          // @ts-ignore (no harm in trying)
          dropdownEle.scrollTo &&
          dropdownEle.getElementsByClassName
        )
      ) {
        return;
      }
      // todo: look for selectedItem first, only use default as fallback
      const defaultScrolledItemIdx = indexOf(
        props.defaultScrolledItem,
        props.items
      );
      if (defaultScrolledItemIdx === null) return;

      const dropdownHeight = dropdownEle.offsetHeight;
      const dropdownScrolled = dropdownEle.scrollTop;

      const scrollToItemEle = dropdownEle.children[defaultScrolledItemIdx];
      // @ts-ignore (blatent lie, offsetTop does exist on Element)
      const scrollToOffset = scrollToItemEle.offsetTop;
      // @ts-ignore (blatent lie)
      const scrollToHeight = scrollToItemEle.offsetHeight;
      if (scrollToOffset < dropdownScrolled) {
        dropdownEle.scrollTo(0, scrollToOffset);
      } else if (
        scrollToOffset + scrollToHeight >
        dropdownScrolled + dropdownHeight
      ) {
        dropdownEle.scrollTo(0, scrollToOffset - dropdownHeight / 2);
      }
    },
    [hasFocus, props.value, props.defaultScrolledItem]
  );

  // Scroll input into view
  React.useLayoutEffect(() => {
    if (isMobile && hasFocus) {
      const { current } = inputRef;
      if (!current || !window) return;
      window.scrollTo(
        0,
        current.getBoundingClientRect().top +
          window.scrollY -
          AUTO_SCROLL_OFFSET_CONST -
          autoScrollOffset
      );
    }
  }, [autoScrollOffset, hasFocus, isMobile]);

  const getItemFromValue = React.useCallback(
    (val: string) => props.items.find((item) => val === getItemValue(item)),
    [props.items]
  );
  const callOnSelectOnBlur = props.allowFreeEntry || false;
  const onBlur = React.useCallback(() => {
    // Timeout to allow mouseDown action to happen?
    // todo: Check arguments[0] (event) for target to see if it lies inside of the current Autocomplete dropdown
    setTimeout(() => {
      // toconsider: could use inputRef current value instead of depending on props.value
      onSelectGate(props.value, getItemFromValue(props.value));
      if (!FORCE_STAY_OPEN) setHasFocus(false);
      keyDownListenerRef.current &&
        inputRef.current?.removeEventListener(
          "keydown",
          keyDownListenerRef.current,
          false
        );
    }, 1);
  }, [
    props.value,
    setHasFocus,
    inputRef,
    onKeyDown,
    callOnSelectOnBlur,
    onSelectGate,
    FORCE_STAY_OPEN,
  ]);

  const onItemHover = React.useCallback(
    (item: T) => {
      setSelectedItemAndRef(item);
    },
    [selectionRef]
  );

  const inputProps = {
    placeholder: props.placeholder,
    value: props.displayValue || props.value,
    onChange: props.onChange,
    tabIndex: props.tabIndex,
    ...props.inputProps,
    className: css["input-ctnr"],
    inputClassName: [
      css.input,
      !props.allowFreeEntry && css["--no-free-entry"],
      clx(props.inputProps?.inputClassName || ""),
    ],
    noTypoStylesOnInput: props.noTypoStylesOnInput,
  };

  return (
    <div
      className={clx(
        R.flatten([
          props.className,
          css.autocomplete,
          !props.allowFreeEntry && css["--no-free-entry"],
          sortedItems.length && css["--has-options"],
          (props.hideDropdownNotch || props.inputProps?.disabled) &&
            css["--hide-notch"],
          hasFocus && css["--has-focus"],
        ]) as Optional<string>[]
      )}
      onBlur={onBlur}
    >
      <Input
        autoComplete="off"
        {...inputProps}
        {...{
          inputRef,
          onFocus,
        }}
      />
      {!hasFocus || !sortedItems.length ? null : (
        <div
          className={clx(
            combineClassNames(
              [
                css.dropdown,
                props.position === "up"
                  ? css["--direction-up"]
                  : props.position === "middle"
                  ? css["--direction-middle"]
                  : css["--direction-down"],
                css["--default-dropdown"],
              ],
              props.dropdownClassName
            )
          )}
        >
          {props.header || null}
          <div
            className={css["dropdown-inner"]}
            ref={(inst) => (dropdownRef.current = inst)}
          >
            {sortedItems.map((item: T, i: number) =>
              renderRow(
                {
                  key: i,
                  onMouseDown: () => {
                    props.onChange && props.onChange(getItemValue(item));
                    onSelectGate(getItemValue(item), item);
                  },
                  onMouseMove: () => onItemHover(item),
                },
                item,
                checkItemMatch(item, props.value, getItemValue),
                selectedItem === item,
                props.value,
                getItemValue
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Autocomplete<T>(props: AutocompletePublicProps<T>) {
  const [hasFocus, setHasFocus] = React.useState(false);
  const isMobile = useMediaQuery("mobile-only");
  const showMobileSelect =
    isMobile && !props.allowFreeEntry && !props.forceCustomDropdownOnMobile;
  if (showMobileSelect) {
    return (
      <SelectAutocomplete
        hasFocus={hasFocus}
        setHasFocus={setHasFocus}
        {...props}
      />
    );
  }
  return (
    <AutocompleteView
      hasFocus={hasFocus}
      setHasFocus={setHasFocus}
      {...props}
    />
  );
}

export default Autocomplete;
