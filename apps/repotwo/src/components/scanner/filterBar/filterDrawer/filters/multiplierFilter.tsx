import React, { useRef, useState } from "react";
import {
  Text,
  Select,
  NumberInput,
  NumberInputField,
  FormLabel,
} from "@chakra-ui/react";
import {
  type StockFilterEntry,
  type TradeFilterEntry,
} from "../../filters.data";
import Filter from "./filter";
import {
  getInitialDirection,
  Direction,
  inputDisplayValue,
  isInputValid,
} from "./numericFilter";
import {
  Multipliers,
  MultiplierValues,
  formatWithMultiplier,
  getLargestMultiplier,
} from "@utils/multipliers";
import { type NumericFilterInput } from "src/server/router/scanner";
import { emptyNumericFilterInput } from "../../filterBar";

const MultiplierFilter: React.FC<Props> = ({
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
  const [multiplierVal, setMultiplierVal] = useState<Multipliers>(
    getInitialMultiplier(filterState)
  );
  const [updatedFilter, setUpdatedFilter] = useState<NumericFilterInput>(
    getInitialFilterValues(filterState)
  );

  function handleDirectionChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setDirection(event.target.selectedOptions[0].value as Direction);
    setUpdatedFilter({ gte: undefined, lte: undefined });
    firstInputRef.current?.focus();
  }

  function handleMultiplierChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setMultiplierVal(event.target.selectedOptions[0].value as Multipliers);
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
    const convertedFilter = {
      gte: isInputValid(updatedFilter.gte)
        ? updatedFilter.gte! * MultiplierValues[multiplierVal]
        : undefined,
      lte: isInputValid(updatedFilter.lte)
        ? updatedFilter.lte! * MultiplierValues[multiplierVal]
        : undefined,
    };
    setFilter(convertedFilter);
  }

  function handleUnset() {
    setFilter(emptyNumericFilterInput);
  }

  const { gte, lte } = filterState;
  return (
    <Filter
      name={filterData.name}
      isFilterSet={isInputValid(gte) || isInputValid(lte)}
      onSubmit={commitFilterChange}
      handleUnset={handleUnset}
      popOverWidth={400}
      TextContent={
        <>
          <Text color="button.orange.700" mr="1">
            {initialDirection}
          </Text>
          {gte !== undefined && (
            <Text mr="1">${formatWithMultiplier(gte)}</Text>
          )}
          {initialDirection === Direction.Between && <Text mr="1"> and </Text>}
          {lte !== undefined && <Text>{formatWithMultiplier(lte)}</Text>}
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
            aria-label="Value"
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
              // @ts-ignore
              placeholder="Max"
              onChange={handlePriceChange("high")}
              aria-label="Max"
            >
              <NumberInputField />
              {direction === Direction.Between && <FormLabel>Max</FormLabel>}
            </NumberInput>
          )}
          <Select
            color="button.orange.700"
            onChange={handleMultiplierChange}
            defaultValue={multiplierVal}
          >
            <option value={Multipliers.M}>{Multipliers.M}</option>
            <option value={Multipliers.B}>{Multipliers.B}</option>
            <option value={Multipliers.T}>{Multipliers.T}</option>
          </Select>
        </>
      }
      dropdownRef={dropdownRef}
    />
  );
};

function getInitialMultiplier(filterState: NumericFilterInput) {
  return (
    getLargestMultiplier(filterState.gte) ||
    getLargestMultiplier(filterState.lte) ||
    Multipliers.B
  );
}

function getInitialFilterValues(filterState: NumericFilterInput) {
  const multiplier = getInitialMultiplier(filterState);
  return {
    gte: filterState.gte
      ? filterState.gte / MultiplierValues[multiplier]
      : undefined,
    lte: filterState.lte
      ? filterState.lte / MultiplierValues[multiplier]
      : undefined,
  };
}

type Props = {
  filterState: NumericFilterInput;
  setFilter: (updatedFilter: NumericFilterInput) => void;
  filterData: StockFilterEntry | TradeFilterEntry;
  minValue?: number;
  maxValue?: number;
};

export default MultiplierFilter;
