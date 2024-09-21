import React from "react";

import {
  Text,
  useColorModeValue,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
  Flex,
  Circle,
  Stack,
} from "@chakra-ui/react";

type Props = {
  xAxisPercent: number;
  setXAxisPercent: (percent: number) => void;
};

const PriceRangeSlider: React.FC<Props> = ({
  xAxisPercent,
  setXAxisPercent,
}) => {
  const bg = useColorModeValue("grey.400", "cards.700");

  return (
    <Stack>
      <Text>Price Range</Text>
      <Flex align="center">
        <Circle size={4} bg={bg} position="relative" right={-2} />
        <Slider
          aria-label="price-range"
          defaultValue={xAxisPercent}
          onChange={(val) => {
            setXAxisPercent(val);
          }}
          min={1}
          max={100}
        >
          <SliderMark
            value={xAxisPercent}
            textAlign="center"
            bg={bg}
            color="neutral.200"
            mt={2}
            ml={-6}
            w={12}
          >
            {xAxisPercent}%
          </SliderMark>
          <SliderTrack>
            <SliderFilledTrack bg={bg} />
          </SliderTrack>
          <SliderThumb bg={bg} />
        </Slider>
        <Circle size={4} bg={bg} position="relative" left={-2} />
      </Flex>
    </Stack>
  );
};

export default PriceRangeSlider;
