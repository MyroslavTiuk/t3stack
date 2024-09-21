import React, { type FC, useContext, useEffect, useState, useRef } from "react";
import { isNil } from "ramda";
import { useRouter } from "next/router";

import { type PositionPair } from "opc-types/lib/PositionPair";
import { type Strategy, type StrategyComplete } from "opc-types/lib/Strategy";
import { type StrategyEstimate } from "opc-types/lib/StrategyEstimate";
import { type Nullable } from "opc-types/lib/util/Nullable";

import { LAYOUT_OPTIONS } from "../../../../types/enums/LAYOUT_OPTIONS";
import { ASYNC_STATUS } from "../../../../types/enums/ASYNC_STATUS";
import userSettingsActions from "../../../store/actions/userSettings";
import useSelectorSafe from "../../../store/selectors/useSelectorSafe";
import selectSymbolPrices from "../../../store/selectors/prices/selectSymbolPrices";
import useGetPrice from "../../../../services/priceData/useGetPrice";
import l from "../../../../services/logger";
import Env from "../../../../config/Env";
import useUpdatePricesIfCurrentCalcHasSymbol from "../../../../services/priceData/useUpdatePricesIfCurrentCalcHasSymbol";
// import { rand } from "../../../../utils/Data/Rand/Rand";
import isStrategyComplete from "../../../../utils/Finance/isStrategyComplete";
import useMediaQuery from "../../../../utils/Hooks/useMediaQuery";
import useModal from "../../primitives/Modal/useModal";
import noop from "../../../../utils/Functional/noop";
import { useCalculations } from "../../../../services/UserData/CalculationsProvider";
import useDispaction from "../../../../utils/Redux/useDispaction";
import calcActions from "../../../store/actions/calculator";
import ROUTE_PATHS from "../../../../consts/ROUTE_PATHS";
import analyticsActions, {
  type LegDesc,
} from "../../../store/actions/analytics";
import selectUnderlyingLeg from "../../../store/selectors/currentCalculation/selectUnderlyingLeg";
import filterOptionLegs from "../../../store/selectors/currentCalculation/filterOptionLegs";
import legsWithIds from "../../../store/selectors/currentCalculation/legsWithIds";

import useTNC from "../TermsAndConditions/useTNC";
import useRefreshCalculation from "./Results/utils/useRefreshCalculation";
import {
  type StrategyCalculatorProps,
  type StrategyCalculatorPublicProps,
} from "./StrategyCalculator.props";
// eslint-disable-next-line import/no-cycle
import StrategyCalculatorView from "./StrategyCalculator.view";
import { useSession } from "../Session/SessionProvider";
import { trackDimension } from "../../../../services/Experiments/initExperiments";
import { EXPERIMENTS } from "../../../../services/Experiments/experiments";
import getWindow from "../../../../utils/Html/getWindow";
import Spinner from "../../primitives/Spinner";
import Box from "../../primitives/Box";
import T from "../../primitives/Typo";
import NewSavedCalculations from "./NewSavedCalculations";
import { NewSavedCalcsProvider } from "./NewSavedCalculations/NewSavedCalculationsContext";
import { strategyEstimates } from "~/services/calculate/strategyEstimates";

type CalcAndEstimate = {
  calculation: StrategyComplete;
  estimate: StrategyEstimate;
};

