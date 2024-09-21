import React, { useState } from "react";
import {
  Text,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  RangeSliderMark,
} from "@chakra-ui/react";
import {
  type StockFilterEntry,
  type TradeFilterEntry,
} from "../../filters.data";
import Filter from "./filter";
import { type NumericFilterInput } from "src/server/router/scanner";
import { emptyNumericFilterInput } from "../../filterBar";

const RangeFilter: React.FC<Props> = ({
  filterState,
  setFilter,
  filterData,
}) => {
  const [updatedFilter, setUpdatedFilter] =
    useState<NumericFilterInput>(filterState);

  function commitFilterChange() {
    setFilter(updatedFilter);
  }

  function handleUnset() {
    setFilter(emptyNumericFilterInput);
  }

  const { gte, lte } = filterState;
  const format = filterData.format ?? ((param: any) => param);

  const calculateMlMark = (marginLeft: number) => {
    const gteFilter =
      typeof updatedFilter.gte === "number" ? updatedFilter.gte : 0;
    if (updatedFilter.lte) {
      if (updatedFilter.lte - gteFilter <= 12) {
        return marginLeft;
      }
    }

    return -6;
  };

  const gteMlMark = calculateMlMark(-45);

  const lteMlMark = calculateMlMark(0);

  return (
    <Filter
      name={filterData.name}
      isFilterSet={!!gte || !!lte}
      onSubmit={commitFilterChange}
      handleUnset={handleUnset}
      TextContent={
        <>
          <Text color="button.orange.700" mr="1">
            Between
          </Text>
          <Text mr="1">
            {format(gte ?? 0)} and {format(lte ?? 100)}
          </Text>
        </>
      }
      FormContent={
        <>
          <RangeSlider
            defaultValue={[updatedFilter.gte ?? 0, updatedFilter.lte ?? 100]}
            onChange={(range) => {
              setUpdatedFilter({ gte: range[0], lte: range[1] });
            }}
            mx={5}
          >
            <RangeSliderTrack>
              <RangeSliderFilledTrack bg="button.orange.700" />
            </RangeSliderTrack>
            <RangeSliderMark
              value={updatedFilter.gte || 0}
              textAlign="center"
              mt="-8"
              ml={gteMlMark}
              w="12"
            >
              {updatedFilter.gte || 0}%
            </RangeSliderMark>
            <RangeSliderMark
              value={updatedFilter.lte || 100}
              textAlign="center"
              mt="-8"
              ml={lteMlMark}
              w="12"
            >
              {updatedFilter.lte || 100}%
            </RangeSliderMark>
            <RangeSliderThumb index={0} />
            <RangeSliderThumb index={1} />
          </RangeSlider>
        </>
      }
    />
  );
};

type Props = {
  filterState: NumericFilterInput;
  setFilter: (updatedFilter: NumericFilterInput) => void;
  filterData: StockFilterEntry | TradeFilterEntry;
};

export default RangeFilter;
