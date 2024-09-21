import React, { type FC, useContext } from "react";
import { useDispatch } from "react-redux";
import { pipe } from "ramda";

import { type Optional } from "opc-types/lib/util/Optional";
import { type Store } from "opc-types/lib/store/Store";
import { type StratLegStock } from "opc-types/lib/StratLegStock";
import { type StratLegOpt } from "opc-types/lib/StratLegOpt";
import useSelectorSafe from "../../../../store/selectors/useSelectorSafe";
import calcActions from "../../../../store/actions/calculator";
import { StrategyCalculatorContext } from "../StrategyCalculator.container";
// import useDispaction from "~/utils/Redux/useDispaction";
// import { calculatorActions } from "~/pwa/store/actions";
import { type OptionsChainPublicProps } from "./OptionsChain.props";
import OptionsChainView from "./OptionsChain.view";
import { type PriceDataSuccess } from "opc-types/lib/PriceData";
import { ifNotUndefined } from "errable";
import { PRICE_RESULT } from "../../../../../types/enums/PRICE_RESULT";
import getBestStockPrice from "../../../../../utils/Finance/getBestStockPrice";
import { useSession } from "../../Session/SessionProvider";
import userSettingsActions from "../../../../store/actions/userSettings";
import { PREFERENCES } from "../../../../../config/Preferences";
import { CHAIN_COLUMN_CHOICE } from "../../../../../types/enums/CHAIN_COLUMN_CHOICES";

const selectUndElement = (state: Store) =>
  state.currentCalculation?.legsById[
    state.currentCalculation?.underlyingElement || ""
  ] as Optional<StratLegStock>;

const selectPrices: (state: Store) => Optional<PriceDataSuccess> = pipe(
  (state: Store) => ({
    state,
    undElement: selectUndElement(state),
  }),
  ({ state, undElement }) =>
    (undElement && state.prices.data?.[undElement.val]) || undefined,
  ifNotUndefined((prices) =>
    prices.result === PRICE_RESULT.SUCCESS ? prices : undefined
  )
);

const selectCurPrice: (state: Store) => Optional<number> = (state) => {
  const undElement = selectUndElement(state);
  return undElement && getBestStockPrice(undElement);
};

const headingsSetDetails = ["l", "c", "b", "m", "a", "i", "v", "d", "iv"];
const headingsSetSimple = ["l", "b", "m", "a"];

