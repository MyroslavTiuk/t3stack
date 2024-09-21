import { type GetTrackProps, type SliderItem } from "react-compound-slider";
import Box from "../Box";

import css from "./Slider.module.scss";

interface TrackProps {
  source: SliderItem;
  target: SliderItem;
  getTrackProps: GetTrackProps;
  disabled?: boolean;
  fillTrack?: boolean;
}

const Track = ({ source, target, getTrackProps, fillTrack }: TrackProps) => {
  return (
    <Box
      className={[css.track, fillTrack && css["--filled"]]}
      style={{
        left: `${source.percent}%`,
        width: `${target.percent - source.percent}%`,
      }}
      {...getTrackProps()}
    />
  );
};

export default Track;
