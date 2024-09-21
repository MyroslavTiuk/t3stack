import React, { useState } from "react";
import { Flex, useColorModeValue, useDisclosure } from "@chakra-ui/react";
import { type Strategy } from "@data/strategies.data";
import FilterDrawer from "./filterDrawer/filterDrawer";

import { FilterHeading } from "./FilterHeading";
import TableHeader from "./TableHeader";
import {
  type StockFilters,
  type TradeFilters,
} from "src/server/router/scanner";
import { stockFilterData, tradeFilterData } from "./filters.data";
import { cloneDeep } from "lodash";

export const filterBarHeightMobile = "13rem"; //fixed height for calculating sticky positions
export const filterBarHeightDesktop = "8rem";

const FilterBar: React.FC<Props> = ({
  tradeCount,
  setStockFilters,
  setTradeFilters,
  strategy,
  setStrategy,
  setIsScanEnabled,
  isScanEnabled,
}) => {
  const borderBottomColor = useColorModeValue("gray.100", "gray.700");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [stagedStockFilters, setStagedStockFilters] = useState<StockFilters>(
    initialStockFilterState
  );
  const [prevStockFilters, setPrevStockFilters] = useState<StockFilters>(
    initialStockFilterState
  );
  const [stagedTradeFilters, setStagedTradeFilters] = useState<TradeFilters>(
    initialTradeFilterState
  );
  const [prevTradeFilters, setPrevTradeFilters] = useState<TradeFilters>(
    initialTradeFilterState
  );

  function onOpenDrawer() {
    setStagedStockFilters(prevStockFilters);
    setStagedTradeFilters(prevTradeFilters);
    onOpen();
  }

  function runScan() {
    const formattedStockFilters = formatStockFilters(stagedStockFilters);
    const formattedTradeFilters = formatTradeFilters(stagedTradeFilters);
    setIsScanEnabled(true);
    setStockFilters(formattedStockFilters);
    setPrevStockFilters(stagedStockFilters);
    setTradeFilters(formattedTradeFilters);
    setPrevTradeFilters(stagedTradeFilters);
    onClose();
  }

  return (
    <>
      <FilterDrawer
        isOpen={isOpen}
        onClose={onClose}
        stockFilters={stagedStockFilters}
        setStockFilters={setStagedStockFilters}
        tradeFilters={stagedTradeFilters}
        setTradeFilters={setStagedTradeFilters}
        runScan={runScan}
      />
      <Flex
        flexDir="column"
        gap={{ sm: 1, md: 3 }}
        width="full"
        borderColor={borderBottomColor}
        height={{ base: filterBarHeightMobile, md: filterBarHeightDesktop }}
      >
        <FilterHeading tradeCount={tradeCount} strategy={strategy} />
        <TableHeader
          isScanEnabled={isScanEnabled}
          onOpenDrawer={onOpenDrawer}
          strategy={strategy}
          setStrategy={setStrategy}
        />
      </Flex>
    </>
  );
};

export const emptyNumericFilterInput = {
  gte: undefined,
  lte: undefined,
};

export const initialStockFilterState: StockFilters = {
  price: emptyNumericFilterInput,
  marketCap: emptyNumericFilterInput,
  peRatio: emptyNumericFilterInput,
  dividendYield: emptyNumericFilterInput,
  dividendAmount: emptyNumericFilterInput,
  beta: emptyNumericFilterInput,
};

export const initialTradeFilterState: TradeFilters = {
  iv: emptyNumericFilterInput,
  otmPercent: emptyNumericFilterInput,
  pop: emptyNumericFilterInput,
  bidAskSpread: emptyNumericFilterInput,
  volume: emptyNumericFilterInput,
  daysToExpiration: emptyNumericFilterInput,
};

function formatStockFilters(stockFilters: StockFilters) {
  const formattedFilters = cloneDeep(stockFilters);
  Object.entries(stockFilterData).forEach(([_, filterDataEntry]) => {
    const filterId = filterDataEntry.apiParameter;
    const formatParameter = filterDataEntry.formatParameter;

    if (formatParameter) {
      const { gte, lte } = formattedFilters[filterId];
      if (gte) {
        formattedFilters[filterId].gte = formatParameter(gte);
      }
      if (lte) {
        formattedFilters[filterId].lte = formatParameter(lte);
      }
    }
  });
  return formattedFilters;
}

function formatTradeFilters(tradeFilters: TradeFilters) {
  const formattedFilters = cloneDeep(tradeFilters);
  Object.entries(tradeFilterData).forEach(([_, filterDataEntry]) => {
    const filterId = filterDataEntry.apiParameter;
    const filter = formattedFilters[filterId];
    const formatParameter = filterDataEntry.formatParameter;

    if (formatParameter && typeof filter !== "boolean" && filter) {
      const { gte, lte } = filter;
      if (gte) {
        filter.gte = formatParameter(gte);
      }
      if (lte) {
        filter.lte = formatParameter(lte);
      }
    }
  });
  return formattedFilters;
}

type Props = {
  tradeCount?: number;
  setStockFilters: React.Dispatch<React.SetStateAction<StockFilters>>;
  setTradeFilters: React.Dispatch<React.SetStateAction<TradeFilters>>;
  strategy: Strategy;
  setStrategy: React.Dispatch<React.SetStateAction<Strategy>>;
  setIsScanEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  isScanEnabled: boolean;
};

export default React.memo(FilterBar);
