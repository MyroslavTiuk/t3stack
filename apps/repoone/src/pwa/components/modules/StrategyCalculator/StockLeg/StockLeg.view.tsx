import React, { type FC } from "react";
import { isNil } from "ramda";
import { format } from "date-fns";
import { isUndefined } from "errable";

import { type StockData } from "opc-types/lib/StockData";
import { type Optional } from "opc-types/lib/util/Optional";
import { type Nullable } from "opc-types/lib/util/Nullable";
import { ASYNC_STATUS } from "../../../../../types/enums/ASYNC_STATUS";

import Exchanges from "../../../../../config/Exchanges";
// import formatPrice from "../../../../../utils/String/formatPrice/formatPrice";
import orUndef from "../../../../../utils/Data/orUndef/orUndef";
import clx from "../../../../../utils/Html/clx";
// import useMediaQuery from "../../../../../utils/Hooks/useMediaQuery";
import Theme from "../../../../theme/Theme";
import { getBestStockPriceFromStockData } from "../../../../../utils/Finance/getBestStockPrice";
import Box from "../../../primitives/Box";
import T from "../../../primitives/Typo";
import Input from "../../../primitives/Input";
import LoadingText from "../../../primitives/Loading";
import StockPriceDetails from "../../StockPriceDetails";

import StockLookupAutocomplete from "../../StockLookupAutocomplete";

// import { type PriceChoice } from "../types/PriceChoice";
import entryCss from "../Entry/Entry.module.scss";
import { type StockLegProps } from "./StockLeg.props";
import useCustomHotkeysCalculator, {
  CalculatorKeys,
} from "../utils/useCustomHotKeys";
import { useDispatch } from "react-redux";
import Button from "~/components/log/button";
import calcActions from "~/pwa/store/actions/calculator";
import { StratName } from "../../../../../../opc-types/lib/StratName";
import useGetPrice from "~/services/priceData/useGetPrice";
import { PRICE_RESULT } from "../../../../../../opc-types/lib/api/responses/util/PRICE_RESULT";
import { CurrentCalculationState } from "../../../../../../opc-types/lib/store/CurrentCalculationState";
import Strategy from "src/pages/journal/strategy";
import useSelectorSafe from "~/pwa/store/selectors/useSelectorSafe";

type DetailsProps = {
  prices: Omit<StockData, "ivHist">;
  lastRetrieved: Optional<number>;
  chainAvailable: boolean;
  outOfDate: boolean;
  refreshPrices: () => void;
  priceOnChange: (n: string) => void;
};

const LastRetrieved = (props: Omit<DetailsProps, "prices">) => (
  <T
    content-detail-minor
    className={[
      entryCss["info-row"],
      entryCss["info-date"],
      orUndef(props.outOfDate && entryCss["--is-out-of-date"]),
      "!w-fit py-1",
    ]}
  >
    {!props.lastRetrieved ? (
      <>&nbsp;</>
    ) : props.lastRetrieved === -1 ? (
      "Prices may be out of date - "
    ) : !props.outOfDate ? (
      `Prices delayed 15min`
    ) : (
      `Prices retrieved: ${format(props.lastRetrieved, "d MMM h:mma")}`
    )}
    {props.lastRetrieved && (props.outOfDate || !props.chainAvailable) && (
      <>
        {" "}
        <T
          tagName="span"
          content-detail-minor
          clickable
          onClick={props.refreshPrices}
        >
          Refresh
        </T>
      </>
    )}
  </T>
);

function useCheckOutOfDate(
  lastRetrieved: Optional<number>,
  setPricesOutOfDate: (b: boolean) => void
) {
  const spoodRef = React.useRef(
    undefined as Optional<ReturnType<typeof setTimeout>>
  );

  React.useEffect(() => {
    const MS_TIL_OOD = (Exchanges.TTL_PRICE_DATA * 60 + 1) * 1000;
    function checkOutOfDate() {
      if (!lastRetrieved) return null;
      const timeTilOutOfDate =
        MS_TIL_OOD - Math.max(0, Date.now() - lastRetrieved);
      return timeTilOutOfDate < 0 === true ? (true as const) : timeTilOutOfDate;
    }
    const outOfDateResult = checkOutOfDate();
    if (outOfDateResult === null) {
      setPricesOutOfDate(false);
      return;
    } else if (outOfDateResult === true) {
      setPricesOutOfDate(true);
      return;
    }
    setPricesOutOfDate(false);
    !isUndefined(spoodRef.current) && clearTimeout(spoodRef.current);
    spoodRef.current = setTimeout(() => {
      setPricesOutOfDate(true);
    }, outOfDateResult);
    return () => {
      if (!isUndefined(spoodRef.current)) clearTimeout(spoodRef.current);
    };
  }, [lastRetrieved, setPricesOutOfDate]);
}