const OptionsChainContainer: FC<OptionsChainPublicProps> = (
  props: OptionsChainPublicProps
) => {
  const {
    userData: {
      userSettings: { chainColumns: userSettingsChainColumns },
    },
  } = useSession();

  const prices: Optional<PriceDataSuccess> = useSelectorSafe(selectPrices);
  const {
    currentCalc,
    showChainForLeg,
    setShowChainForLeg,
    currentCalcForResults,
  } = useContext(StrategyCalculatorContext);
  const curPrice: Optional<number> = useSelectorSafe(selectCurPrice);
  const dispatch = useDispatch();
  const currentMultiStrikes = useSelectorSafe((s) => s.multiStrike, null);
  const strikeStages = ["A", "B", "C", "D", "E"];
  // const addNewLeg = useDispaction(calculatorActions.addLeg);
  const multiStrikeToggle = useSelectorSafe((s) => s.multiStrikeToggle, false);

  const setOptions = React.useCallback(
    (
      expiry: string,
      type: "call" | "put",
      strike: number,
      price: number,
      iv: number,
      multiStrike = true
    ) => {
      let multiStrikeOffset = 0;
      if (showChainForLeg !== null) {
        dispatch(
          calcActions.updateParam({
            legId: showChainForLeg,
            paramChain: ["legsById", showChainForLeg, "expiry"],
            paramValue: expiry,
            meta: { prices },
            multiStrike: multiStrike,
          })
        );
        dispatch(
          calcActions.updateParam({
            legId: showChainForLeg,
            paramChain: ["legsById", showChainForLeg, "strike"],
            paramValue: strike,
            meta: { prices },
            multiStrike: multiStrike,
          })
        );
        dispatch(
          calcActions.updateParam({
            legId: showChainForLeg,
            paramChain: ["legsById", showChainForLeg, "opType"],
            paramValue: type,
            meta: { prices },
            multiStrike: multiStrike,
          })
        );
        dispatch(
          calcActions.updateParam({
            legId: showChainForLeg,
            paramChain: ["legsById", showChainForLeg, "price"],
            paramValue: price,
            meta: { prices },
            multiStrike: multiStrike,
          })
        );
        dispatch(
          calcActions.updateParam({
            legId: showChainForLeg,
            paramChain: ["legsById", showChainForLeg, "iv"],
            paramValue: iv,
            meta: { prices },
            multiStrike: multiStrike,
          })
        );

        if (currentCalc && multiStrikeToggle) {
          const newStage = {
            ...currentCalc,
            // @ts-ignore
            legsById: {
              ...currentCalc.legsById,
              option: {
                ...currentCalc.legsById.option,
                // @ts-ignore
                strike: strike,
                iv: iv,
                price: price,
                opType: type,
                expiry: expiry,
              },
            },
            timeOfCalculation: currentCalc.timeOfCalculation
              ? currentCalc.timeOfCalculation
              : new Date().getTime(),
            stage:
              currentMultiStrikes && currentMultiStrikes?.length > 0
                ? strikeStages[
                    strikeStages.indexOf(
                      currentMultiStrikes[currentMultiStrikes?.length - 1].stage
                    ) + 1
                  ]
                : "A",
          };
          if (currentMultiStrikes.length === 5) {
            dispatch(
              calcActions.replaceLastStrike({ ...newStage, stage: "E" })
            );
            setShowChainForLeg(null);
            return;
          }
          if (
            currentMultiStrikes.find(
              // @ts-ignore
              (ms) => ms.legsById.option.strike == strike
            )
          ) {
            dispatch(calcActions.removeStrike(strike));
            multiStrikeOffset = -2;
          } else {
            dispatch(calcActions.addStrike(newStage));
          }
          currentMultiStrikes?.length + multiStrikeOffset === 4
            ? setShowChainForLeg(null)
            : null;
        }
      }
      ///// doesn't close a pop-up when set strike
      !multiStrikeToggle
        ? setShowChainForLeg(null)
        : currentMultiStrikes?.length + multiStrikeOffset === 5
        ? setShowChainForLeg(null)
        : null;
    },
    [
      dispatch,
      showChainForLeg,
      setShowChainForLeg,
      prices,
      currentCalcForResults,
    ]
  );

  const columnsChoice =
    userSettingsChainColumns.length === 1
      ? userSettingsChainColumns[0] === CHAIN_COLUMN_CHOICE.SIMPLE
        ? CHAIN_COLUMN_CHOICE.SIMPLE
        : userSettingsChainColumns[0] === CHAIN_COLUMN_CHOICE.DETAILS
        ? CHAIN_COLUMN_CHOICE.DETAILS
        : PREFERENCES.DEFAULT_COLUMN_CHOICE
      : PREFERENCES.DEFAULT_COLUMN_CHOICE;

  const chainColumns = {
    [CHAIN_COLUMN_CHOICE.SIMPLE]: headingsSetSimple,
    [CHAIN_COLUMN_CHOICE.DETAILS]: headingsSetDetails,
  }[columnsChoice];

  return (
    <OptionsChainView
      close={props.close}
      columnsChoice={columnsChoice}
      prices={prices?.options}
      // @ts-ignore
      defaultExpiry={
        (currentCalc?.legsById[showChainForLeg || ""] as StratLegOpt)?.expiry ||
        null
      }
      curPrice={curPrice || 0}
      onSelectOption={setOptions}
      currentCalc={currentCalc}
      currentLeg={showChainForLeg}
      chainColumns={chainColumns}
      setChainColumns={(cols) => {
        dispatch(userSettingsActions.setChainColumns(cols));
      }}
      isDraggable={props.isDraggable}
    />
  );
};

export default OptionsChainContainer;
