/* eslint-disable import/no-cycle */
import React, { type FC, useEffect, useState } from "react";

import { isNull } from "errable";
import ContainerDimensions from "react-container-dimensions";

import { type StrategyComplete } from "opc-types/lib/Strategy";
import { type Nullable } from "opc-types/lib/util/Nullable";
import { type PositionPair } from "opc-types/lib/PositionPair";

import Box from "../../../primitives/Box";
import { RESULTS_VISUALIZATION } from "../../../../../types/enums/RESULTS_VISUALIZATION";
import isStrategyComplete from "../../../../../utils/Finance/isStrategyComplete";
import useDispatchUpdateParam from "../utils/useDispatchUpdateParam";
import { useSession } from "../../Session/SessionProvider";

import { StrategyCalculatorContext } from "../StrategyCalculator.container";
import MatrixPlaceholder from "./MatrixPlaceholder/MatrixPlaceholder.view";
import PriceRangeChanger from "./PriceRangeChanger/PriceRangeChanger";
import ResultsMatrix from "./ResultsMatrix/ResultsMatrix.view";
import IVChanger from "./IVChanger/IVChanger";
import css from "./Results.module.scss";
import ResultsLineGraph from "./ResultsLineGraph/ResultsLineGraph.view";
import StrikeShift from "./StrikeShift";
import ExpiryShift from "./ExpiryShift";
import DisplayValueSelector from "./DisplayValueSelector";
import VisualizationToggle from "./VisualizationToggle";
import { type StrategyEstimate } from "opc-types/lib/StrategyEstimate";
import { type ObjRecord } from "opc-types/lib/util/ObjRecord";
import round from "../../../../../utils/Data/round/round";
import getBestStockPrice from "../../../../../utils/Finance/getBestStockPrice";
import selectUnderlyingLeg from "../../../../store/selectors/currentCalculation/selectUnderlyingLeg";
import useDispaction from "../../../../../utils/Redux/useDispaction";
import { calculatorActions } from "../../../../store/actions";
import { CALCULATION_PERMISSION } from "../../../../../types/enums/CALCULATION_PERMISSIONS";
import DropdownMenu from "../../../primitives/DropdownMenu";
import featureNotDisabled from "../../../../../utils/App/featureNotDisabled";
import Icon from "../../../primitives/Icon";
import RadioLabel from "../../../primitives/RadioLabel";
import copyToClipboard from "../../../../../utils/Html/copyToClipboard";
import { useToastNotification } from "../../../primitives/ToastNotification/ToastNotificationProvider";
import { api } from "~/utils/api";
import { NewSavedCalcsContext } from "../NewSavedCalculations/NewSavedCalculationsContext";
import { uuid } from "short-uuid";
import useSelectorSafe from "~/pwa/store/selectors/useSelectorSafe";
import { MultiStrikeCalculation } from "../../../../../../opc-types/lib/store/CurrentCalculationState";

function copyLinkUriWithText(text = ""): void {
  copyToClipboard(text);
}

function getStockComparisonPoints(estimate: StrategyEstimate, uPrice: number) {
  const initial = estimate.initial.gross;

  if (initial >= 0) return null;
  const pricePoints = Object.keys(estimate.theoPoints);
  return pricePoints.reduce((acc, pricePoint) => {
    const price = parseFloat(pricePoint);
    // dataLine.push(parseFloat(roundTo(getDisValByType(graphData, -graphData.initial.g + ((parseFloat(x) - uPrice) * (-graphData.initial.g / uPrice))),2)));
    acc[pricePoint] =
      -initial + round((price - uPrice) * (-initial / uPrice), 2);
    return acc;
  }, {} as ObjRecord<number>);
}

interface ResultsProps {
  authStatus: "authenticated" | "loading" | "unauthenticated";
  multiStrikeEstimates?: Nullable<StrategyEstimate>[];
}

