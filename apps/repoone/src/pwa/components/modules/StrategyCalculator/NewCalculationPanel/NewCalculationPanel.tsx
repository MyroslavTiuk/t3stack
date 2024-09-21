import React, { type FC, useCallback, useEffect, useMemo } from "react";

import { type StratName } from "opc-types/lib/StratName";

import { ASYNC_STATUS } from "../../../../../types/enums/ASYNC_STATUS";
import arePricesOutOfDate from "../../../../../utils/Finance/arePricesOutOfDate";
import Box from "../../../primitives/Box";
import FieldSet from "../../../primitives/FieldSet";
import Button from "../../../primitives/Button";
import T from "../../../primitives/Typo";
import Link from "../../../primitives/Link";
import HELP_TEXT from "../../../../../consts/HELP_TEXT";
import ROUTE_PATHS from "../../../../../consts/ROUTE_PATHS";
import CONTENT_PATHS from "../../../../../consts/CONTENT_PATHS";
import Interface from "../../../../../config/Interface";
import useSelectorSafe from "../../../../store/selectors/useSelectorSafe";
import calcActions from "../../../../store/actions/calculator";
import selectPriceError from "../../../../store/selectors/prices/selectPriceError";
import useGetPrice from "../../../../../services/priceData/useGetPrice";
import { UseUpdatePricesIfCurrentCalcHasSymbol } from "../../../../../services/priceData/useUpdatePricesIfCurrentCalcHasSymbol";
import noop from "../../../../../utils/Functional/noop";
import useReducerLocalSetter from "../../../../../utils/Hooks/useReducerLocalSetter";
import useDispaction from "../../../../../utils/Redux/useDispaction";
import analyticsActions from "../../../../store/actions/analytics";
import userSettingsActions from "../../../../store/actions/userSettings";
import Strategies from "../../../../../model/Strategies";
import clx from "../../../../../utils/Html/clx";
import StrategySelectorView from "../../StrategySelector/StrategySelector.view";
import { useSession } from "../../Session/SessionProvider";

import fmtInputToState from "../StockLeg/utils/fmtInputToState";
import { valFmtStateToInput } from "../StockLeg/utils/fmtStateToInput";
import StockLegView from "../StockLeg/StockLeg.view";
import entryCss from "../Entry/Entry.module.scss";
import css from "./NewCalculationPanel.module.scss";
import Icon from "../../../primitives/Icon";
import usePartialledCallback from "../../../../../utils/Hooks/usePartialledCallback";

interface NewCalculationPanelProps {
  symb?: string;
  showStratSelectionFull: boolean;
  setShowStratSelectionFull: React.Dispatch<React.SetStateAction<boolean>>;
  preStrategyStockCode: string;
  setPreStrategyStockCode: React.Dispatch<React.SetStateAction<string>>;
  showFieldSets?: boolean;
  showAllStrats?: boolean;
  showQuick?: boolean;
}

const useNewCalcPanel = () => {
  const priceInfo = useSelectorSafe((s) => s.prices, {
    status: ASYNC_STATUS.INITIAL,
    data: undefined,
    errors: [],
  });
  const currentStoreCalc = useSelectorSafe((s) => s.currentCalculation, null);
  const getPrice = useGetPrice();

  const initStrat = useDispaction(calcActions.init);
  const trackSearch = useDispaction(analyticsActions.search);
  const trackUI = useDispaction(analyticsActions.basicInteraction);
  const trackUseRecent = usePartialledCallback(trackUI, [
    "Clicked recent strategy",
  ]);

  const { defaultDisplayValueType } = useSession().userData.userSettings;

  return {
    priceInfo,
    getPrice,
    initStrat,
    defaultDisplayValueType,
    currentStoreCalc,
    trackSearch,
    trackUseRecent,
  };
};

const BASIC_STOCKLEG_STATE_PROPS = {
  act: null,
  num: null,
  linkNum: false,
  price: null,
};

const BASIC_STOCKLEG_SETTINGS = {
  allowPurchase: false,
  changeAct: false,
  suggestedNum: [],
};

