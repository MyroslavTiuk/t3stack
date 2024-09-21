import React from "react";
import { type SliderItem } from "react-compound-slider";
import Box from "../Box";

import css from "./Slider.module.scss";
import T from "../Typo";

export interface TickProps {
  tick: SliderItem;
  count: number;
  // eslint-disable-next-line @typescript-eslint/ban-types
  format: Function;
  n: number;
  disabled?: boolean;
  valueFormatter?: (value: number) => void;
  small?: boolean;
}
const Tick: React.FC<TickProps> = ({
  tick,
  count,
  // format,
  n,
  disabled,
  valueFormatter,
  small,
}) => {
  return disabled && ![0, count - 1].includes(n) ? null : (
    <>
      <Box
        className={css.tick_mark}
        style={{
          left: `${n === count - 1 && tick.value === 0 ? 100 : tick.percent}%`,
        }}
      />
      <Box
        className={css.tick_label}
        style={{
          marginLeft: `${-(100 / count) / 2}%`,
          width: `${100 / count}%`,
          left: `${n === count - 1 && tick.value === 0 ? 100 : tick.percent}%`,
        }}
      >
        <T
          content-detail={!small}
          anemic={disabled}
          className={[css._text, disabled && css["--disabled"]]}
        >
          {(valueFormatter ? valueFormatter(tick.value) : tick.value) || null}
        </T>
      </Box>
    </>
  );
};

export default Tick;