export const StrategyCalculatorContext = React.createContext({
  showChainForLeg: null as Nullable<string>,
  setShowChainForLeg: noop as React.Dispatch<
    React.SetStateAction<Nullable<string>>
  >,
  highlightedPosition: null as Nullable<PositionPair>,
  setHighlightedPosition: noop as React.Dispatch<
    React.SetStateAction<Nullable<PositionPair>>
  >,
  showAgreeTNClink: false,
  isCalculating: false,
  estimate: null as Nullable<StrategyEstimate>,
  estimateForResults: null as Nullable<StrategyEstimate>,
  currentCalc: null as Nullable<Strategy>,
  currentCalcForResults: null as Nullable<Strategy>,
  focusLinkedField: null as Nullable<string>,
  setFocusLinkedField: noop as (fieldName: Nullable<string>) => void,
  showPosDetail: false,
  setShowPosDetail: noop as React.Dispatch<React.SetStateAction<boolean>>,
  previewCalcEst: null as Nullable<CalcAndEstimate>,
  setPreviewCalcEst: noop as React.Dispatch<
    React.SetStateAction<Nullable<CalcAndEstimate>>
  >,
  showStrategySelector: false,
  showStratSelectionFull: false,
  setShowStratSelectionFull: noop as React.Dispatch<
    React.SetStateAction<boolean>
  >,
  preStrategyStockCode: "",
  setPreStrategyStockCode: noop as React.Dispatch<React.SetStateAction<string>>,
  getSymbPrices: noop,
  setFtuxStage: noop as (val: number) => void,
  initialFtuxStage: 0,
});

// const getBufferTime = (strat: StrategyEstimate) => {
//   if (!strat?.theoPoints) return 0;
//   const expiries = Object.keys(
//     // @ts-ignore (It is correct that theoPoints should be Record<string> / ObjRecord<...>)
//     strat?.theoPoints[Object.keys(strat?.theoPoints || {})[0] as number] || {}
//   );
//   return Env.IS_DEV ? 20 : rand(100, 200) + expiries.length * rand(35, 50);
// };

// const useCalculatingBuffer = (newEstimate: Nullable<StrategyEstimate>) => {
//   const [isCalculating, setCalculating] = useState(false);
//   const [estimate, setEstimate] = useState<Nullable<StrategyEstimate>>(null);

//   useUpdatePricesIfCurrentCalcHasSymbol();

//   React.useEffect(() => {
//     if (newEstimate) {
//       setCalculating(true);
//       const timeOutId = setTimeout(() => {
//         setCalculating(false);
//         setEstimate(newEstimate);
//       }, getBufferTime(newEstimate));
//       return () => clearTimeout(timeOutId);
//     }
//     setCalculating(false);
//     setEstimate(newEstimate);
//   }, [newEstimate]);
//   return [isCalculating, estimate] as [boolean, Nullable<StrategyEstimate>];
// };