const StockLegView: FC<StockLegProps> = (
  props: StockLegProps
): ReturnType<typeof Box> => {
  // const isMob = useMediaQuery("mobile-only");
  const [pricesOutOfDate, setPricesOutOfDate] = React.useState(false);
  const stockInputRef = React.useRef(null as Nullable<HTMLInputElement>);

  // const { inputMethod, inputMethodMobile } = props;
  // const resolvedInputMethod = isMob ? inputMethodMobile : inputMethod;
  const isInline = false;

  useCheckOutOfDate(props.lastRetrieved, setPricesOutOfDate);

  const quantityRef = React.useRef<Nullable<HTMLInputElement>>(null);

  // const getPriceItemValue = useCallback(
  //   (priceChoice: PriceChoice) =>
  //     `${formatPrice(priceChoice.price, { hideDollar: true })} (${
  //       priceChoice.position
  //     })`,
  //   []
  // );

  useCustomHotkeysCalculator(CalculatorKeys.enterNewStock, () => {
    if (stockInputRef.current) {
      stockInputRef.current.focus();
      stockInputRef.current.scrollIntoView({ block: "start" });
    }
  });

  const symbolSearchInput = (
    <StockLookupAutocomplete
      val={props.leg.val || ""}
      onChange={props.valOnChange}
      onSelect={props.valOnSelect}
      className={entryCss["_input"]}
      error={props.priceError}
      autoScrollOffset={Theme.$headerHeight + 16}
      inputRef={stockInputRef}
    />
  );

  const detailsGroup = isNil(props.prices) ? null : (
    <StockPriceDetails
      chainAvailable={props.chainAvailable}
      prices={props.prices}
      lastRetrieved={props.lastRetrieved}
      outOfDate={pricesOutOfDate}
      refreshPrices={props.onPriceRefresh}
      priceOnChange={props.priceOnChange}
    />
  );

  const retrievedEle = (
    <LastRetrieved
      chainAvailable={props.chainAvailable}
      lastRetrieved={props.lastRetrieved}
      outOfDate={pricesOutOfDate}
      refreshPrices={props.onPriceRefresh}
      priceOnChange={props.priceOnChange}
    />
  );

  const priceStatusNode =
    props.priceStatus === ASYNC_STATUS.LOADING ? (
      <Box flex-center ml={1 / 2}>
        <LoadingText />
      </Box>
    ) : (
      detailsGroup
    );

  // const [showTip, setShowTip] = React.useState(!props.leg.val.length);

  const numLinked = props.leg.linkNum;
  const numHasLinkedFocus =
    props.leg.linkNum && props.focusLinkedField === "num";
  const numSetLinkedFocus = React.useCallback(
    () => props.setFocusLinkedField("num"),
    [props.setFocusLinkedField]
  );
  const clearLinkedFocus = React.useCallback(
    () => props.setFocusLinkedField(null),
    [props.setFocusLinkedField]
  );

  const bestPrice =
    props.leg.price ||
    (!props.prices ? null : getBestStockPriceFromStockData(props.prices));

  const initialStrategies = [
    { title: "Long Call", stratKey: "long-call", enabled: false },
    { title: "Long Put", stratKey: "long-put", enabled: false },
    { title: "Cash Secured Put", stratKey: "cash-secured-put", enabled: false },
    { title: "Short/naked Call", stratKey: "short-call", enabled: false },
    { title: "Iron Condor", stratKey: "iron-condor", enabled: false },
  ];

  const [strategies, setStrategies] = React.useState(initialStrategies);

  const dispatch = useDispatch();
  const storeCurCalc = useSelectorSafe<Nullable<typeof Strategy>>(
    // @ts-ignore
    (store) => store.currentCalculation,
    null
  );

  // const storeCurCalcs = useSelectorSafe<Nullable<CurrentCalculationState[]>>(
  //   (store) => store.currentCalculations,
  //   null
  // );

  const storeCurCalcsStrategies = useSelectorSafe<
    Nullable<CurrentCalculationState[]>
  >((store) => store.currentCalculationsStrategies, null);

  const getPrices = useGetPrice();

  async function getPriceAndExpiration(
    symbol: string,
    strategy: string,
    ironCondorLeg: Nullable<string> = null
  ): Promise<{
    strike: number;
    expiration: Date;
    action: "buy" | "sell";
    opType: "call" | "put";
    iv: number;
    priceRange: [number, number];
  }> {
    const prices = await getPrices(symbol);
    if (prices.result !== PRICE_RESULT.SUCCESS) {
      throw new Error("Can not fetch dates for quick-view");
    }

    const stock = prices.stock.last;
    if (!stock) {
      throw new Error("Stock price is null");
    }
    const options = prices.options;
    const expirations = Object.keys(options).map((exp) => {
      let expirationDigits = exp.split("");
      expirationDigits.splice(4, 0, "/");
      expirationDigits.splice(7, 0, "/");
      return {
        date: new Date(expirationDigits.join("")),
        puts: options[exp].p,
        calls: options[exp].c,
      };
    });
    let maxExpirationDate = new Date();
    let maxPercent = 0;
    let isPut = false;
    let action: "buy" | "sell" = "buy";
    let opType: "call" | "put" = "call";
    switch (strategy) {
      case "long-call":
        maxExpirationDate.setDate(maxExpirationDate.getDate() + 45);
        maxPercent = 2.5;
        break;
      case "long-put":
        isPut = true;
        maxExpirationDate.setDate(maxExpirationDate.getDate() + 45);
        maxPercent = 2.5;
        opType = "put";
        break;
      case "cash-secured-put":
        isPut = true;
        maxPercent = 5;
        action = "sell";
        opType = "put";
        maxExpirationDate.setDate(maxExpirationDate.getDate() + 15);
        break;
      case "short-call":
        maxPercent = 10;
        action = "sell";
        maxExpirationDate.setDate(maxExpirationDate.getDate() + 30);
        break;
      case "iron-condor":
        // TODO:
        // Long call: 5% OTM, Buy/Sell: Buy
        // Short call: 2.5% OTM, Buy/Sell: Sell
        // Long Put: 5% OTM, Buy/Sell: Buy
        // Short Put: 2.5 OTM, Buy/Sell: Sell
        maxExpirationDate.setDate(maxExpirationDate.getDate() + 15);
        if (!ironCondorLeg) {
          maxPercent = 5;
        } else {
          switch (ironCondorLeg) {
            case "long-call":
              maxPercent = 5;
              break;
            case "long-put":
              maxPercent = 5;
              isPut = true;
              opType = "put";
              break;
            case "short-call":
              maxPercent = 2.5;
              action = "sell";
              break;
            case "short-put":
              maxPercent = 2.5;
              action = "sell";
              isPut = true;
              opType = "put";
              break;
            default:
              break;
          }
        }
        break;
      default:
        throw new Error("Unknown strategy for quick-view");
    }

    const expirationDate = expirations
      .filter((exp) => exp.date < maxExpirationDate)
      .slice(-1)[0];
    const strike = Object.keys(
      isPut ? expirationDate.puts : expirationDate.calls
    )
      .map((s) => Number(s))
      .filter(
        (s) =>
          s <
          stock +
            (isPut ? -((stock * maxPercent) / 100) : (stock * maxPercent) / 100)
      )
      .slice(-1)[0];
    expirationDate.date.setDate(expirationDate.date.getDate() + 1);
    const a = isPut
      ? expirationDate.puts[strike].a
      : expirationDate.calls[strike].a;
    const b = isPut
      ? expirationDate.puts[strike].b
      : expirationDate.calls[strike].b;

    return {
      strike,
      expiration: expirationDate.date,
      action,
      opType,
      iv: isPut
        ? expirationDate.puts[strike].iv
        : expirationDate.calls[strike].iv,
      priceRange: [b, a],
    };
  }

  async function getIronCondorCalc(symbol: string): Promise<
    {
      strike: number;
      expiration: Date;
      action: "buy" | "sell";
      opType: "call" | "put";
      iv: number;
      priceRange: [number, number];
    }[]
  > {
    const ironCondorLegsTitles = {
      "long-call": "Long Call",
      "long-put": "Long Put",
      "short-call": "Short Call",
      "short-put": "Short Put",
    };
    const ironCondorLegs = ["long-call", "long-put", "short-call", "short-put"];

    const quickViewDataForLeg = await Promise.all(
      ironCondorLegs.map(async (leg) => {
        return await getPriceAndExpiration(symbol, "iron-condor", leg);
      })
    );
    const ironCondor = {
      ...storeCurCalc,
      title: "Iron Condor",
      legs: ["underlying", ...ironCondorLegs],
      metadata: {
        // @ts-ignore
        ...storeCurCalc.metadata,
        stratKey: "iron-condor",
      },
      type: "Iron Condor",
      // imported: true,
      // linkExpires: true,
      // linkStrikes: true,
      atmIV: 0,
      timeOfCalculation: new Date().getTime(),
    };
    quickViewDataForLeg.forEach((data, i) => {
      // @ts-ignore
      ironCondor.legsById[ironCondorLegs[i]] = {
        // @ts-ignore
        ...storeCurCalc.legsById.option,
        strike: data.strike,
        expiry: data.expiration.toISOString().slice(0, 10).replace(/-/g, ""),
        iv: data.iv,
        price: data.priceRange[1],
        priceRange: data.priceRange,
        opType: data.opType,
        act: data.action,
        disabled: false,
        name: ironCondorLegsTitles[ironCondorLegs[i]],
      };
    });
    // @ts-ignore
    return ironCondor;
  }

  const addQuickView = React.useCallback(async () => {
    const selectedStrategies = strategies.filter((s) => s.enabled);
    if (!storeCurCalc) return;
    const quickViewCalcs = await Promise.all(
      selectedStrategies.map(async (st) => {
        if (st.stratKey == "iron-condor") {
          // @ts-ignore
          return await getIronCondorCalc(storeCurCalc.legsById.underlying.val);
        }
        const quickViewData = await getPriceAndExpiration(
          // @ts-ignore
          storeCurCalc.legsById.underlying.val,
          st.stratKey
        );
        return {
          ...storeCurCalc,
          title: st.title,
          legsById: {
            // @ts-ignore
            ...storeCurCalc.legsById,
            option: {
              // @ts-ignore
              ...storeCurCalc.legsById.option,
              strike: quickViewData.strike,
              expiry: quickViewData.expiration
                .toISOString()
                .slice(0, 10)
                .replace(/-/g, ""),
              iv: quickViewData.iv,
              price: quickViewData.priceRange[1],
              priceRange: quickViewData.priceRange,
              opType: quickViewData.opType,
              act: quickViewData.action,
            },
          },
          metadata: {
            // @ts-ignore
            ...storeCurCalc.metadata,
            stratKey: st.stratKey as StratName,
          },
          type: st.title,
          atmIV: quickViewData.iv,
          timeOfCalculation: new Date().getTime(),
        };
      })
    );

    // @ts-ignore
    dispatch(calcActions.setCurrentCalcsStrategies(quickViewCalcs));
    // @ts-ignore
    dispatch(calcActions.setCurrentCalc(quickViewCalcs[0]));
  }, [strategies, storeCurCalcsStrategies]);

  // @ts-ignore
  if (storeCurCalc?.metadata.stratKey == "quick-view") {
    return (
      <>
        <Box className={entryCss["_input"]}>{symbolSearchInput}</Box>
        <div className="mt-4 grid w-full grid-cols-2 gap-4">
          {strategies.map((s) => (
            <div key={s.title} className="mb-4 flex items-center">
              <input
                id="default-checkbox"
                type="checkbox"
                checked={s.enabled}
                onClick={() => {
                  setStrategies((prev) => {
                    return prev.map((prevStrat) => {
                      if (prevStrat == s) {
                        return {
                          title: prevStrat.title,
                          stratKey: prevStrat.stratKey,
                          enabled: !prevStrat.enabled,
                        };
                      }
                      return prevStrat;
                    });
                  });
                }}
                className="text-blue-600 dark:focus:ring-blue-900 h-4 w-4 rounded-full border-gray-300 bg-gray-100 focus:ring-2 focus:ring-gray-900 dark:border-gray-900 dark:bg-gray-700 dark:ring-offset-gray-900"
              />
              <label
                htmlFor="default-checkbox"
                className="ml-4 w-full text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                {s.title}
              </label>
            </div>
          ))}
        </div>
        <Button
          disabled={
            !storeCurCalc ||
            // @ts-ignore
            !storeCurCalc.legsById.underlying.val ||
            // @ts-ignore
            storeCurCalc.legsById.underlying.val == ""
          }
          onClick={addQuickView}
          className="w-full items-center justify-center"
        >
          View estimates
        </Button>
      </>
    );
  }

  return (
    <Box className={entryCss["fields-set"]}>
      <Box className={entryCss._header}>
        <T h5 className={[entryCss._name, "--sec-center flex"]}>
          {props.name}
        </T>
      </Box>
      <Box className={[entryCss["fields-ctnr"], entryCss[`--stacked`]]}>
        <Box
          className={[
            (props.settings.allowPurchase || !isInline) &&
              entryCss["input-group"],
            entryCss["--valign-top"],
            entryCss["input-row-line"],
          ]}
          onClick={props.hideTip}
        >
          {(props.settings.allowPurchase || !isInline) && (
            <T className={entryCss["_label"]}>
              Symbol
              <span
                className={
                  !!props.leg.val && props.prices
                    ? entryCss.reqComplete
                    : entryCss.reqIncomplete
                }
              >
                *
              </span>
            </T>
          )}
          <Box className={entryCss["_input"]}>{symbolSearchInput}</Box>

          {/*{storeCurCalc && storeCurCalc.metadata.stratKey == "quick-view" && (*/}
          {/*  <div className="grid w-full grid-cols-2 gap-4">*/}
          {/*    {strategies.map((s) => (*/}
          {/*      <div key={s} className="mb-4 flex items-center">*/}
          {/*        <input*/}
          {/*          id="default-checkbox"*/}
          {/*          type="checkbox"*/}
          {/*          value=""*/}
          {/*          className="text-blue-600 dark:focus:ring-blue-900 h-4 w-4 rounded-full border-gray-300 bg-gray-100 focus:ring-2 focus:ring-gray-900 dark:border-gray-900 dark:bg-gray-700 dark:ring-offset-gray-900"*/}
          {/*        />*/}
          {/*        <label*/}
          {/*          htmlFor="default-checkbox"*/}
          {/*          className="w-full text-sm font-medium text-gray-900 dark:text-gray-300"*/}
          {/*        >*/}
          {/*          {s}*/}
          {/*        </label>*/}
          {/*      </div>*/}
          {/*    ))}*/}
          {/*  </div>*/}
          {/*)}*/}
        </Box>
        <Box
          className={[
            entryCss["--valign-top"],
            entryCss["input-group"],
            entryCss["input-row-line"],
            entryCss["--id-price-stock"],
          ]}
        >
          <T className={entryCss["_label"]}>
            Price
            <span
              className={
                bestPrice ? entryCss.reqComplete : entryCss.reqIncomplete
              }
            >
              *
            </span>
          </T>
          <Box flexSec="center" className={entryCss["_input"]}>
            <Box flex-col className={["flex-col lg:flex-row"]}>
              <Box
                flex
                className={["flex-col lg:flex-row"]}
                style={{ marginBottom: "2px" }}
              >
                <div className="flex flex-col">
                  <Input
                    className={entryCss["_custom-text"]}
                    prefix={"$"}
                    inputClassName={clx([
                      entryCss["_entry-input"],
                      entryCss["--has-prefix"],
                    ])}
                    spellCheck={false}
                    type={"tel"}
                    value={bestPrice || ""}
                    placeholder={"Price"}
                    onChange={props.priceOnChange}
                    onBlur={props.priceOnSelect}
                  />
                  {retrievedEle}
                </div>
                <Box flexSec="center" flexPri="start">
                  {priceStatusNode}
                </Box>
              </Box>
            </Box>
          </Box>
          <div className="flex w-full justify-center"></div>
        </Box>
        {props.settings.allowPurchase && (
          <>
            <Box
              className={[
                entryCss["input-group"],
                entryCss["--valign-top"],
                entryCss["input-row-line"],
                entryCss["--id-quantity-stock"],
                numHasLinkedFocus && entryCss["--linked-field-focused"],
                numLinked && entryCss["--linked"],
              ]}
            >
              <T className={entryCss["_label"]}>
                Quantity
                <span
                  className={
                    props.leg.num
                      ? entryCss.reqComplete
                      : entryCss.reqIncomplete
                  }
                >
                  *
                </span>
              </T>
              <Box className={entryCss["_input"]}>
                <Input
                  className={[entryCss["_inputField"]]}
                  inputClassName={[entryCss["_entry-input"]]}
                  value={props.leg.num || ""}
                  placeholder={"#"}
                  onChange={props.numOnChange}
                  onBlur={props.numOnSelect}
                  inputRef={quantityRef}
                  disabled={false}
                  debounce
                  spellCheck={false}
                  autoComplete={"off"}
                  noStyle={numLinked}
                  onMouseOver={numSetLinkedFocus}
                  onMouseOut={clearLinkedFocus}
                  type={"tel"}
                />
                <Box className={entryCss.toggleAll} mt={1 / 3} ml={1 / 4}>
                  <Box
                    className={entryCss._checkLabel}
                    onClick={() => props.linkNumOnSelect(!props.leg.linkNum)}
                    flexSec="center"
                  >
                    <input
                      className="styled --linked --small"
                      type="checkbox"
                      checked={props.leg.linkNum}
                    />
                    <T content-detail-minor ml={1 / 4}>
                      Sync with # option contracts
                    </T>
                  </Box>
                </Box>
              </Box>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default StockLegView;
