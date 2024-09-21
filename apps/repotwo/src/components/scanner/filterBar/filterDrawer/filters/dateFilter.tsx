import React, { useRef, useState } from "react";
import { Text, Input, Flex, FormLabel, FormControl } from "@chakra-ui/react";
import {
  differenceInCalendarDays,
  addDays,
  format as formatFns,
} from "date-fns";

import {
  type StockFilterEntry,
  type TradeFilterEntry,
} from "../../filters.data";
import Filter from "./filter";
import { type NumericFilterInput } from "src/server/router/scanner";
import { emptyNumericFilterInput } from "../../filterBar";

const DateFilter: React.FC<Props> = ({
  filterState,
  setFilter,
  filterData,
}) => {
  const firstInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLSelectElement>(null);

  const [updatedFilter, setUpdatedFilter] =
    useState<NumericFilterInput>(filterState);

  function handleDateChange(position: "low" | "high") {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      const daysToExpiration =
        event.target.value === ""
          ? undefined
          : differenceInCalendarDays(new Date(event.target.value), new Date());

      if (position === "high") {
        setUpdatedFilter((prev) => ({ ...prev, lte: daysToExpiration }));
      } else if (position === "low") {
        setUpdatedFilter((prev) => ({ ...prev, gte: daysToExpiration }));
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

  function formateDate(date: Date, dateFormat = "yyyy-MM-dd") {
    return formatFns(date, dateFormat);
  }

  function daysToDate(days: number | undefined, dateFormat?: string) {
    if (days !== undefined) {
      return formateDate(addDays(new Date(), days), dateFormat);
    }
    return "";
  }

  return (
    <Filter
      name={filterData.name}
      isFilterSet={gte !== undefined || lte !== undefined}
      onSubmit={commitFilterChange}
      handleUnset={handleUnset}
      popOverWidth={400}
      TextContent={
        <Flex wrap="wrap">
          {gte !== undefined && (
            <Text mr="1">After: {daysToDate(gte, "MM/dd/yyyy")} </Text>
          )}
          {lte !== undefined && (
            <Text>Before: {daysToDate(lte, "MM/dd/yyyy")}</Text>
          )}
          {gte === undefined && lte !== undefined && (
            <Text>&nbsp;({lte} days)</Text>
          )}{" "}
          {gte !== undefined && lte === undefined && (
            <Text>&nbsp;({gte} days)</Text>
          )}{" "}
          {gte !== undefined && lte !== undefined && (
            <Text>
              &nbsp;({gte}-{lte} days)
            </Text>
          )}
        </Flex>
      }
      FormContent={
        <>
          <FormControl>
            <FormLabel>After</FormLabel>
            <Input
              type="date"
              ref={firstInputRef}
              value={daysToDate(updatedFilter.gte)}
              onChange={handleDateChange("low")}
              min={formateDate(new Date())}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Before</FormLabel>
            <Input
              data-testid="date-picker-filter"
              type="date"
              value={daysToDate(updatedFilter.lte)}
              onChange={handleDateChange("high")}
              min={daysToDate(updatedFilter.gte) || formateDate(new Date())}
            />
          </FormControl>
        </>
      }
      dropdownRef={dropdownRef}
    />
  );
};

type Props = {
  filterState: NumericFilterInput;
  setFilter: (updatedFilter: NumericFilterInput) => void;
  filterData: StockFilterEntry | TradeFilterEntry;
};

export default DateFilter;