const NewCalculationPanel: FC<NewCalculationPanelProps> = (
  props: NewCalculationPanelProps
): ReturnType<typeof Box> => {
  const logic = useNewCalcPanel();
  const {
    setShowStratSelectionFull,
    preStrategyStockCode,
    setPreStrategyStockCode,
  } = props;

  const showSymbInput = Interface.CALCULATOR_NEW_SHOW_SYMBOL_INPUT;
  const showRecentsSideBySide = !props.showFieldSets;

  const fmtValInputToState = fmtInputToState("val");
  const { update: updateStockLeg, state: stockLeg } = useReducerLocalSetter({
    val: valFmtStateToInput(props.preStrategyStockCode || ""),
    ...BASIC_STOCKLEG_STATE_PROPS,
  });

  const [options, setOptions] = React.useState([
    {
      val: valFmtStateToInput(props.preStrategyStockCode || ""),
      ...BASIC_STOCKLEG_STATE_PROPS,
    },
  ]);

  // setOptions([...options, {
  //   val: "",
  //   ...BASIC_STOCKLEG_STATE_PROPS,
  // }])

  useEffect(() => {
    setOptions([
      ...options,
      {
        val: valFmtStateToInput(props.preStrategyStockCode || ""),
        ...BASIC_STOCKLEG_STATE_PROPS,
      },
    ]);
  }, []);

  // updateStockLegs("options", [...stockLegs.options, {
  //   val: valFmtStateToInput(props.preStrategyStockCode || ""),
  //   ...BASIC_STOCKLEG_STATE_PROPS,
  // }])
  // console.log("multi symbol: ", stockLegs.options)

  const priceError = selectPriceError(stockLeg.val)({
    prices: logic.priceInfo,
  });

  const valOnChange = React.useCallback(
    (val: string) => {
      updateStockLeg("val", val);
    },
    [updateStockLeg]
  );

  const valOnSelect = React.useCallback(
    (val: string) => {
      const strippedVal = fmtValInputToState(val);
      if (strippedVal.toUpperCase() !== preStrategyStockCode.toUpperCase()) {
        logic.trackSearch(strippedVal);
        updateStockLeg("val", valFmtStateToInput(val));
        setPreStrategyStockCode(strippedVal);
        const symbPriceData = logic.priceInfo.data?.[strippedVal];
        if (
          strippedVal &&
          (!symbPriceData || arePricesOutOfDate(symbPriceData))
        ) {
          logic.getPrice(strippedVal.toUpperCase());
        }
      }
    },
    [
      updateStockLeg,
      setPreStrategyStockCode,
      preStrategyStockCode,
      logic.trackSearch,
      logic.priceInfo.data?.[preStrategyStockCode]?.retrievedTime || 0,
    ]
  );
  const stockPriceData = logic.priceInfo.data?.[preStrategyStockCode];

  const clearCurrentCalc = useDispaction(calcActions.resetCurrentCalc);
  const showMore = React.useCallback(() => {
    setShowStratSelectionFull((v: boolean) => !v);
  }, [setShowStratSelectionFull]);

  // todo: Consider using SymbolAutocomplete component instead
  const StockLegViewNode = !showSymbInput ? null : (
    <Box className={css.symbol}>
      <StockLegView
        leg={stockLeg}
        settings={BASIC_STOCKLEG_SETTINGS}
        chainAvailable={!!stockPriceData?.options}
        prices={stockPriceData?.stock || undefined}
        priceError={priceError}
        priceChoices={[]}
        lastRetrieved={stockPriceData?.retrievedTime}
        priceStatus={logic.priceInfo.status}
        onPriceRefresh={noop}
        valOnChange={valOnChange}
        valOnSelect={valOnSelect}
        actOnChange={noop}
        actOnSelect={noop}
        priceOnChange={noop}
        priceOnSelect={noop}
        numOnChange={noop}
        numOnSelect={noop}
        linkNumOnSelect={noop}
        alwaysShowPricing={false}
        dontShowPricing={!props.showFieldSets}
        atmIV={null}
        hideTip={noop}
        shouldShowTip={false}
        setFocusLinkedField={noop}
        focusLinkedField={null}
        inputMethod={"stacked"}
        inputMethodMobile={"stacked"}
      />
    </Box>
  );

  const { dispactionUserSettings, userData } = useSession();
  const updateRecentStrategies = dispactionUserSettings(
    userSettingsActions.addRecentStrategy
  );

  const onClick = useCallback(
    (value: StratName) => {
      clearCurrentCalc();
      updateRecentStrategies(value);
    },
    [clearCurrentCalc]
  );

  const strategies = Strategies.getStrategies();

  const recentStrategies = useMemo(() => {
    return (
      (userData?.userSettings?.recentStrategies || [])
        /**
         * todo: consider filtering out the quick-access ones.
         *  This could cause problems as the quick-access strats could bump off other strats
         *  from the recentStrats list, reducing the number visible to less than 5
         */
        // .filter((item: StratName) =>
        //   !['long-call', 'long-put', 'vertical-spread'].includes(item),
        // )
        .map((item: StratName) => {
          return strategies[item];
        })
    );
  }, [userData?.userSettings?.recentStrategies]);

  const stratButtonCommonProps = {
    className: clx([css.button, props.showFieldSets && css["--full-width"]]),
    "in-set": true,
    link: ROUTE_PATHS.CALCULATOR,
    linkQuery: preStrategyStockCode
      ? { code: preStrategyStockCode }
      : undefined,
  };
  const StratButtonSetNode = (
    <>
      <Box mt={props.showFieldSets ? 1 / 2 : 0}>
        <Box
          className={[
            css.quickButtonsCtnr,
            showRecentsSideBySide && css["--sideBySide"],
          ]}
          mb={1}
        >
          {!showSymbInput
            ? null
            : !props.showFieldSets && (
                <T content-fields-set-label>Select a strategy</T>
              )}
          {![].length ? null : (
            <Box
              className={[
                css.recentCtnr,
                showRecentsSideBySide && css["--sideBySide"],
              ]}
              ph={1}
              pv={1 / 2}
            >
              <T content-tag anemic className={css.recentListHeading}>
                Recently used strategies
              </T>
              <Box className={[css.recent, "list"]} tagName={"ul"} mt={1 / 3}>
                {recentStrategies.map((item) => (
                  <T
                    key={item?.title}
                    tagName={"li"}
                    content-pragmatic
                    className={css._item}
                    onClick={logic.trackUseRecent}
                  >
                    <Link
                      to={ROUTE_PATHS.CALCULATOR}
                      query={
                        preStrategyStockCode
                          ? { code: preStrategyStockCode }
                          : undefined
                      }
                      payload={{ strat: item?.metadata?.stratKey }}
                    >
                      {item?.title}
                    </Link>
                  </T>
                ))}
              </Box>
            </Box>
          )}
          {props.showQuick && (
            <Box mv={2} flex>
              <Button
                {...stratButtonCommonProps}
                set-first
                title="Call option calculator"
                linkPayload={{ strat: "long-call" }}
                onClick={() => onClick("long-call")}
              >
                <Box flexSec="center">
                  <Icon
                    icon={`strategy-long-call`}
                    ctnrClassName={css.__icon}
                    noSize
                  />
                  <T ml={1 / 3}>Call</T>
                </Box>
              </Button>
              <Button
                {...stratButtonCommonProps}
                title="Put option calculator"
                linkPayload={{ strat: "long-put" }}
                onClick={() => onClick("long-put")}
              >
                <Box flexSec="center">
                  <Icon
                    icon={`strategy-long-put`}
                    ctnrClassName={css.__icon}
                    noSize
                  />
                  <T ml={1 / 3}>Put</T>
                </Box>
              </Button>
              <Button
                {...stratButtonCommonProps}
                set-last
                title="Vertical spread calculator"
                linkPayload={{ strat: "vertical-spread" }}
                onClick={() => onClick("vertical-spread")}
              >
                <Box flexSec="center">
                  <Icon
                    icon={`strategy-call-debit-put-credit-spread-bullish-collar`}
                    ctnrClassName={css.__icon}
                    noSize
                  />
                  <T ml={1 / 3}>Spread</T>
                </Box>
              </Button>
            </Box>
          )}
          {!props.showAllStrats && (
            <T content-pragmatic clickable hinted onClick={showMore} mv={1}>
              Choose from all strategies
            </T>
          )}
        </Box>
      </Box>
      <Box>
        {props.showAllStrats && props.showQuick && (
          <Box className={css.or} flexSec="center" mv={2}>
            <T content-pragmatic>Or choose from all strategies</T>
          </Box>
        )}
      </Box>
    </>
  );

  return (
    <Box className={css.container}>
      {props.showFieldSets && <UseUpdatePricesIfCurrentCalcHasSymbol />}
      {!showSymbInput ? null : !props.showFieldSets ? (
        <Box mv={2}>
          <T content-fields-set-label mt={2}>
            Underlying stock symbol
          </T>
          {StockLegViewNode}
        </Box>
      ) : (
        <FieldSet
          title={"Underlying stock symbol"}
          helpIconText={HELP_TEXT.STOCK_LEG}
          helpClickThroughPath={CONTENT_PATHS.HELP_STOCK_LEG}
          className={entryCss.fieldSetCtnr}
        >
          {StockLegViewNode}
        </FieldSet>
      )}
      {!props.showFieldSets ? (
        <>
          {StratButtonSetNode}
          {props.showAllStrats && (
            <StrategySelectorView
              plain
              symb={preStrategyStockCode}
              splitCustom={false}
            />
          )}
        </>
      ) : (
        <FieldSet title="Select a strategy" className={entryCss.fieldSetCtnr}>
          {StratButtonSetNode}
          {props.showAllStrats && (
            <StrategySelectorView
              plain
              symb={preStrategyStockCode}
              splitCustom={false}
            />
          )}
        </FieldSet>
      )}
    </Box>
  );
};

export default NewCalculationPanel;