const StrategyCalculatorContainer: FC<StrategyCalculatorPublicProps> = (
  props: StrategyCalculatorPublicProps
) => {
  const { userData, dispactionUserSettings } = useSession();
  const userIsAuthed = userData.profileLoaded;
  const resultsVisualization = userData.userSettings.resultsVisualization;
  const viewStacked = userData.userSettings.layout === LAYOUT_OPTIONS.STACKED;
  React.useEffect(() => {
    trackDimension(EXPERIMENTS.LAYOUT, userData.userSettings.layout);
  }, [viewStacked]);

  const [showChainForLeg, setShowChainForLeg] =
    useState<Nullable<string>>(null);
  const {
    showAcceptTNCModal,
    hasAcceptedTNC,
    isLoadingTNCacceptanceStatus,
    tncModalShown,
    setTncModalShownTrue,
  } = useTNC();
  const [focusLinkedField, setFocusLinkedField] =
    React.useState<Nullable<string>>(null);
  const [showStratSelectionFull, setShowStratSelectionFull] =
    React.useState(false);
  const [preStrategyStockCode, setPreStrategyStockCode] = React.useState("");
  const [previewCalcEst, setPreviewCalcEst]: [
    Nullable<CalcAndEstimate>,
    React.Dispatch<React.SetStateAction<Nullable<CalcAndEstimate>>>
  ] = React.useState<Nullable<CalcAndEstimate>>(null);

  const newEstimate: Nullable<StrategyEstimate> = useRefreshCalculation(
    props.currentCalc
  );
  // todo: estimates

  const currentMultiStrikes = useSelectorSafe((s) => s.multiStrike, null);

  const estimates = currentMultiStrikes
    ?.filter((s) => s.legs)
    .map((s) =>
      strategyEstimates(s, {
        stockChangeInValue: userData.userSettings.stockChangeInValue,
        timeDecayBasis: userData.userSettings.timeDecayBasis,
        closePriceMethod: userData.userSettings.closePriceMethod,
      })
    );

  useUpdatePricesIfCurrentCalcHasSymbol();
  const [isCalculating, estimate] = [false, newEstimate]; // useCalculatingBuffer(newEstimate);
  const [highlightedPosition, setHighlightedPosition] =
    useState<Nullable<PositionPair>>(null);
  const [showPosDetail, setShowPosDetail] = React.useState(false);
  const lockScrollOnChainOpen = useMediaQuery("tablet-large-down");
  const { setModalOpen } = useModal();

  const curSymb = selectUnderlyingLeg(props.currentCalc)?.val;
  const symbolPrices = useSelectorSafe(selectSymbolPrices(curSymb || ""));
  const priceStatus = useSelectorSafe((s) => s.prices.status);

  useEffect(
    function lockOrUnlockScrollingOnChainToggle() {
      setModalOpen(Boolean(showChainForLeg) && lockScrollOnChainOpen);
    },
    [lockScrollOnChainOpen && showChainForLeg]
  );
  const getPrices = useGetPrice();
  // useEffect(() => {
  //   const prices = getPrices("TSLA")
  //   console.log(prices)
  // }, [getPrices]);
  const getSymbPrices = React.useCallback(() => {
    if (curSymb) {
      getPrices(curSymb);
    }
  }, [getPrices, curSymb]);
  React.useEffect(
    function getPricesOnChainOpenIfNoPricing() {
      if (
        priceStatus !== ASYNC_STATUS.LOADING &&
        !!showChainForLeg &&
        !symbolPrices &&
        curSymb
      ) {
        getSymbPrices();
      }
    },
    [
      !symbolPrices &&
        priceStatus !== ASYNC_STATUS.LOADING &&
        !!curSymb &&
        showChainForLeg,
    ]
  );

  const formCompleted = React.useMemo(() => {
    return (
      !isNil(props.currentCalc) &&
      isStrategyComplete(props.currentCalc, {
        checkTimeOfCalculation: false,
      })
    );
  }, [props.currentCalc, isStrategyComplete]);

  const dispatchTrackCalc = useDispaction(analyticsActions.calculation);
  // todo: This only tracks the event on the first formCompletion
  useEffect(() => {
    if (formCompleted && props.currentCalc) {
      const stratKey = props.currentCalc?.metadata.stratKey;
      if (stratKey) {
        dispatchTrackCalc({
          symbol: selectUnderlyingLeg(props.currentCalc)?.val || "",
          strategy: stratKey,
          legs: legsWithIds(filterOptionLegs(props.currentCalc)).reduce(
            (completeLegs, leg) => {
              const { strike, expiry, opType, act } = leg;
              if (strike && expiry && opType && act) {
                completeLegs.push({
                  strike,
                  expiry,
                  opType,
                  act,
                });
              }
              return completeLegs;
            },
            [] as LegDesc[]
          ),
        });
      }
    }
  }, [formCompleted]);

  const setLayout = dispactionUserSettings(userSettingsActions.setLayout);
  const dispatchFtuxStage = dispactionUserSettings(
    userSettingsActions.setFtuxStage
  );
  const setFtuxStage = React.useCallback(dispatchFtuxStage, [
    dispatchFtuxStage,
  ]);
  const initialFtuxStage = userData?.userSettings.ftuxStage;
  const trackViewStackToggle = useDispaction(analyticsActions.toggleLayout);
  const toggleViewStacked = React.useCallback(() => {
    const newLayout = viewStacked
      ? LAYOUT_OPTIONS.SIDE_BY_SIDE
      : LAYOUT_OPTIONS.STACKED;
    setLayout(newLayout);
    trackViewStackToggle(newLayout);
  }, [viewStacked, setLayout]);

  React.useEffect(
    function setModalShownOnAcceptTNC() {
      if (hasAcceptedTNC) {
        setTncModalShownTrue();
      }
    },
    [hasAcceptedTNC, setTncModalShownTrue]
  );

  useEffect(
    function showTNCModalWhenNeeded() {
      const formAccepted = localStorage.getItem("formAccepted");

      if (
        formCompleted &&
        !isLoadingTNCacceptanceStatus &&
        !hasAcceptedTNC &&
        !tncModalShown &&
        !formAccepted
      ) {
        showAcceptTNCModal();
      }
      if (!formAccepted) {
        localStorage.setItem("formAccepted", "true");
      }
    },
    [
      formCompleted &&
        !isLoadingTNCacceptanceStatus &&
        !hasAcceptedTNC &&
        !tncModalShown,
      showAcceptTNCModal,
    ]
  );

  const { saveCalculation } = useCalculations();
  const [isCloning, setCloning] = React.useState(false);

  const cloneCalc = React.useCallback(() => {
    // const currentCalcWithResetId = assoc("id", null, props.currentCalc);
    setCloning(true);
    // saveCalculation(currentCalcWithResetId as unknown as StrategyComplete).then(
    //   ({ id }) => {
    //     setCloning(false);
    //     if (!isUndefined(id)) {
    //       addSuccessNotification('New copy saved');
    //     } else {
    //       addErrorNotification('Could not save copy');
    //     }
    //   },
    // );
  }, [setCloning, props.currentCalc, saveCalculation]);

  const router = useRouter();

  const resetCurrentCalc = useDispaction(calcActions.resetCurrentCalc);

  const newCalc = React.useCallback(() => {
    if (Env.DEBUG_REDIRECTS) {
      l.debug("Redirecting [newCalc callback] to", ROUTE_PATHS.CALCULATOR_NEW);
    }
    const win = getWindow();
    win?.scrollTo && win?.scrollTo(0, 0);
    router.push(
      { pathname: ROUTE_PATHS.CALCULATOR_NEW /*, query: { new: 'true' } */ },
      `${ROUTE_PATHS.CALCULATOR_NEW}`,
      { shallow: true }
    );
  }, [resetCurrentCalc, router.query]);

  const currentCalcForResults = props.showStrategySelector
    ? null
    : previewCalcEst?.calculation
    ? previewCalcEst.calculation
    : props.currentCalc;

  const estimateForResults = props.showStrategySelector
    ? null
    : previewCalcEst?.estimate
    ? previewCalcEst.estimate
    : estimate;

  const multiStrike = useSelectorSafe((s) => s.multiStrikeToggle, false);

  // todo: consider if it is duplication to pass some of these into the view as well as in the provider
  const combinedProps: StrategyCalculatorProps = {
    hasAcceptedTNC,
    showChainForLeg,
    setShowChainForLeg,
    isCalculating,
    estimate,
    currentCalcForResults,
    estimateForResults,
    formCompleted,
    showPosDetail,
    setShowPosDetail,
    cloneCalc,
    newCalc,
    isCloning,
    userIsAuthed,
    showStratSelectionFull,
    setShowStratSelectionFull,
    resultsVisualization,
    toggleViewStacked,
    viewStacked,
    // @ts-ignore
    multiStrikeEstimates: multiStrike ? estimates : [],
    ...props,
  };

  const refd = useRef(null);

  useEffect(() => {
    if (router.query.symbol && router.query.expiration) {
      setTimeout(() => {
        const selectBtn: HTMLButtonElement = refd.current.querySelector(
          "[class*='Entry_openChainButton']"
        );
        selectBtn && selectBtn.click();
      }, 500);

      const handleMutation = (mutationsList, observer) => {
        mutationsList.forEach((mutation) => {
          if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
            const elements = refd.current.querySelectorAll(
              "[class*='OptionsChain__table'] tbody > tr > td:first-child"
            );

            if (elements.length > 0) {
              elements.forEach((element) => {
                const price = element.textContent.split("(")[0];
                if (
                  Number(price.replace("C", "")) ===
                  Number(router.query.leg1strike)
                ) {
                  element.click();
                }
              });

              if (router.query.act === "sell") {
                const buySelect = refd.current.querySelector(
                  "[class*='TradeToggle__holder__']"
                );
                buySelect && buySelect.click();
              }

              const enterKeyPress = new KeyboardEvent("keypress", {
                key: "Enter",
                code: "Enter",
                keyCode: 13,
              });

              setTimeout(() => {
                if (router.query.num) {
                  const inputNum = refd.current.querySelector(
                    "[class*='OptionLeg_container'] [class*='Entry_--id-quantity'] input"
                  );
                  inputNum.focus();
                  inputNum.value = router.query.num;
                  inputNum.setAttribute("value", router.query.num);

                  inputNum.dispatchEvent(new Event("change"));
                  inputNum.dispatchEvent(new Event("input"));

                  inputNum.dispatchEvent(enterKeyPress);
                  inputNum.blur();
                }

                if (router.query.leg1price) {
                  const inputPrice = refd.current.querySelector(
                    "[class*='OptionLeg_container'] [class*='Entry_--id-price'] input"
                  );

                  inputPrice.focus();
                  inputPrice.value = router.query.leg1price;
                  inputPrice.setAttribute("value", router.query.leg1price);
                  inputPrice.dispatchEvent(new Event("change"));
                  inputPrice.dispatchEvent(new Event("input"));

                  inputPrice.dispatchEvent(
                    new KeyboardEvent("keypress", {
                      key: "Enter",
                      code: "Enter",
                      keyCode: 13,
                    })
                  );

                  inputPrice.blur();
                }
              });

              observer.disconnect();
            }
          }
        });
      };

      const observer = new MutationObserver(handleMutation);

      observer.observe(refd.current, { childList: true, subtree: true });

      return () => {
        observer.disconnect();
      };
    }
  }, [router]);

  return (
    <StrategyCalculatorContext.Provider
      value={{
        showChainForLeg,
        setShowChainForLeg,
        highlightedPosition,
        setHighlightedPosition,
        isCalculating,
        showAgreeTNClink: tncModalShown && !hasAcceptedTNC,
        currentCalc: props.currentCalc,
        estimate,
        currentCalcForResults,
        estimateForResults,
        focusLinkedField,
        setFocusLinkedField,
        showPosDetail,
        // @ts-ignore
        setShowPosDetail,
        previewCalcEst,
        setPreviewCalcEst,
        showStratSelectionFull,
        setShowStratSelectionFull,
        preStrategyStockCode,
        setPreStrategyStockCode,
        showStrategySelector: props.showStrategySelector,
        getSymbPrices,
        setFtuxStage,
        initialFtuxStage,
      }}
    >
      {props.isLoading ? (
        <Box
          flex-center
          flex-col
          pv={4}
          style={{ minHeight: "calc(100vh - 40px)" }}
        >
          <Spinner />
          <T content-hint mt={1 / 4}>
            Loading
          </T>
        </Box>
      ) : (
        <NewSavedCalcsProvider>
          <div className="flex">
            <div className="border-r-2">
              <NewSavedCalculations />
            </div>
            <div className="mb-24 w-full" ref={refd}>
              <StrategyCalculatorView {...combinedProps} />
            </div>
          </div>
        </NewSavedCalcsProvider>
      )}
    </StrategyCalculatorContext.Provider>
  );
};

export default StrategyCalculatorContainer;

export const useStrategyCalculator = () =>
  useContext(StrategyCalculatorContext);
