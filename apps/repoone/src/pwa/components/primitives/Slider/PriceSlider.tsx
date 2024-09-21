import React, { type FC } from "react";

import * as RCSlider from "react-compound-slider";

import Box from "../Box";
import T from "../Typo";
import formatPrice from "../../../../utils/String/formatPrice/formatPrice";

import css from "./Slider.module.scss";
import Rail from "./Rail";
import Handle from "./Handle";
import Track from "./Track";
import Tick, { type TickProps } from "./Tick";

type Props = Omit<
  RCSlider.SliderProps,
  "children" | "onChange" | "onUpdate"
> & {
  onChange: (val: number) => void;
  onUpdate?: (val: number) => void;
  showTag?: boolean;
  reverse?: boolean;
  fillTrack?: boolean;
  tickProps?: Partial<TickProps>;
  ticksContainerProps?: Omit<RCSlider.TicksProps, "children">;
  showMinus?: boolean;
};

const PriceSlider: FC<Props> = ({
  fillTrack,
  ...props
}: Props): ReturnType<typeof Box> => {
  const [localVal, setLocalVal] = React.useState(props.values);
  const onChange = React.useCallback(
    (vals: readonly number[]) => {
      if (!isNaN(vals[0]) && localVal[0] === vals[0]) {
        props.onChange(vals[0] || 0);
      }
    },
    [localVal]
  );
  const onUpdate = React.useCallback(
    (vals: readonly number[]) => {
      if (props.onUpdate && !isNaN(vals[0])) {
        props.onUpdate(vals[0]);
      }
      setLocalVal(vals);
    },
    [setLocalVal, props.onUpdate]
  );
  React.useEffect(() => {
    setLocalVal(props.values);
  }, [props.values]);
  const noVals =
    (props.domain?.length || 0) < 2 ||
    (props.domain?.[1] || 0) <= (props.domain?.[0] || 0);

  const { domain } = props;
  if (!domain) return null;

  const constBMAprops = {
    "no-weight": true,
    anemic: noVals,
    clickable: !noVals,
  };
  const bidJsx = (
    <T
      key="bid"
      {...constBMAprops}
      className={[
        props.reverse ? css._ask : css._bid,
        css._bmaLabel,
        noVals && css["--disabled"],
      ]}
      onClick={() => {
        if (props.ticksContainerProps?.values?.[0]) {
          setLocalVal([props.ticksContainerProps?.values[0]]);
          props.onChange(props.ticksContainerProps?.values[0]);
        }
      }}
    >
      Bid
    </T>
  );
  const { values: tickVals } = props.ticksContainerProps || {};
  const showMid = tickVals && ![tickVals[0], tickVals[2]].includes(tickVals[1]);
  const midPct =
    tickVals &&
    ((tickVals[1] - tickVals[0]) / (tickVals[2] - tickVals[0])) * 100;
  const midJsx =
    !showMid || !midPct ? null : (
      <T
        key="mid"
        {...constBMAprops}
        style={{ left: `${props.reverse ? 100 - midPct : midPct}%` }}
        className={[css._mid, css._bmaLabel, noVals && css["--disabled"]]}
        onClick={() => {
          if (props.ticksContainerProps?.values?.[1]) {
            setLocalVal([props.ticksContainerProps?.values[1]]);
            props.onChange(props.ticksContainerProps?.values[1]);
          }
        }}
      >
        Mid
      </T>
    );
  const askJsx = (
    <T
      key="ask"
      {...constBMAprops}
      className={[
        props.reverse ? css._bid : css._ask,
        css._bmaLabel,
        noVals && css["--disabled"],
      ]}
      onClick={() => {
        if (props.ticksContainerProps?.values?.[2]) {
          setLocalVal([props.ticksContainerProps?.values[2]]);
          props.onChange(props.ticksContainerProps?.values[2]);
        }
      }}
    >
      Ask
    </T>
  );
  return (
    <Box className={[css.sliderContainer, css["--short"]]}>
      <Box className={css.sliderInner}>
        <RCSlider.Slider {...props} onChange={onChange} onUpdate={onUpdate}>
          <RCSlider.Rail>
            {({ getRailProps }) => <Rail getRailProps={getRailProps} />}
          </RCSlider.Rail>
          <RCSlider.Handles>
            {({ handles, getHandleProps }) => (
              <Box className={css.handlesHolder}>
                {handles.map((handle) => (
                  <Handle
                    key={handle.id}
                    handle={handle}
                    getHandleProps={getHandleProps}
                    domain={domain}
                    valueFormatter={(value: number) =>
                      formatPrice(value, {
                        forceShowCents: true,
                        hideMinus: !props.showMinus,
                      })
                    }
                    showTag={props.showTag}
                  />
                ))}
              </Box>
            )}
          </RCSlider.Handles>
          <RCSlider.Tracks right={false}>
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
          </RCSlider.Tracks>
          <RCSlider.Ticks count={3} {...props.ticksContainerProps}>
            {({ ticks }) => {
              const valueFormatter = (value: number) =>
                formatPrice(value, {
                  forceShowCents: true,
                  hideMinus: !props.showMinus,
                });
              return (
                <Box className={css.ticksHolder}>
                  {ticks.map((tick, i) => (
                    <Tick
                      key={`${i}${tick.id}`}
                      tick={tick}
                      count={3}
                      format={(x: number) => x}
                      n={i}
                      disabled={noVals}
                      {...props.tickProps}
                      valueFormatter={valueFormatter}
                      small
                    />
                  ))}
                </Box>
              );
            }}
          </RCSlider.Ticks>
        </RCSlider.Slider>
        <Box
          flex
          className={[
            "--pri-space-between",
            css.priceLabels,
            "justify-between lg:justify-normal",
          ]}
        >
          {!props.reverse ? [bidJsx, midJsx, askJsx] : [askJsx, midJsx, bidJsx]}
        </Box>
      </Box>
    </Box>
  );
};

export default PriceSlider;
