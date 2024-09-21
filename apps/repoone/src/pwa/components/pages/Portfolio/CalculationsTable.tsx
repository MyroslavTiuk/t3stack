import React from "react";
import ROUTE_PATHS from "../../../../consts/ROUTE_PATHS";
import useBreakpoint from "../../../../utils/Hooks/useBreakpoint";
import clx from "../../../../utils/Html/clx";
import Box from "../../primitives/Box";
import Card from "../../primitives/Card";
import Icon from "../../primitives/Icon";
import Link from "../../primitives/Link/Link.view";
import Spinner from "../../primitives/Spinner";
import T from "../../primitives/Typo";
import commonCss from "../common.module.scss";
import css from "./Portfolio.module.scss";
import { type CalculationsDataTable } from "./usePortfolio";
import portfolioPageName from "./portfolio.page-name";

export interface CalculationsTableProps {
  calculationsDataTable: CalculationsDataTable;
  onDeleteCalculation: (calcId: string) => Promise<void>;
}

const verticalAdBkpts = ["desktop-large"];
const bottomHorizAdBkpts = ["tablet", "tablet-large", "desktop-small"];

export default function CalculationsTable({
  calculationsDataTable,
  onDeleteCalculation,
}: CalculationsTableProps) {
  const tableNames = Object.keys(calculationsDataTable);
  const bkpt = useBreakpoint();

  const showVertAd = React.useMemo(
    (): boolean => verticalAdBkpts.includes(bkpt),
    [bkpt]
  );
  const showBottomHorizAd = React.useMemo(
    () => bottomHorizAdBkpts.includes(bkpt),
    [bkpt]
  );
  return (
    <Card
      className={[commonCss.content, css.calculationsTableDesktop]}
      no-radius={false}
    >
      <T h3 tagName="h2" mb={1}>
        {portfolioPageName.titleCase}
      </T>
      <Box className={css._tableContainer}>
        <Box className={css.tableContent} flex>
          <Box>
            <table className={css.table}>
              <thead>
                <tr>
                  <th className="align-left">Strategy</th>
                  {/* <th>Size</th> */}
                  <th>To Open</th>
                  <th>Max Return</th>
                  <th>Risk/Coll.*</th>
                  <th>Max ROI</th>
                  {/*<th>Est. Value</th>*/}
                  {/*<th>Cur. Value</th>*/}
                  {/*<th>Cur. P/L</th>*/}
                  <th>Breakevens</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {tableNames.length === 0 ? (
                  <tr>
                    <td colSpan={10}>
                      <Box
                        className={[css.hintBox, "align-center"]}
                        p={2}
                        m={1}
                      >
                        <T content-hint mb={1}>
                          You have no current calculations,
                        </T>
                        <T content-hint mb={1}>
                          or all trades have expired.
                        </T>
                        <Link to={ROUTE_PATHS.CALCULATOR_NEW}>
                          Create a calculation
                        </Link>
                      </Box>
                    </td>
                  </tr>
                ) : (
                  tableNames.map((tableName) => {
                    return (
                      <>
                        <tr className={css.groupSymbolName}>
                          <td colSpan={10}>{tableName}</td>
                        </tr>
                        {calculationsDataTable[tableName]?.map(
                          (groupedCalc) => {
                            return (
                              <tr
                                key={`${groupedCalc.id}`}
                                className={css.clickable}
                              >
                                <td className={css._title}>
                                  <Link
                                    className={clx([css._text])}
                                    to={ROUTE_PATHS.CALCULATOR}
                                    payload={{
                                      strat:
                                        groupedCalc.calculation.metadata
                                          .stratKey,
                                    }}
                                    query={{ id: groupedCalc.id }}
                                  >
                                    {groupedCalc.title}
                                  </Link>
                                </td>
                                {/* <td>x10</td> */}
                                <td
                                  className={clx([
                                    groupedCalc.toOpen.valClass &&
                                      css[groupedCalc.toOpen.valClass],
                                    "align-right",
                                  ])}
                                >
                                  {groupedCalc.toOpen.val}
                                </td>
                                <td
                                  className={clx([
                                    groupedCalc.maxReturn.valClass &&
                                      css[groupedCalc.maxReturn.valClass],
                                    "align-right",
                                  ])}
                                >
                                  {groupedCalc.maxReturn.val}
                                </td>
                                <td
                                  className={clx([
                                    groupedCalc.maxRiskOrColl?.valClass &&
                                      css[groupedCalc.maxRiskOrColl?.valClass],
                                    "align-right",
                                  ])}
                                >
                                  {groupedCalc.maxRiskOrColl?.val
                                    ? `${groupedCalc.maxRiskOrColl?.val}${
                                        groupedCalc.useColl ? "*" : ""
                                      }`
                                    : "N/A"}
                                </td>
                                <td
                                  className={clx([
                                    groupedCalc.maxRiskOrCollRoi?.valClass &&
                                      css[
                                        groupedCalc.maxRiskOrCollRoi?.valClass
                                      ],
                                    "align-right",
                                  ])}
                                >
                                  {groupedCalc.maxRiskOrCollRoi?.val
                                    ? `${groupedCalc.maxRiskOrCollRoi?.val}${
                                        groupedCalc.useColl ? "*" : ""
                                      }`
                                    : "N/A"}
                                </td>

                                {/*<td className={'align-right'}>$1,330</td>*/}
                                {/*<td className={'align-right'}>$1,310</td>*/}
                                {/*<td className={'align-right'}>6.4%</td>*/}
                                <td
                                  className={clx([
                                    groupedCalc.breakEven.valClass &&
                                      css[groupedCalc.breakEven.valClass],
                                    "align-right",
                                  ])}
                                >
                                  {Array.isArray(groupedCalc.breakEven.val)
                                    ? groupedCalc.breakEven.val.join(", ")
                                    : groupedCalc.breakEven.val}
                                </td>
                                <td>
                                  {groupedCalc.loading ? (
                                    <Spinner className={css.closeIcon} />
                                  ) : (
                                    <Icon
                                      onClick={() =>
                                        onDeleteCalculation(groupedCalc.id)
                                      }
                                      icon="close"
                                      noSize
                                      className={css.closeIcon}
                                      ctnrClassName={css.iconContainer}
                                    />
                                  )}
                                </td>
                              </tr>
                            );
                          }
                        )}
                      </>
                    );
                  })
                )}
              </tbody>
            </table>
            <T content-detail-minor mt={1 / 2}>
              *Where the maximum risk is infinite or occurs at stock price of
              $0, statistics are based on collateral (margin held) rather than
              max risk.
            </T>
          </Box>
        </Box>
        {showVertAd && (
          <Box className={css._verticalAds}>
            <img src="/images/sample-ad-160x600.png" />
            {/* <AdUnit adSlotId={'2219058675'} /> */}
          </Box>
        )}
      </Box>
      {showBottomHorizAd && (
        <Box className={css._horizontalAds} mt={2}>
          {bkpt === "tablet-large" ? (
            <img src="/images/sample-ad-970x90.png" />
          ) : (
            <img
              src="/images/sample-ad-970x90.png"
              style={{ width: "100%", height: "90px" }}
            />
          )}
        </Box>
      )}
    </Card>
  );
}
