import { type ChangeEvent, type FocusEvent, type Ref } from "react";
import type React from "react";
import { type HightlightEnum } from "../../../../consts/HIGHLIGHT";

// import { CompWithChildren } from '../../../types/util/CompWithChildren';

type HTMLInputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

export interface InputPublicProps
  extends Omit<
    HTMLInputProps,
    "className" | "onChange" | "onBlur" | "onFocus"
  > {
  inputRef?: Ref<any>;
  className?: string | (string | undefined | false)[];
  inputClassName?: string | (string | undefined | false)[];
  onChange?: (val: string, evt: ChangeEvent<HTMLInputElement>) => void;
  noTypoStylesOnInput?: boolean;
  onBlur?: (val: string, evt: FocusEvent<HTMLInputElement>) => void;
  onSet?: (val: string) => void;
  onFocus?: (evt?: FocusEvent<HTMLInputElement>) => void;
  inline?: boolean;
  filled?: boolean;
  noUnderline?: boolean;
  icon?: React.ReactNode;
  preIcon?: React.ReactNode;
  inputId?: string;
  prefix?: string;
  prefixWidthRem?: number;
  error?: string;
  debounce?: boolean;
  noStyle?: boolean;
  highlight?: HightlightEnum;
  noTrack?: boolean;
  appearDisabled?: boolean;
}

export type InputProps = InputPublicProps;