const Results: FC<ResultsProps> = ({ authStatus, multiStrikeEstimates }) => {
  const {
    setHighlightedPosition,
    showAgreeTNClink,
    isCalculating,
    estimateForResults: estimate,
    currentCalcForResults: currentCalc,
    setShowPosDetail,
  } = React.useContext(StrategyCalculatorContext);
  const setSecondaryYAxisType = useDispatchUpdateParam(
    "matrixSecondaryYAxisType"
  );

  const stockComparisonPoints = React.useMemo(() => {
    const uLeg = selectUnderlyingLeg(currentCalc);
    const stockPrice = !uLeg ? null : getBestStockPrice(uLeg);
    return !estimate || !stockPrice
      ? null
      : getStockComparisonPoints(estimate, stockPrice);
  }, [currentCalc, estimate]);

  const showHighlightedPosition = React.useCallback(
    (pos: Nullable<PositionPair>) => {
      // @ts-ignore
      setShowPosDetail();
      setHighlightedPosition(pos);
    },
    [setHighlightedPosition, setShowPosDetail]
  );

  const { userData } = useSession();

  const completeCalc = React.useMemo(
    () => (currentCalc && isStrategyComplete(currentCalc) ? currentCalc : null),
    [currentCalc]
  );

  // const setResultsVisualization = dispactionUserSettings(
  //   userSettingsActions.setResultsVisualization
  // );
  const updateCalculatorPermission = useDispaction(
    calculatorActions.updatePermission
  );
  const { addSuccessNotification } = useToastNotification();

  const contextSavedCalcs = React.useContext(NewSavedCalcsContext);
  const updateCalculation = api.calculations.updateCalculations.useMutation();

  const copyLink = React.useCallback(async () => {
    //copyLinkUri();
    if (!currentCalc?.id && authStatus === "authenticated") {
      if (currentCalc?.id === null) {
        currentCalc.id = uuid();
      }
      await updateCalculation.mutateAsync({
        calculations: currentCalc,
      });
      if (contextSavedCalcs !== undefined) {
        contextSavedCalcs.setIsRefetch(true);
      }
    }
    copyLinkUriWithText(`${document.location.href}?share=${currentCalc?.id}`);
    addSuccessNotification("Link copied");
  }, [addSuccessNotification]);

  const resultsVisualization = userData?.userSettings?.resultsVisualization;

  //const isMatrix = resultsVisualization === RESULTS_VISUALIZATION.MATRIX;

  const [isMatrix, setIsMatrix] = useState<boolean>(true);

  const currentMultiStrikes = useSelectorSafe((s) => s.multiStrike, null);

  function getCurrentMultiStrikeCalc(
    index: number
  ): Nullable<MultiStrikeCalculation> {
    return currentMultiStrikes[index];
  }

  const [isMultiStrikeMatrix, setMultiStrikeMatrix] = useState<boolean[]>(
    currentMultiStrikes ? currentMultiStrikes.map((_) => true) : []
  );
  useEffect(() => {
    setMultiStrikeMatrix(
      currentMultiStrikes ? currentMultiStrikes.map((_) => true) : []
    );
  }, [currentMultiStrikes]);

  const disabled = isNull(estimate);
  return (
    <Box
      className={[
        css.results,
        resultsVisualization === RESULTS_VISUALIZATION.LINE_GRAPH &&
          css.fullWidth,
      ]}
    >
      {!multiStrikeEstimates ||
        (multiStrikeEstimates.length == 0 && (
          <Box
            className={[css.hasMargin, css.toolbarTop, "py-4"]}
            flexSec="start"
          >
            <StrikeShift disabled={disabled} />
            <ExpiryShift disabled={disabled} />
            <IVChanger
              atmIV={currentCalc?.atmIV || null}
              ivShift={currentCalc?.ivShift || 0}
              disabled={disabled}
            />
            <Box flex-1 flexPri="end">
              <VisualizationToggle
                isMatrix={isMatrix}
                disabled={disabled}
                setIsMatrix={setIsMatrix}
              />
            </Box>
            {featureNotDisabled("SHARE_CALCS") &&
              !currentCalc?.readOnly &&
              false && (
                <Box
                  className={css.overTop}
                  flex-col
                  flexPri="end"
                  style={{ alignSelf: "center" }}
                >
                  <DropdownMenu position="bottomLeft">
                    <Box pv={1 / 2} ph={1 / 3} mv={-1 / 2} ml={-1 / 3}>
                      <Icon small icon="share" colorHalfLink />
                    </Box>
                    <Box flex-col flexSec="stretch" style={{ width: "10em" }}>
                      <RadioLabel
                        onClick={() =>
                          updateCalculatorPermission(
                            CALCULATION_PERMISSION.PRIVATE
                          )
                        }
                        checked={
                          currentCalc?.permission ===
                          CALCULATION_PERMISSION.PRIVATE
                        }
                        label={"Private to me"}
                        padForMenuList
                      />
                      <RadioLabel
                        onClick={() => {
                          updateCalculatorPermission(
                            CALCULATION_PERMISSION.PUBLIC
                          );
                          copyLink();
                        }}
                        checked={
                          currentCalc?.permission ===
                          CALCULATION_PERMISSION.PUBLIC
                        }
                        label={
                          <Box flexSec="center">
                            <span>Share by link</span>
                            <Box ml={1 / 3}>
                              <Icon
                                small
                                icon="copy"
                                onClick={copyLink}
                                colorClickable
                              />
                            </Box>
                          </Box>
                        }
                        padForMenuList
                      />
                    </Box>
                  </DropdownMenu>
                </Box>
              )}
          </Box>
        ))}
      {!estimate || !completeCalc ? (
        <Box className={css.hasMargin}>
          <MatrixPlaceholder
            isBuffering={isCalculating}
            showAgreeTNClink={showAgreeTNClink}
          />
        </Box>
      ) : (
        <Box>
          <ContainerDimensions>
            {({ width }) => {
              const legendStacked = width < 780;
              return isMatrix ? (
                multiStrikeEstimates && multiStrikeEstimates.length > 1 ? (
                  <div className="grid grid-cols-2 gap-x-44">
                    {multiStrikeEstimates.map((mse, index) => (
                      <div key={index} className="flex flex-col">
                        <p className="my-4 font-bold uppercase text-gray-500">
                          Strike {getCurrentMultiStrikeCalc(index).stage}:
                        </p>
                        <Box
                          className={[css.hasMargin, css.toolbarTop, "py-4"]}
                          flexSec="start"
                        >
                          <StrikeShift
                            disabled={disabled || !!multiStrikeEstimates}
                            calc={currentMultiStrikes[index]}
                            index={index}
                          />
                          <ExpiryShift
                            disabled={disabled || !!multiStrikeEstimates}
                          />
                          <IVChanger
                            atmIV={currentCalc?.atmIV || null}
                            ivShift={currentCalc?.ivShift || 0}
                            disabled={disabled || !!multiStrikeEstimates}
                          />
                          <Box flex-1 flexPri="end">
                            <VisualizationToggle
                              isMatrix={isMultiStrikeMatrix[index]}
                              disabled={disabled || !!multiStrikeEstimates}
                              setIsMatrix={(value) => {
                                setMultiStrikeMatrix((prev) => {
                                  let newIsMatrix = [...prev];
                                  newIsMatrix[index] = value;
                                  return newIsMatrix;
                                });
                              }}
                            />
                          </Box>
                          {featureNotDisabled("SHARE_CALCS") &&
                            !currentCalc?.readOnly &&
                            false && (
                              <Box
                                className={css.overTop}
                                flex-col
                                flexPri="end"
                                style={{ alignSelf: "center" }}
                              >
                                <DropdownMenu position="bottomLeft">
                                  <Box
                                    pv={1 / 2}
                                    ph={1 / 3}
                                    mv={-1 / 2}
                                    ml={-1 / 3}
                                  >
                                    <Icon small icon="share" colorHalfLink />
                                  </Box>
                                  <Box
                                    flex-col
                                    flexSec="stretch"
                                    style={{ width: "10em" }}
                                  >
                                    <RadioLabel
                                      onClick={() =>
                                        updateCalculatorPermission(
                                          CALCULATION_PERMISSION.PRIVATE
                                        )
                                      }
                                      checked={
                                        currentCalc?.permission ===
                                        CALCULATION_PERMISSION.PRIVATE
                                      }
                                      label={"Private to me"}
                                      padForMenuList
                                    />
                                    <RadioLabel
                                      onClick={() => {
                                        updateCalculatorPermission(
                                          CALCULATION_PERMISSION.PUBLIC
                                        );
                                        copyLink();
                                      }}
                                      checked={
                                        currentCalc?.permission ===
                                        CALCULATION_PERMISSION.PUBLIC
                                      }
                                      label={
                                        <Box flexSec="center">
                                          <span>Share by link</span>
                                          <Box ml={1 / 3}>
                                            <Icon
                                              small
                                              icon="copy"
                                              onClick={copyLink}
                                              colorClickable
                                            />
                                          </Box>
                                        </Box>
                                      }
                                      padForMenuList
                                    />
                                  </Box>
                                </DropdownMenu>
                              </Box>
                            )}
                        </Box>
                        {isMultiStrikeMatrix[index] ? (
                          <ResultsMatrix
                            className={css["matrix-scroll-ctnr flex"]}
                            stratEst={mse}
                            isBuffering={isCalculating}
                            currentCalc={
                              getCurrentMultiStrikeCalc(
                                index
                              ) as StrategyComplete
                            }
                            showPositionDetail={showHighlightedPosition}
                            setSecondaryYAxisType={setSecondaryYAxisType}
                          />
                        ) : (
                          <ResultsLineGraph
                            estimate={mse}
                            currentCalc={
                              getCurrentMultiStrikeCalc(
                                index
                              ) as StrategyComplete
                            }
                            legendStacked={legendStacked}
                            stockComparisonPoints={stockComparisonPoints}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <ResultsMatrix
                    className={css["matrix-scroll-ctnr"]}
                    stratEst={estimate}
                    isBuffering={isCalculating}
                    currentCalc={currentCalc as StrategyComplete}
                    showPositionDetail={showHighlightedPosition}
                    setSecondaryYAxisType={setSecondaryYAxisType}
                  />
                )
              ) : (
                <ResultsLineGraph
                  estimate={estimate}
                  currentCalc={completeCalc}
                  legendStacked={legendStacked}
                  stockComparisonPoints={stockComparisonPoints}
                />
              );
            }}
          </ContainerDimensions>
        </Box>
      )}
      <Box className={[css.toolbarBottom, css.hasMargin]} flexPri={"start"}>
        <Box className={css._item}>
          <PriceRangeChanger disabled={disabled} />
        </Box>
        <Box className={css._item}>
          <DisplayValueSelector
            disabled={disabled}
            resultsVisualization={resultsVisualization}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Results;
