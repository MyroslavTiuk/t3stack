import { useCallback, useMemo, useState } from "react";
import * as R from "ramda";
import {
  err,
  type Errable,
  fromFalsey,
  ifNotErr,
  isErr,
  notErr,
} from "errable";

import { type Strategy } from "opc-types/lib/Strategy";
import { type StrategyOverviewWithCalculation } from "opc-types/lib/StrategyOverview";
import { type ObjRecord } from "opc-types/lib/util/ObjRecord";
import { type Nullable } from "opc-types/lib/util/Nullable";

import { strategyEstimates } from "../../../../services/calculate/strategyEstimates";
import { type GroupedStrategiesWithCalculation } from "../../../../utils/Finance/groupCalcs";
import stratEstToSummaryData from "../../modules/StrategyCalculator/Summary/utils/stratEstToSummaryData";
import { useToastNotification } from "../../primitives/ToastNotification/ToastNotificationProvider";
import { useCalculations } from "../../../../services/UserData/CalculationsProvider";
import isStrategyComplete from "../../../../utils/Finance/isStrategyComplete";
import { useSession } from "../../modules/Session/SessionProvider";
import { type UserData } from "../../modules/Session/Session.types";

export interface DataTableField {
  label?: string;
  val: string | string[];
  valClass?: string;
}
export interface CalculationsDataTableRow {
  id: string;
  title: string;
  size: string;
  toOpen: DataTableField;
  maxReturn: DataTableField;
  maxRisk: DataTableField;
  maxRiskOrColl: Nullable<DataTableField>;
  maxRiskOrCollRoi: Nullable<DataTableField>;
  useColl: boolean;
  maxRoi: DataTableField;
  estimatedValue: DataTableField;
  currentValue: DataTableField;
  currentPL: DataTableField;
  breakEven: DataTableField;
  collateral: Nullable<DataTableField>;
  collateralRoi: Nullable<DataTableField>;
  calculation: Strategy;
  loading: boolean;
}

export type CalculationsDataTable = ObjRecord<CalculationsDataTableRow[]>;
const getDataTable = (
  groupedCalculations: GroupedStrategiesWithCalculation,
  loadingCalculationsId: string[],
  userData: UserData
): CalculationsDataTable => {
  return R.mapObjIndexed((value) => {
    const flattenedValue = R.flatten<StrategyOverviewWithCalculation[][]>(
      value || ([] as StrategyOverviewWithCalculation[][])
    );
    const dataTable = flattenedValue
      .map(
        (
          item: StrategyOverviewWithCalculation
        ): Errable<string[], CalculationsDataTableRow> => {
          return R.pipe(
            () => fromFalsey(["No calc"], item.calculation),
            ifNotErr((calc) => {
              const estimate = isStrategyComplete(calc)
                ? strategyEstimates(calc, {
                    stockChangeInValue:
                      userData.userSettings.stockChangeInValue,
                    timeDecayBasis: userData.userSettings.timeDecayBasis,
                    closePriceMethod: userData.userSettings.closePriceMethod,
                  })
                : err(["calc not complete"]);
              return isErr(estimate) ? estimate : { estimate, calc };
            }),
            ifNotErr(({ estimate }): CalculationsDataTableRow => {
              const summaryData = stratEstToSummaryData(estimate);

              const useColl =
                summaryData.maxRiskPrice?.[0]?.[0] === Infinity ||
                summaryData.maxRiskPrice?.[0]?.[1] === 0;
              return {
                id: item.calculation.id || "",
                title: item.title,
                size: "x10",
                toOpen: summaryData.entryCost,
                maxReturn: summaryData.maxProfit,
                maxRisk: summaryData.maxRisk,
                maxRoi: summaryData.roiMaxRisk,
                useColl,
                maxRiskOrColl: useColl
                  ? summaryData.collateral
                  : summaryData.maxRisk,
                maxRiskOrCollRoi: useColl
                  ? summaryData.roiCollateral
                  : summaryData.roiMaxRisk,
                collateral: summaryData.collateral,
                collateralRoi: summaryData.roiCollateral,
                estimatedValue: { val: "$1,330" },
                currentValue: { val: "$1,310" },
                currentPL: { val: "6.4%" },
                breakEven: summaryData.breakevens,
                calculation: item?.calculation,
                loading: Boolean(
                  loadingCalculationsId.find(
                    (loadingId) => loadingId === item.calculation.id
                  )
                ),
              };
            })
          )();
        }
      )
      .filter(notErr);

    return dataTable;
  }, groupedCalculations);
};

export default function usePortfolio() {
  const { groupedCalculations, loadingCalculations, deleteCalculation } =
    useCalculations();
  const [loadingCalculationsId, setLoadingCalculationsId] = useState<string[]>(
    []
  );

  const { userData } = useSession();
  const calculationsDataTable = useMemo((): CalculationsDataTable => {
    return getDataTable(groupedCalculations, loadingCalculationsId, userData);
  }, [groupedCalculations, loadingCalculationsId, userData]);

  const { addSuccessNotification, addErrorNotification } =
    useToastNotification();
  const onDeleteCalculation = useCallback(
    async (calcId: string) => {
      setLoadingCalculationsId((prevValue) => [...prevValue, calcId]);
      const deleteResult = await deleteCalculation(calcId);
      if (deleteResult) {
        addSuccessNotification("Successfully Deleted Calculation");
      } else {
        addErrorNotification(
          "Something went wrong deleting calculation, please try again"
        );
      }
      setLoadingCalculationsId((prevValue) =>
        prevValue.filter((item) => item !== calcId)
      );
    },
    [deleteCalculation, addSuccessNotification, addErrorNotification]
  );

  return {
    calculationsDataTable,
    loadingCalculations,
    onDeleteCalculation,
  };
}
