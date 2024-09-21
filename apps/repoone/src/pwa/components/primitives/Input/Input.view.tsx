import {
  type ChangeEvent,
  type FC,
  type ReactElement,
  useCallback,
  type FocusEvent,
} from "react";
import React from "react";

import { type Optional } from "opc-types/lib/util/Optional";
import Box from "../Box";
import { type InputProps } from "./Input.props";

import css from "./Input.module.scss";
import clx from "../../../../utils/Html/clx";
import T from "../Typo";
import { HIGHLIGHT } from "../../../../consts/HIGHLIGHT";

const DEBOUNCE_TIMEOUT_MS = 500;

const Input: FC<InputProps> = ({
  inputRef,
  className,
  inputClassName,
  onChange,
  onBlur,
  onSet,
  inline,
  icon,
  preIcon,
  inputId,
  prefix,
  prefixWidthRem,
  error,
  noTypoStylesOnInput,
  debounce,
  noStyle,
  highlight,
  noTrack,
  appearDisabled,
  ...inputProps
}: InputProps): ReactElement<"div"> => {
  const [debounceTimerId, setDebounceTimerId] =
    React.useState<Optional<number>>(undefined);
  const classNames = (className && clx(className)) || undefined;
  const inputClassNames = (inputClassName && clx(inputClassName)) || undefined;

  const onSetCb = useCallback(
    (e: FocusEvent<HTMLInputElement>) => {
      onSet && onSet(e.target.value);
      if (!onSet) {
        onBlur && onBlur(e.target.value, e);
      }
    },
    [onBlur, onSet]
  );
  const onBlurCb = useCallback(
    (e: FocusEvent<HTMLInputElement>) => {
      onBlur && onBlur(e.target.value, e);
      onSet && onSet(e.target.value);
    },
    [onBlur, onSet]
  );

  const onChangeCb = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onChange && onChange(e.target.value, e);
      if (debounce) {
        e.persist();
        // @ts-ignore (event type is a bit different)
        setDebounceTimerId(setTimeout(() => onSetCb(e), DEBOUNCE_TIMEOUT_MS));
      }
    },
    [onChange, debounce, onSetCb, setDebounceTimerId]
  );
  React.useEffect(() => () => clearTimeout(debounceTimerId), [debounceTimerId]);

  const outlineStyle = true;

  const showAsDisabled = appearDisabled || inputProps.disabled;

  return (
    <>
      <Box
        className={[
          "--sec-center flex",
          classNames,
          css["input-ctnr"],
          !inline && css["--width-full"],
          // filled && css['--filled'],
          // underline && css['--underline'],
          outlineStyle && css["--outlined"],
          showAsDisabled && css["--disabled"],
        ]}
      >
        {prefix && (
          <T content-pragmatic anemic className={css.prefix}>
            {prefix}
          </T>
        )}
        {!preIcon ? null : (
          <Box className={[css["icon-ctnr"], css["--pre"]]}>{preIcon}</Box>
        )}
        <input
          ref={inputRef}
          type="text"
          {...(!noTrack ? { "data-hj-allow": true } : {})}
          className={clx([
            "flex-1 !pl-6",
            inputClassNames,
            css["input"],
            (outlineStyle || highlight === HIGHLIGHT.NO_HIGHLIGHT) &&
              css["--no-highlight"],
            highlight === HIGHLIGHT.HIGHLIGHT && css["--highlighted"],
            highlight === HIGHLIGHT.WARNING && css["--highlighted-warning"],
            !noTypoStylesOnInput && css["--with-typo"],
            !prefix ? css["--no-prefix"] : "",
            !showAsDisabled && !noStyle && css["--enabled"],
            showAsDisabled && !noStyle && css["--disabled"],
          ])}
          style={
            prefixWidthRem
              ? {
                  paddingLeft: `${prefixWidthRem}rem`,
                }
              : {}
          }
          onChange={onChangeCb}
          onBlur={onBlurCb}
          id={inputId}
          {...inputProps}
        />
        {!icon ? null : <Box className={css["icon-ctnr"]}>{icon}</Box>}
      </Box>
      {error && (
        <T content-detail anemic className={["text-error", css["error-text"]]}>
          {error}
        </T>
      )}
    </>
  );
};

export default React.memo(Input);
