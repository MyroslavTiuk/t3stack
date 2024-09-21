import { type GetHandleProps, type SliderItem } from "react-compound-slider";

import Box from "../Box";

import css from "./Slider.module.scss";
import T from "../Typo";

interface HandleProps {
  getHandleProps: GetHandleProps;
  handle: SliderItem;
  domain: readonly number[];
  disabled?: boolean;
  valueFormatter?: (value: number) => void;
  showTag?: boolean;
}

const Handle = (props: HandleProps) => {
  const hideTag = props.showTag === false;
  return isNaN(props.handle.value) ? null : (
    <>
      <Box
        className={css.handle_controller}
        style={{
          left: `${props.handle.percent}%`,
        }}
        {...props.getHandleProps(props.handle.id)}
      />
      <Box
        className={[
          css.handle_visible,
          props.disabled && css["--disabled"],
          hideTag && css["--small"],
        ]}
        role="slider"
        aria-valuemin={props.domain[0]}
        aria-valuemax={props.domain[1]}
        aria-valuenow={props.handle.value}
        style={{
          left: `${props.handle.percent}%`,
        }}
      >
        {!hideTag && (
          <Box className={css._bubbleMain} pv={1 / 4} ph={1 / 3}>
            <T content-pragmatic className={css._text}>
              {(props.valueFormatter
                ? props.valueFormatter(props.handle.value)
                : props.handle.value) || null}
            </T>
          </Box>
        )}
      </Box>
    </>
  );
};

export default Handle;
