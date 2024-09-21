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
  daysToProfitCalculation: number;
  setDaysToProfitCalculation: React.Dispatch<React.SetStateAction<number>>;
  maxDays: number;
};

const DaySlider: React.FC<Props> = ({
  daysToProfitCalculation,
  setDaysToProfitCalculation,
  maxDays,
}) => {
  const bg = useColorModeValue("grey.400", "cards.700");

  return (
    <Stack>
      <Text>Date</Text>
      <Flex align="center">
        <Circle size={4} bg={bg} position="relative" right={-2} />
        <Slider
          aria-label="date"
          defaultValue={maxDays}
          onChange={(val) => {
            setDaysToProfitCalculation(val);
          }}
          min={1}
          max={maxDays}
        >
          <SliderMark
            value={daysToProfitCalculation}
            textAlign="center"
            bg={bg}
            color="neutral.200"
            mt={2}
            ml={-10}
            w={20}
          >
            {daysToProfitCalculation} days
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

export default DaySlider;
