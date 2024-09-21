import React, {
  useState,
  useCallback,
  createContext,
  useContext,
  useMemo,
} from "react";
import optionableStocks from "../../../../model/optionableStocks";
import selectSymbolPrices from "../../../../pwa/store/selectors/prices/selectSymbolPrices";
import useSelectorSafe from "../../../../pwa/store/selectors/useSelectorSafe";
import useGetPrice from "../../../../services/priceData/useGetPrice";
import makeGetExpiryItemValue from "../StrategyCalculator/utils/getExpiryItemValue";
import useExpiryChoices from "../StrategyCalculator/OptionLeg/utils/useExpiryChoices";

import useAsyncState from "../../../../utils/Hooks/useAsyncState";
import { type FinderReqParams } from "opc-types/lib/api/requests/FinderReqParams";
import { getBestStockPriceFromStockData } from "../../../../utils/Finance/getBestStockPrice";
import { type FinderResp } from "opc-types/lib/api/responses/FinderResp";
import { type APIResponse } from "opc-types/lib/api/responses/APIResponse";
import { ASYNC_STATUS } from "../../../../../opc-types/lib/store/ASYNC_STATUS";
import {
  dateObjectToCode,
  validateDate,
} from "../../../../utils/String/DateFormat/DateFormat";

export enum DateTypeSelection {
  SPECIFIC_DATE = "SPECIFIC_DATE",
  EXPIRY = "EXPIRY",
}

export enum ExpectedPriceComparitor {
  AT_CLOSE = "AT_CLOSE",
  OR_ABOVE = "OR_ABOVE",
  OR_BELOW = "OR_BELOW",
}

const getExpiryItemValue = makeGetExpiryItemValue();

const defaults: ReturnType<typeof useOptionFinderLogic> = {
  symbol: "",
  symbolForDisplay: "",
  setSymbolForDisplay: () => {},
  setSymbolAndShowCompanyName: () => {},
  symbolComplete: false,
  prices: null,
  priceStatus: ASYNC_STATUS.INITIAL,
  priceErrors: null,
  onPriceRefresh: () => {},
  expectedPrice: "",
  setExpectedPrice: () => {},
  getExpiryItemValue,
  expiryChoices: [],
  expectedPriceComplete: false,
  expectedPriceComparitor: ExpectedPriceComparitor.AT_CLOSE,
  setExpectedPriceComparitor: () => {},
  dateTypeSelection: DateTypeSelection.SPECIFIC_DATE,
  setDateTypeSpecific: () => {},
  setDatePickerDate: () => {},
  setDateTypeExpiry: () => {},
  datePickerDate: new Date(),
  specificDate: "",
  expiryDate: "",
  setExpiryDate: () => {},
  expiryDateInput: "",
  setExpiryDateInput: () => {},
  strategies: [],
  toggleStrategy: () => {},
  submit: () => {},
  setBudget: () => {},
  isLoadingResults: false,
  noResultsFound: false,
  resultsData: {
    outcomes: [],
    runLength: 0,
  },
  resultsErrors: null,
  validationErrors: {},
};

