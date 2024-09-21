import React from "react";
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerBody,
  DrawerFooter,
  Button,
  Text,
  Heading,
} from "@chakra-ui/react";
import { BsFillPlayFill } from "react-icons/bs";
import { stockFilterData, tradeFilterData } from "../filters.data";
import FilterList from "./filters/filterList";
import {
  type StockFilters,
  type TradeFilters,
} from "src/server/router/scanner";

const FilterDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  stockFilters,
  setStockFilters,
  tradeFilters,
  setTradeFilters,
  runScan,
}) => {
  return (
    <Drawer
      isOpen={isOpen}
      placement="right"
      onClose={onClose}
      size="md"
      closeOnEsc={false}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerBody>
          <Heading>Filters</Heading>
          <Heading size="md" mt="10">
            Stock Data
          </Heading>
          <FilterList
            filters={stockFilters}
            setFilters={setStockFilters}
            filterData={stockFilterData}
          />
          <Heading size="md" mt="10">
            Options Data
          </Heading>
          <FilterList
            filters={tradeFilters}
            setFilters={setTradeFilters}
            filterData={tradeFilterData}
          />
        </DrawerBody>
        <DrawerFooter>
          <Button
            variant="outline"
            mr={3}
            onClick={onClose}
            w="50%"
            data-testid="cancel-filter-button"
          >
            Cancel
          </Button>
          <Button
            w="50%"
            bg="button.orange.700"
            color="background.50"
            onClick={runScan}
          >
            <BsFillPlayFill />
            <Text ml="2">Run Scan</Text>
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  stockFilters: StockFilters;
  setStockFilters: React.Dispatch<React.SetStateAction<StockFilters>>;
  tradeFilters: TradeFilters;
  setTradeFilters: React.Dispatch<React.SetStateAction<TradeFilters>>;
  runScan: () => void;
};

export default FilterDrawer;
