import {
  Box,
  Flex,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderMark,
  RangeSliderThumb,
  RangeSliderTrack,
  Stack,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { type NumericFilterInput } from "src/server/router/scanner";

const Selectors: React.FC<Props> = ({
  delta,
  setDelta,
  daysToExpiration,
  setDaysToExpiration,
}) => {
  return (
    <Stack gap="3" my="5">
      <Flex gap="3" align="center">
        <Text>Delta</Text>
        <Box w="64">
          <RangeSlider
            defaultValue={[delta.gte ?? 0, delta.lte ?? 1]}
            onChange={(range) => {
              setDelta({ gte: range[0], lte: range[1] });
            }}
            step={0.01}
            max={1}
          >
            <RangeSliderTrack>
              <RangeSliderFilledTrack bg="button.orange.700" />
            </RangeSliderTrack>
            <RangeSliderMark value={delta.gte || 0}>
              {delta.gte || 0}
            </RangeSliderMark>
            <RangeSliderMark value={delta.lte || 1}>
              {delta.lte || 1}
            </RangeSliderMark>
            <RangeSliderThumb index={0} />
            <RangeSliderThumb index={1} />
          </RangeSlider>
        </Box>
      </Flex>
      <Flex gap="3" align="center">
        <Text>Days To Expiration</Text>
        <Box w="64">
          <RangeSlider
            defaultValue={[
              daysToExpiration.gte ?? 0,
              daysToExpiration.lte ?? 100,
            ]}
            onChange={(range) => {
              setDaysToExpiration({ gte: range[0], lte: range[1] });
            }}
            step={1}
            max={100}
          >
            <RangeSliderTrack>
              <RangeSliderFilledTrack bg="button.orange.700" />
            </RangeSliderTrack>
            <RangeSliderMark value={daysToExpiration.gte || 0}>
              {daysToExpiration.gte || 0}
            </RangeSliderMark>
            <RangeSliderMark value={daysToExpiration.lte || 100}>
              {daysToExpiration.lte || 1}
            </RangeSliderMark>
            <RangeSliderThumb index={0} />
            <RangeSliderThumb index={1} />
          </RangeSlider>
        </Box>
      </Flex>
    </Stack>
  );
};

type Props = {
  delta: NumericFilterInput;
  setDelta: React.Dispatch<React.SetStateAction<NumericFilterInput>>;
  daysToExpiration: NumericFilterInput;
  setDaysToExpiration: React.Dispatch<React.SetStateAction<NumericFilterInput>>;
};

export default Selectors;
