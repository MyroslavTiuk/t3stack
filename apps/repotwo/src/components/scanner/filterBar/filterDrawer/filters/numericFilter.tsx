import React, { useRef, useState } from "react";
import {
  Text,
  Select,
  NumberInput,
  NumberInputField,
  FormLabel,
} from "@chakra-ui/react";
import { emptyNumericFilterInput } from "../../filterBar";
import {
  type StockFilterEntry,
  type TradeFilterEntry,
} from "../../filters.data";
import Filter from "./filter";
import { type NumericFilterInput } from "src/server/router/scanner";

const NumericFilter: React.FC<Props> = ({
  filterState,
  setFilter,
  filterData,
  minValue,
  maxValue,
}) => {
  const firstInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLSelectElement>(null);
  const initialDirection = getInitialDirection(
    filterState.gte,
    filterState.lte
  );
  const [direction, setDirection] = useState(initialDirection);
  const [updatedFilter, setUpdatedFilter] =
    useState<NumericFilterInput>(filterState);
  function handleDirectionChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setDirection(event.target.selectedOptions[0].value as Direction);
    setUpdatedFilter({ gte: undefined, lte: undefined });
    firstInputRef.current?.focus();
  }

  function handlePriceChange(position: "low" | "high") {
    return (_: string, valueAsNumber: number) => {
      const price = isNaN(valueAsNumber) ? undefined : valueAsNumber;
      if (direction === Direction.Between && position === "high") {
        setUpdatedFilter((prev) => ({ ...prev, lte: price }));
      } else if (direction === Direction.Between && position === "low") {
        setUpdatedFilter((prev) => ({ ...prev, gte: price }));
      } else if (direction === Direction.Below) {
        setUpdatedFilter({ gte: undefined, lte: price });
      } else if (direction === Direction.Above) {
        setUpdatedFilter({ gte: price, lte: undefined });
      }
    };
  }

  function commitFilterChange() {
    setFilter(updatedFilter);
  }

  function handleUnset() {
    setFilter(emptyNumericFilterInput);
  }

  const { gte, lte } = filterState;
  const format = filterData.format ?? ((param: any) => param);

  return (
    <Filter
      name={filterData.name}
      isFilterSet={isInputValid(gte) || isInputValid(lte)}
      onSubmit={commitFilterChange}
      handleUnset={handleUnset}
      TextContent={
        <>
          <Text color="button.orange.700" mr="1">
            {initialDirection}
          </Text>
          {gte !== undefined && <Text mr="1">{format(gte)}</Text>}
          {initialDirection === Direction.Between && <Text mr="1"> and </Text>}
          {lte !== undefined && <Text>{format(lte)}</Text>}
        </>
      }
      FormContent={
        <>
          <Select
            color="button.orange.700"
            onChange={handleDirectionChange}
            minW="32"
            defaultValue={direction}
            ref={dropdownRef}
          >
            <option value={Direction.Above}>{"> Above"}</option>
            <option value={Direction.Below}>{"< Below"}</option>
            <option value={Direction.Between}>{"<> Between"}</option>
          </Select>
          <NumberInput
            min={minValue}
            max={maxValue}
            ref={firstInputRef}
            value={
              direction === Direction.Below
                ? inputDisplayValue(updatedFilter.lte)
                : inputDisplayValue(updatedFilter.gte)
            }
            onChange={handlePriceChange(
              direction === Direction.Below ? "high" : "low"
            )}
          >
            <NumberInputField />
            {direction === Direction.Between && <FormLabel>Min</FormLabel>}
          </NumberInput>
          {direction === Direction.Between && (
            <NumberInput
              min={minValue}
              max={maxValue}
              ref={firstInputRef}
              value={inputDisplayValue(updatedFilter.lte)}
              onChange={handlePriceChange("high")}
            >
              <NumberInputField />
              {<FormLabel>Max</FormLabel>}
            </NumberInput>
          )}
        </>
      }
      dropdownRef={dropdownRef}
    />
  );
};

export function getInitialDirection(
  gte: number | undefined,
  lte: number | undefined
) {
  if (isInputValid(gte) && isInputValid(lte)) {
    return Direction.Between;
  }
  if (isInputValid(lte)) {
    return Direction.Below;
  }
  return Direction.Above;
}

export function isInputValid(value: string | number | undefined) {
  if (value === undefined || isNaN(Number(value))) return false;
  return true;
}

export function inputDisplayValue(value: string | number | undefined) {
  return isInputValid(value) ? String(value) : "";
}

export enum Direction {
  Above = "Above",
  Below = "Below",
  Between = "Between",
}

type Props = {
  filterState: NumericFilterInput;
  setFilter: (updatedFilter: NumericFilterInput) => void;
  filterData: StockFilterEntry | TradeFilterEntry;
  minValue?: number;
  maxValue?: number;
};

export default NumericFilter;
