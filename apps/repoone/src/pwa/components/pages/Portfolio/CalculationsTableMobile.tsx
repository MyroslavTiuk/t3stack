import { type Nullable } from "errable";
import { type Strategy } from "opc-types/lib/Strategy";
/* eslint-disable no-nested-ternary */
import React, { useCallback, useState } from "react";

import ROUTE_PATHS from "../../../../consts/ROUTE_PATHS";
import clx from "../../../../utils/Html/clx";
import selectUnderlyingLeg from "../../../store/selectors/currentCalculation/selectUnderlyingLeg";
import Box from "../../primitives/Box";
import DropdownToggle from "../../primitives/DropdownToggle/DropdownToggle";
import Icon from "../../primitives/Icon";
import Link from "../../primitives/Link/Link.view";
import Spinner from "../../primitives/Spinner";
import T from "../../primitives/Typo";

import css from "./Portfolio.module.scss";
import {
  type CalculationsDataTable,
  type CalculationsDataTableRow,
} from "./usePortfolio";

const GroupedCalcRow = ({
  groupedCalc,
  onDeleteCalculation,
}: {
  groupedCalc: CalculationsDataTableRow;
  onDeleteCalculation: (calcId: string) => Promise<void>;
}) => {
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const onToggleDetails = useCallback(() => {
    setShowDetails((prevValue) => !prevValue);
  }, [setShowDetails]);
  return (
    <>
      {showDetails ? (
        <tr className={css.detailedItemContainer}>
          <td colSpan={2}>
            <Box className={css._detailedItemHeader}>
              <Box className={css._title} onClick={onToggleDetails}>
                {groupedCalc.title}
              </Box>
              <Link
                to={ROUTE_PATHS.CALCULATOR}
                payload={{
                  strat: groupedCalc.calculation.metadata.stratKey,
                }}
                query={{ id: groupedCalc.id }}
              >
                Open
              </Link>
            </Box>
          </td>
        </tr>
      ) : (
        <tr key={groupedCalc.id}>
          <td className={css._title} onClick={onToggleDetails}>
            {groupedCalc.title}
          </td>
          <td
            className={clx([
              groupedCalc.maxRoi.valClass && css[groupedCalc.maxRoi.valClass],
              "align-right",
            ])}
          >
            {groupedCalc.maxRoi.val}
          </td>
        </tr>
      )}
      {showDetails && (
        <tr className={css.detailedItemContainer}>
          <td colSpan={2}>
            <DropdownToggle open={showDetails}>
              <Box className={css._detailedContent}>
                <Box className={css._leftContent}>
                  <Box className={css._detailItem}>
                    <T>
                      {groupedCalc.toOpen.valClass === "--credit"
                        ? "Premium"
                        : "Initial cost"}
                      :
                    </T>
                    <T
                      className={[
                        css._detailedItemValue,
                        groupedCalc.toOpen.valClass &&
                          css[groupedCalc.toOpen.valClass],
                      ]}
                    >
                      {groupedCalc.toOpen.val}
                    </T>
                  </Box>
                  <Box className={css._detailItem}>
                    <T>Max Return:</T>
                    <T
                      className={[
                        css._detailedItemValue,
                        groupedCalc.maxReturn.valClass &&
                          css[groupedCalc.maxReturn.valClass],
                      ]}
                    >
                      {groupedCalc.maxReturn.val}
                    </T>
                  </Box>
                  {groupedCalc.collateral && (
                    <Box className={css._detailItem}>
                      <T>Collateral:</T>
                      <T
                        className={[
                          css._detailedItemValue,
                          groupedCalc.collateral.valClass &&
                            css[groupedCalc.collateral.valClass],
                        ]}
                      >
                        {groupedCalc.collateral.val}
                      </T>
                    </Box>
                  )}
                  <Box className={css._detailItem}>
                    <T>Max Risk:</T>
                    <T
                      className={[
                        css._detailedItemValue,
                        groupedCalc.maxRisk.valClass &&
                          css[groupedCalc.maxRisk.valClass],
                      ]}
                    >
                      {groupedCalc.maxRisk.val}
                    </T>
                  </Box>
                </Box>
                <Box className={css._rightContent}>
                  <Box className={css._detailItem}>
                    <T>Breakeven:</T>
                    <T
                      className={[
                        css._detailedItemValue,
                        groupedCalc.breakEven.valClass &&
                          css[groupedCalc.breakEven.valClass],
                      ]}
                    >
                      {Array.isArray(groupedCalc.breakEven.val)
                        ? groupedCalc.breakEven.val.join(", ")
                        : groupedCalc.breakEven.val}
                    </T>
                  </Box>
                  <Box className={css._detailItem}>
                    <T>Max ROI:</T>
                    <T
                      className={[
                        css._detailedItemValue,
                        groupedCalc.maxRoi.valClass &&
                          css[groupedCalc.maxRoi.valClass],
                      ]}
                    >
                      {groupedCalc.maxRoi.val}
                    </T>
                  </Box>
                  {groupedCalc.collateralRoi && (
                    <Box className={css._detailItem}>
                      <T>ROI Collateral:</T>
                      <T
                        className={[
                          css._detailedItemValue,
                          groupedCalc.collateralRoi.valClass &&
                            css[groupedCalc.collateralRoi.valClass],
                        ]}
                      >
                        {groupedCalc.collateralRoi.val}
                      </T>
                    </Box>
                  )}
                </Box>
              </Box>
              <Box
                className={css._deleteButtonContainer}
                onClick={() => {
                  onToggleDetails();
                  onDeleteCalculation(groupedCalc.id);
                }}
              >
                <Icon icon="close" noSize className={css.closeIcon} />
                <T className={css.deleteText}>Delete</T>
              </Box>
            </DropdownToggle>
          </td>
        </tr>
      )}
    </>
  );
};

