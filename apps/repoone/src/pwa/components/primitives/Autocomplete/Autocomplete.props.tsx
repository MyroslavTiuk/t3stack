import { type ReactNode, type SetStateAction } from "react";
import type React from "react";
import { type Nullable } from "opc-types/lib/util/Nullable";
import { type InputPublicProps } from "../Input/Input.props";

export interface AutocompletePublicProps<T> {
  items: T[];
  value: string;
  revertValue?: string;
  onChange?: (val: string) => void;
  onSelect: (val: string, item: undefined | T) => void;
  filterItems?: (item: T, value: string) => boolean;
  sortItems?: (itemA: T, itemB: T) => -1 | 0 | 1;
  renderRow?: (
    props: Record<string, any>,
    item: T,
    isMatch: boolean,
    isSelected: boolean,
    value: string,
    getItem: (item: T) => string
  ) => ReactNode;
  renderRowString?: (item: T) => string;
  getItemValue?: (item: T) => string;
  getItemId?: (item: T) => string;
  displayValue?: string;
  checkItemMatch?: (item: T, value: string) => boolean;
  placeholder?: string;
  className?: string | (string | undefined | false)[];
  dropdownClassName?: string | (string | undefined | false)[];
  allowFreeEntry?: boolean;
  forceCustomDropdownOnMobile?: boolean;
  disableSelectBySpace?: boolean;
  noTypoStylesOnInput?: boolean;
  inputRef?: React.MutableRefObject<Nullable<HTMLInputElement>>;
  nextElementRef?: React.MutableRefObject<Nullable<Element>>;
  tabIndex?: number;
  hideDropdownNotch?: boolean;
  inputProps?: Partial<InputPublicProps>;
  header?: ReactNode;
  defaultScrolledItem?: T;
  autoScrollOffset?: number;
  position?: "middle" | "up";
}

export interface AutocompleteCalcedProps {
  hasFocus: boolean;
  setHasFocus: React.Dispatch<SetStateAction<boolean>>;
}

export interface AutocompleteProps<T>
  extends AutocompleteCalcedProps,
    AutocompletePublicProps<T> {}
