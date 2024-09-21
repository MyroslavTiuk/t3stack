import { Select, Text } from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import {
  type StockFilterEntry,
  type TradeFilterEntry,
} from "../../filters.data";
import Filter from "./filter";

const BooleanFilter: React.FC<Props> = ({
  filterState,
  setFilter,
  filterData,
}) => {
  const [updatedFilter, setUpdatedFilter] = useState(true);
  const dropdownRef = useRef<HTMLSelectElement>(null);

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    if (event.target.selectedOptions[0].value === YesNo.Yes) {
      setUpdatedFilter(true);
    }
    if (event.target.selectedOptions[0].value === YesNo.No) {
      setUpdatedFilter(false);
    }
  }

  function commitFilterChange() {
    setFilter(updatedFilter);
  }

  function handleUnset() {
    setFilter(undefined);
  }

  return (
    <Filter
      name={filterData.name}
      isFilterSet={filterState !== undefined}
      onSubmit={commitFilterChange}
      handleUnset={handleUnset}
      TextContent={
        <Text color="button.orange.700" mr="1">
          {filterState ? YesNo.Yes : YesNo.No}
        </Text>
      }
      FormContent={
        <Select
          color="button.orange.700"
          onChange={handleChange}
          minW="32"
          defaultValue={updatedFilter === false ? YesNo.No : YesNo.Yes}
          ref={dropdownRef}
        >
          <option value={YesNo.Yes}>{"Yes"}</option>
          <option value={YesNo.No}>{"No"}</option>
        </Select>
      }
      dropdownRef={dropdownRef}
    />
  );
};

enum YesNo {
  Yes = "Yes",
  No = "No",
}

type Props = {
  filterState?: boolean;
  setFilter: (updatedFilter: boolean | undefined) => void;
  filterData: StockFilterEntry | TradeFilterEntry;
};

export default BooleanFilter;
