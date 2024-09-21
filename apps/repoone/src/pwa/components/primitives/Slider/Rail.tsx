import { type GetRailProps } from "react-compound-slider";
import Box from "../Box";

import css from "./Slider.module.scss";

interface SliderRailProps {
  getRailProps: GetRailProps;
}

const Rail = (props: SliderRailProps) => {
  return (
    <>
      <Box className={css.rail_background} {...props.getRailProps()} />
      <Box className={css.rail_visible} />
    </>
  );
};

export default Rail;