export interface Props {
  calculationsDataTable: CalculationsDataTable;
  onDeleteCalculation: (calcId: string) => Promise<void>;
  loading: boolean;
  currentCalc: Nullable<Strategy>;
}

const sortTabs = (curSymb: string) => (a: string, b: string) =>
  a === curSymb ? -1 : b === curSymb ? 1 : a > b ? 1 : b > a ? -1 : 0;

export default function CalculationsTableMobile({
  calculationsDataTable,
  onDeleteCalculation,
  loading,
  currentCalc,
}: Props) {
  const tableNamesUnsorted = Object.keys(calculationsDataTable);
  const currentCalStrategyTitle = selectUnderlyingLeg(currentCalc)?.val || "";
  const tableNames = React.useMemo(
    () => tableNamesUnsorted.sort(sortTabs(currentCalStrategyTitle)),
    [tableNamesUnsorted, currentCalStrategyTitle]
  );
  const [activeTab, setActiveTab] = useState<string>(
    currentCalStrategyTitle || tableNames[0] || ""
  );
  const onSetActiveTab = useCallback((newActiveTab: string) => {
    setActiveTab(newActiveTab);
  }, []);

  return (
    <Box className={css.calculationsTableMobile} mt={1 / 3}>
      {loading ? (
        <Box className={css.placeholderContainer}>
          <Spinner />
        </Box>
      ) : !tableNames.length ? (
        <Box className={[css.hintBox, "align-center"]} p={2} m={1}>
          <T content-hint mb={1}>
            You have no current calculations.
          </T>
          <T content-hint mb={1}>
            (Or all calculations have expired)
          </T>
          <Link to={ROUTE_PATHS.CALCULATOR_NEW}>Create a calculation</Link>
        </Box>
      ) : (
        <>
          <Box className={css._tabsContainer}>
            {tableNames.map((item) => {
              return (
                <Box
                  className={[
                    css._tabsItem,
                    item === activeTab && css["--active"],
                  ]}
                  key={item}
                  onClick={() => onSetActiveTab(item)}
                >
                  {item}
                </Box>
              );
            })}
            <Box className={css._tabItemEndSpacer} />
          </Box>
          <Box className={css._tabContent} flex>
            {Boolean(activeTab) &&
            calculationsDataTable &&
            calculationsDataTable[activeTab]?.length ? (
              <Box className={css.tableContent} flex>
                <table className={css.table}>
                  <thead>
                    <tr>
                      <th className="align-left">Strategy</th>
                      <th className="align-right">Max RTN Roi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {calculationsDataTable?.[activeTab]?.map((groupedCalc) => {
                      return (
                        <GroupedCalcRow
                          key={groupedCalc.id}
                          groupedCalc={groupedCalc}
                          onDeleteCalculation={onDeleteCalculation}
                        />
                      );
                    })}
                  </tbody>
                </table>
              </Box>
            ) : (
              <Box className={css.selectTabMessage}>
                Select a stock code to view your calculations
              </Box>
            )}
          </Box>
        </>
      )}
    </Box>
  );
}