function useOptionFinderLogic() {
  const [symbol, setSymbol] = useState("");
  const [symbolForDisplay, setSymbolForDisplay] = useState("");
  const symbolComplete = !!symbol.length;

  const prices = useSelectorSafe(selectSymbolPrices(symbol));
  const { status: priceStatus, errors: priceErrors } = useSelectorSafe(
    (store) => store.prices,
    null
  );
  const getPrice = useGetPrice();
  const onPriceRefresh = React.useCallback(() => {
    symbol && getPrice(symbol);
  }, [getPrice, symbol]);

  const setSymbolAndShowCompanyName = useCallback(
    (selectedSymbol: string) => {
      setSymbol(selectedSymbol);
      getPrice(selectedSymbol);

      const symbLower = selectedSymbol.toLowerCase();
      const [, matchingDesc] = optionableStocks.find(
        (stockData) => stockData[0].toLowerCase() === symbLower
      ) || ["", ""];
      if (matchingDesc) {
        setSymbolForDisplay(
          `${selectedSymbol}${matchingDesc ? " - " : ""}${matchingDesc}`
        );
      }
    },
    [onPriceRefresh, getPrice]
  );

  const [expectedPrice, setExpectedPrice] = React.useState("");
  const expectedPriceComplete =
    expectedPrice.length && !isNaN(parseFloat(expectedPrice));

  const [expectedPriceComparitor, setExpectedPriceComparitor] = React.useState(
    ExpectedPriceComparitor.AT_CLOSE
  );

  const [dateTypeSelection, setDateTypeSelection] = React.useState(
    DateTypeSelection.SPECIFIC_DATE
  );
  const setDateTypeSpecific = useCallback(
    () => setDateTypeSelection(DateTypeSelection.SPECIFIC_DATE),
    [setDateTypeSelection]
  );
  const setDateTypeExpiry = useCallback(
    () => setDateTypeSelection(DateTypeSelection.EXPIRY),
    [setDateTypeSelection]
  );

  const [expiryDateInput, setExpiryDateInput] = React.useState("");
  const [expiryDate, setExpiryDate] = React.useState("");
  const expiryChoices = useExpiryChoices(prices?.options || null, true);

  const [datePickerDate, setDatePickerDate] = useState(new Date());
  const specificDate = useMemo(
    () => dateObjectToCode(datePickerDate),
    [datePickerDate]
  );

  const [budget, setBudget] = React.useState("");

  const [strategies, setStrategies] = useState(["option-purchase"]);
  const toggleStrategy = useCallback(
    (stratName: string) => {
      setStrategies((curStrats) =>
        curStrats.includes(stratName)
          ? curStrats.filter((curStrat) => curStrat !== stratName)
          : curStrats.concat([stratName])
      );
    },
    [setStrategies]
  );

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string[]>
  >({});

  const [
    { data: resultsData, errors: resultsErrors, status: resultsStatus },
    submit,
  ] = useAsyncState(
    useCallback(() => {
      const submissionValidationErrors: Record<string, string[]> = {};
      const targettingParams =
        expectedPriceComparitor === ExpectedPriceComparitor.OR_ABOVE
          ? { targetting: "gt", priceFrom: expectedPrice }
          : expectedPriceComparitor === ExpectedPriceComparitor.OR_BELOW
          ? { targetting: "lt", priceTo: expectedPrice }
          : { targetting: "eq", priceFrom: expectedPrice };
      if (!expectedPrice) {
        submissionValidationErrors.price = (
          submissionValidationErrors.price || []
        ).concat(["Enter the price you expect the stock to reach"]);
      }

      const date =
        dateTypeSelection === DateTypeSelection.EXPIRY
          ? validateDate(expiryDate)
          : dateTypeSelection === DateTypeSelection.SPECIFIC_DATE
          ? validateDate(specificDate)
          : false;
      if (!date) {
        submissionValidationErrors.date = (
          submissionValidationErrors.date || []
        ).concat(["Invalid expiry date"]);
      }
      const dateParams =
        date && dateTypeSelection === DateTypeSelection.EXPIRY
          ? { date, specificExpiry: "0" } // convert
          : date && dateTypeSelection === DateTypeSelection.SPECIFIC_DATE
          ? { date, specificExpiry: "1" }
          : false;
      if (!dateParams) {
        submissionValidationErrors.date = (
          submissionValidationErrors.date || []
        ).concat(["Please ensure you have selected the date correctly"]);
      }
      if (dateParams && !dateParams.date) {
        submissionValidationErrors.date = (
          submissionValidationErrors.date || []
        ).concat(["Invalid expiry date"]);
      }

      if (!symbol.length) {
        submissionValidationErrors.symbol = (
          submissionValidationErrors.symbol || []
        ).concat(["Fill in a stock or index symbol to search"]);
      }

      if (Object.keys(submissionValidationErrors).length > 0 || !dateParams) {
        setValidationErrors(submissionValidationErrors);
        return Promise.reject([]);
      }
      setValidationErrors({});

      const payload: Omit<FinderReqParams["query"], "strategies"> = {
        budgetCost: budget,
        currentPrice: getBestStockPriceFromStockData(prices.stock)?.toString(),
        ...targettingParams,
        ...dateParams,
        sell: "0",
        symbol: symbol,
        ivHist: prices.stock.ivHist.toString(),
        budgetExclExp: "0",
      };

      const payloadWithStrats = {
        ...payload,
        "strategies[option-purchase]": `${strategies.includes(
          "option-purchase"
        )}`,
        "strategies[short-option]": `${strategies.includes("short-option")}`,
        "strategies[credit-spread]": `${strategies.includes("credit-spread")}`,
        "strategies[debit-spread]": `${strategies.includes("debit-spread")}`,
      };
      const qs = new URLSearchParams(payloadWithStrats).toString();

      return fetch(`/api/finder?${qs}`)
        .then((response) => response.json() as Promise<APIResponse<FinderResp>>)
        .then((body) => body.data);
    }, [
      budget,
      expectedPriceComparitor,
      expectedPrice,
      dateTypeSelection,
      expiryDate,
      specificDate,
      symbol,
      strategies,
      symbol,
      prices,
    ]),
    null
  );

  return {
    symbol,
    symbolForDisplay,
    setSymbolForDisplay,
    setSymbolAndShowCompanyName,
    symbolComplete,
    prices,
    priceStatus,
    priceErrors,
    onPriceRefresh,
    expectedPrice,
    setExpectedPrice,
    getExpiryItemValue,
    expiryChoices,
    expectedPriceComplete,
    expectedPriceComparitor,
    setExpectedPriceComparitor,
    dateTypeSelection,
    setDateTypeSpecific,
    setDateTypeExpiry,
    setDatePickerDate,
    datePickerDate,
    specificDate,
    expiryDate,
    setExpiryDate,
    expiryDateInput,
    setExpiryDateInput,
    setBudget,
    strategies,
    toggleStrategy,
    submit,
    isLoadingResults: resultsStatus === ASYNC_STATUS.LOADING,
    noResultsFound:
      resultsStatus === ASYNC_STATUS.COMPLETE &&
      resultsData?.outcomes?.length === 0,
    resultsData,
    resultsErrors,
    validationErrors,
  };
}

const OptionFinderContext = createContext(defaults);

const OptionFinderProvider = ({ children }: any) => {
  const logic = useOptionFinderLogic();

  return (
    <OptionFinderContext.Provider value={logic}>
      {children}
    </OptionFinderContext.Provider>
  );
};

const useOptionsFinderHasResults = () => {
  const { resultsData, isLoadingResults, noResultsFound } =
    useContext(OptionFinderContext);

  return (
    isLoadingResults === false &&
    (resultsData?.outcomes?.length || noResultsFound)
  );
};

export {
  OptionFinderContext,
  OptionFinderProvider,
  useOptionsFinderHasResults,
};
