import React from "react";

import {
  FilterType,
  type StockFilterData,
  type TradeFilterData,
} from "../../filters.data";
import BooleanFilter from "./booleanFilter";
import NumericFilter from "./numericFilter";
import RangeFilter from "./rangeFilter";
import MultiplierFilter from "./multiplierFilter";
import DateFilter from "./dateFilter";
import {
  type NumericFilterInput,
  type StockFilters,
  type TradeFilters,
} from "src/server/router/scanner";

const FilterList: React.FC<Props> = ({ filters, setFilters, filterData }) => {
  return (
    <>
      {Object.entries(filterData).map(([filterId, filterDataEntry]) => {
        if (filterDataEntry.filterType === FilterType.Numeric) {
          return (
            <NumericFilter
              key={filterId}
              filterState={
                filters[filterDataEntry.apiParameter as keyof typeof filters]
              }
              setFilter={(updatedFilter: NumericFilterInput) => {
                return setFilters((prevFilters: any) => ({
                  ...prevFilters,
                  [filterDataEntry.apiParameter]: updatedFilter,
                }));
              }}
              filterData={filterData[filterId]}
            />
          );
        }
        if (filterDataEntry.filterType === FilterType.Boolean) {
          return (
            <BooleanFilter
              key={filterId}
              filterState={
                filters[filterDataEntry.apiParameter as keyof typeof filters]
              }
              setFilter={(updatedFilter: boolean | undefined) =>
                setFilters((prevFilters: any) => ({
                  ...prevFilters,
                  [filterDataEntry.apiParameter]: updatedFilter,
                }))
              }
              filterData={filterData[filterId]}
            />
          );
        }
        if (filterDataEntry.filterType === FilterType.Range) {
          return (
            <RangeFilter
              key={filterId}
              filterState={
                filters[filterDataEntry.apiParameter as keyof typeof filters]
              }
              setFilter={(updatedFilter: NumericFilterInput) =>
                setFilters((prevFilters: any) => ({
                  ...prevFilters,
                  [filterDataEntry.apiParameter]: updatedFilter,
                }))
              }
              filterData={filterData[filterId]}
            />
          );
        }
        if (filterDataEntry.filterType === FilterType.Multiplier) {
          return (
            <MultiplierFilter
              key={filterId}
              filterState={
                filters[filterDataEntry.apiParameter as keyof typeof filters]
              }
              setFilter={(updatedFilter: NumericFilterInput) =>
                setFilters((prevFilters: any) => ({
                  ...prevFilters,
                  [filterDataEntry.apiParameter]: updatedFilter,
                }))
              }
              filterData={filterData[filterId]}
            />
          );
        }
        if (filterDataEntry.filterType === FilterType.Date) {
          return (
            <DateFilter
              key={filterId}
              filterState={
                filters[filterDataEntry.apiParameter as keyof typeof filters]
              }
              setFilter={(updatedFilter: NumericFilterInput) =>
                setFilters((prevFilters: any) => ({
                  ...prevFilters,
                  [filterDataEntry.apiParameter]: updatedFilter,
                }))
              }
              filterData={filterData[filterId]}
            />
          );
        }
      })}
    </>
  );
};

type Props = {
  filters: StockFilters | TradeFilters;
  setFilters:
    | React.Dispatch<React.SetStateAction<StockFilters>>
    | React.Dispatch<React.SetStateAction<TradeFilters>>;
  filterData: StockFilterData | TradeFilterData;
};

export default FilterList;
