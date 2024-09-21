import React, { useRef, useState } from "react";
import { useRouter } from "next/router";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  chakra,
  Tbody,
  Td,
  Skeleton,
  Box,
  useColorModeValue,
  Text,
  Button,
} from "@chakra-ui/react";
import { flexRender, type HeaderGroup, type Row } from "@tanstack/react-table";
import { headerHeight } from "src/components/layout/AppBar/AppBar";
import { type ScannerTableRow } from "./tableDefinition";
import {
  filterBarHeightDesktop,
  filterBarHeightMobile,
} from "../filterBar/filterBar";

function getStickyProps(id: string, isShowColumnDivider: boolean) {
  if (id === "symbol") {
    return {
      position: "sticky" as const,
      left: 0,
      boxShadow: isShowColumnDivider
        ? `inset -5px 0px 5px -5px black`
        : undefined,
    };
  }

  return {};
}

const OptionScannerTable: React.FC<Props> = ({
  tableContainerRef,
  headerGroups,
  error,
  rows,
  columnCount,
  virtualPadding,
  isFetchingStocks,
}) => {
  const [isShowColumnDivider, setIsShowColumnDivider] = useState(false);
  const dataButtonRef = useRef<HTMLTableCellElement | null>(null);
  const tickerRef = useRef<HTMLTableCellElement | null>(null);

  const router = useRouter();

  const tableBgColor = useColorModeValue("background.200", "cards.800");
  const expandedBgColor = useColorModeValue("neutral.500", "cards.700");

  const calculateIsTickerOverlapStockPrice = () => {
    if (dataButtonRef.current && tickerRef.current) {
      const dataButtonRect = dataButtonRef.current.getBoundingClientRect();
      const tickerRect = tickerRef.current.getBoundingClientRect();

      if (tickerRect.right <= dataButtonRect.left) {
        setIsShowColumnDivider(false);
      } else {
        setIsShowColumnDivider(true);
      }
    }
  };

  return (
    <Box
      ref={tableContainerRef}
      h={{
        base: `calc(100vh - ${headerHeight} - ${filterBarHeightMobile})`,
        md: `calc(100vh - ${headerHeight} - ${filterBarHeightDesktop})`,
      }}
      overflowY="auto"
      onScroll={calculateIsTickerOverlapStockPrice}
    >
      {error ? (
        <Box p="10">
          <Text>Failed to load options data, try refreshing the page.</Text>
          <Text>{error.toString()}</Text>
          <Button
            onClick={router.reload}
            size="lg"
            bg="button.orange.700"
            color="background.50"
            mt={4}
          >
            REFRESH PAGE
          </Button>
        </Box>
      ) : (
        <TableContainer overflowX="unset" overflowY="unset">
          <Table>
            <Thead position="sticky" top="0" zIndex="1" bgColor={tableBgColor}>
              {headerGroups.map((headerGroup, headerIdx) => (
                <Tr key={`${headerGroup.id}${headerIdx}`}>
                  {headerGroup.headers.map((header, headerIdx) => {
                    return (
                      <Th
                        key={`${header.id}${headerIdx}`}
                        onClick={header.column.getToggleSortingHandler()}
                        {...getStickyProps(
                          header.id as string,
                          isShowColumnDivider
                        )}
                        bgColor={tableBgColor}
                        isNumeric
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}

                        <chakra.span pl="4">
                          {header.column.getIsSorted() ? (
                            header.column.getIsSorted() === "desc" ? (
                              <TriangleDownIcon aria-label="sorted descending" />
                            ) : (
                              <TriangleUpIcon aria-label="sorted ascending" />
                            )
                          ) : null}
                        </chakra.span>
                      </Th>
                    );
                  })}
                </Tr>
              ))}
            </Thead>
            <Tbody>
              {virtualPadding.top > 0 && (
                <Tr>
                  <Td h={`${virtualPadding.top}px`} />
                </Tr>
              )}
              {rows.map((row, idx) => {
                if (row.original.name === "loader") {
                  return (
                    <Tr key={`${row.id}${idx}`}>
                      <Td colSpan={columnCount} p="2">
                        <Skeleton h="14" />
                      </Td>
                    </Tr>
                  );
                }
                return (
                  <Tr key={`${row.id}${idx}`}>
                    {row.getVisibleCells().map((cell, cellIndex) => {
                      return (
                        <Td
                          ref={
                            cell.column.id === "showData" && idx === 0
                              ? dataButtonRef
                              : cell.column.id === "symbol" && idx === 0
                              ? tickerRef
                              : undefined
                          }
                          key={row.id + cellIndex}
                          {...getStickyProps(
                            cell.column.id as string,
                            isShowColumnDivider
                          )}
                          bgColor={
                            cell.row.depth > 0 ? expandedBgColor : tableBgColor
                          }
                          isNumeric
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </Td>
                      );
                    })}
                  </Tr>
                );
              })}
              {isFetchingStocks && (
                <Tr>
                  <Td colSpan={columnCount} p="2">
                    <Skeleton h="14" />
                  </Td>
                </Tr>
              )}
              {virtualPadding.bottom > 0 && (
                <Tr>
                  <Td h={`${virtualPadding.bottom}px`} />
                </Tr>
              )}
            </Tbody>
          </Table>
        </TableContainer>
      )}
      {rows.length === 0 && !isFetchingStocks && (
        <Box p="10">
          <Text>
            No trades matching these filters found, try refining your filters.
          </Text>
        </Box>
      )}
    </Box>
  );
};

type Props = {
  tableContainerRef: React.RefObject<HTMLDivElement>;
  headerGroups: HeaderGroup<ScannerTableRow>[];
  error: any;
  rows: Row<ScannerTableRow>[];
  columnCount: number;
  virtualPadding: {
    top: number;
    bottom: number;
  };
  isFetchingStocks: boolean;
};

export default OptionScannerTable;
