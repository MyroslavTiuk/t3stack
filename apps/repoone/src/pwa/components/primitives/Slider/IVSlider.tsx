import React from "react";

import {
  Handles,
  Rail,
  Slider,
  type SliderProps,
  Ticks,
  type TicksProps,
  Tracks,
} from "react-compound-slider";

import Box from "../Box";

import Handle from "./Handle";
import CustomRail from "./Rail";
import css from "./Slider.module.scss";
import Tick, { type TickProps } from "./Tick";
import Track from "./Track";

type Props = Omit<SliderProps, "children" | "onChange" | "onUpdate"> & {
  onChange: (val: number) => void;
  onUpdate: (val: number) => void;
  reverse?: boolean;
  fillTrack?: boolean;
  tickProps?: Partial<TickProps>;
  ticksContainerProps?: Omit<TicksProps, "children">;
};

const valueFormatter = (value: number) => (value !== 0 ? `${value} %` : 0);

export default function IVSlider({
  fillTrack,
  ...props
}: Props): ReturnType<typeof Box> {
  const [localVal, setLocalVal] = React.useState(props.values);
  const onChange = React.useCallback(
    (vals: readonly number[]) => {
      if (!isNaN(vals[0]) && localVal[0] === vals[0]) {
        props.onChange(vals[0] || 0);
      }
    },
    [localVal]
  );
  const onUpdate = React.useCallback((vals: readonly number[]) => {
    setLocalVal(vals);
    props.onUpdate(vals[0]);
  }, []);

  const { domain } = props;
  if (!domain) return null;

  return (
    <Box className={[css.sliderContainer, css.iVSlider]}>
      <Box className={css.sliderInner}>
        <Slider {...props} onChange={onChange} onUpdate={onUpdate}>
          <Rail>
            {({ getRailProps }) => <CustomRail getRailProps={getRailProps} />}
          </Rail>
          <Handles>
            {({ handles, getHandleProps }) => (
              <Box className={css.handlesHolder}>
                {handles.map((handle) => (
                  <Handle
                    key={handle.id}
                    handle={handle}
                    getHandleProps={getHandleProps}
                    domain={domain}
                    valueFormatter={(value) => `${value} %`}
                  />
                ))}
              </Box>
            )}
          </Handles>
          <Tracks left={false} right={false}>
            {({ tracks, getTrackProps }) => (
              <Box className={css.tracksHolder}>
                {tracks.map(({ id, source, target }) => (
                  <Track
                    getTrackProps={getTrackProps}
                    key={id}
                    source={source}
                    target={target}
                    fillTrack={fillTrack}
                  />
                ))}
              </Box>
            )}
          </Tracks>
          <Ticks
            values={[-100, -50, 0, 50, 100]}
            {...props.ticksContainerProps}
          >
            {({ ticks }) => (
              <Box className={css.ticksHolder}>
                {ticks.map((tick, i) => {
                  return (
                    <Tick
                      key={`${i}${tick.id}`}
                      tick={tick}
                      count={4}
                      format={(x: number) => x}
                      n={i}
                      {...props.tickProps}
                      valueFormatter={valueFormatter}
                    />
                  );
                })}
              </Box>
            )}
          </Ticks>
        </Slider>
      </Box>
    </Box>
  );
}
