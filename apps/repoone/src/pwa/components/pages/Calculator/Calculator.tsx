import { type GetServerSideProps, type NextPage } from "next";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";

import { type Strategy } from "opc-types/lib/Strategy";
import { type StratName } from "opc-types/lib/StratName";
import { type Nullable } from "opc-types/lib/util//Nullable";
import { type Optional } from "opc-types/lib/util/Optional";
import { type DisplayValueTypes } from "opc-types/lib/DisplayValueTypes";

import usePreviousVal from "../../../../utils/Hooks/usePrevious";
import Box from "../../primitives/Box";
import Env from "../../../../config/Env";
import l from "../../../../services/logger";
import ROUTE_PATHS from "../../../../consts/ROUTE_PATHS";
import { useCalculations } from "../../../../services/UserData/CalculationsProvider";
import useLocationParams from "../../../../utils/Hooks/useLocationParams";
import { getFullUrl } from "../../../../utils/App/url";
import TransformStrategy, {
  type DefaultOptLeg,
} from "../../../../utils/Data/TransformStrategy/TransformStrategy";
import sanitizeObjectForUndefined from "../../../../utils/Functional/sanitizeObjectForUndefined";
import removeDotHtml from "../../../../utils/String/removeDotHtml/removeDotHtml";
import Interface from "../../../../config/Interface";
import calcActions from "../../../store/actions/calculator";
import useSelectorSafe from "../../../store/selectors/useSelectorSafe";
import {
  keyWordsPrefix,
  STRAT_META_ITEMS_MAPPING,
} from "../../../../model/strategyMeta";
import MainLayout from "../../layouts/MainLayout";
import { AUTH_STATUS } from "../../modules/Session/Session.types";
import { useSession } from "../../modules/Session/SessionProvider";
import { useSession as useSessionStatus } from "next-auth/react";
import StrategyCalculator from "../../modules/StrategyCalculator";
import { MobTabs } from "../../modules/StrategyCalculator/StrategyCalculator.props";
import Strategies from "../../../../model/Strategies";

import { type CalculatorPublicProps } from "./Calculator.props";
import useToggleState from "../../../../utils/Hooks/useToggleState";
import decodeOptionShortForm from "../../../../utils/Finance/optionShortForm/decodeOptionShortForm";
import reportClientError from "../../../../services/Sentry/reportClientError";
import selectUnderlyingLeg from "../../../store/selectors/currentCalculation/selectUnderlyingLeg";
import { api } from "~/utils/api";
// import Header from "~/components/layout/header/header";
import axios from "axios";
import { StratLeg } from "opc-types/lib/StratLeg";

const Calculator: NextPage<CalculatorPublicProps> = (
  props: CalculatorPublicProps
) => {
  const { status } = useSessionStatus();
  const router = useRouter();

  React.useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/");
    }
  }, [status, router]);

  const locStrat: Optional<string> = removeDotHtml(
    useLocationParams()?.strat as Optional<StratName>
  );

  const routerSource = useLocationParams()?.source as Optional<string>;
  const locCalcId = router.query.sid as Optional<string>;

  const locSymb: Optional<string> =
    (useLocationParams()?.code as string) || undefined;

  const loadedStore = useSelectorSafe(
    (store) => store._persist.rehydrated,
    false
  );

  const storeCurCalc = useSelectorSafe<Nullable<Strategy>>(
    (store) => store.currentCalculation,
    null
  );

  useEffect(() => {
    if (storeCurCalc == null) {
      dispatch(calcActions.resetCurrentCalcsStrategies());
    }
  }, [storeCurCalc]);

  const storeCurCalcs = useSelectorSafe<Nullable<Strategy>>(
    // @ts-ignore
    (store) => store.currentCalculations,
    null
  );

  const storeCurCalcsStrategies = useSelectorSafe<Nullable<Strategy>>(
    // @ts-ignore
    (store) => store.currentCalculationsStrategies,
    null
  );

  useEffect(() => {
    dispatch(
      calcActions.setCurrentCalcs(
        // @ts-ignore
        storeCurCalcs.map((calc) => {
          if (
            calc.legsById.underlying.val ==
            // @ts-ignore
            storeCurCalc?.legsById.underlying.val
          ) {
            return storeCurCalc;
          }
          return calc;
        })
      )
    );

    dispatch(
      calcActions.setCurrentCalcsStrategies(
        // @ts-ignore
        storeCurCalcsStrategies.map((calc) => {
          if (calc.metadata.stratKey == storeCurCalc?.metadata.stratKey) {
            return { ...storeCurCalc, type: calc.type };
          }
          return calc;
        })
      )
    );
  }, [storeCurCalc]);

  const { authStatus, userData } = useSession();
  const { calculations, loadingCalculations, resolvingPublicCalc } =
    useCalculations();

  const dispatch = useDispatch();
  const prevPathname = usePreviousVal(router.pathname);

  const resolvingState = !loadedStore;

  const shouldClearCurCalc = !locStrat;

  React.useEffect(() => {
    if (shouldClearCurCalc) {
      dispatch(calcActions.resetCurrentCalc());
    }
  }, [shouldClearCurCalc]);

  const isSavedCalcsView =
    router.query.source && router.query.source === "saved";

  // Create a new strategy because a new URL has been loaded
  const shouldInitNewStrat =
    router.pathname !== prevPathname &&
    !locCalcId &&
    locStrat &&
    !isSavedCalcsView &&
    routerSource !== "finder";

  React.useEffect(
    function initNewStratInRedux() {
      if (shouldInitNewStrat) {
        dispatch(
          calcActions.init({
            strat: locStrat as StratName,
            defaultOptLegs: props.defaultOptLegs,
            symb: selectUnderlyingLeg(
              props.initCurrentCalc
            )?.val?.toUpperCase(),
            defaultDisplayValueType: userData.userSettings
              ?.defaultDisplayValueType as DisplayValueTypes,
          })
        );
      }
    },
    [shouldInitNewStrat]
  );

  // todo: If stratKey changes, update the URL softly
  /*  Test Action for Redux
    {
      type: 'CALCULATOR/UPDATE_PARAM',
      payload: {
        paramChain: [
          'metadata',
          'stratKey'
        ],
        paramValue: 'short-call',
        meta: {}
      }
    }
   */

  const foundCalc = calculations?.find(({ id }) => id === locCalcId);

  const prevStoreCalcId = usePreviousVal(storeCurCalc?.id);
  const shouldLoadSavedCalcById =
    loadedStore &&
    locCalcId &&
    (authStatus === AUTH_STATUS.STATE_AUTHED ||
      (Interface.ENABLE_LOCAL_SAVED_CALCS &&
        !Interface.ENABLE_ANONYMOUS_AUTH)) &&
    foundCalc?.id;

  React.useEffect(
    function loadSavedCalcToReduxById() {
      if (shouldLoadSavedCalcById) {
        if (storeCurCalc?.id !== locCalcId && prevStoreCalcId !== locCalcId) {
          const foundCalculation = calculations?.find(
            ({ id }) => id === locCalcId
          );
          if (foundCalculation) {
            dispatch(calcActions.setCurrentCalc(foundCalculation));
          }
        } else if (storeCurCalc?.id !== locCalcId) {
          router.replace(
            {
              pathname: ROUTE_PATHS.CALCULATOR,
              query: { strat: router.query.strat },
            },
            `${ROUTE_PATHS.CALCULATOR.replace(
              "[strat]",
              // @ts-ignore
              router?.query?.strat
            )}`,
            { shallow: true }
          );
        }
      }
    },
    [shouldLoadSavedCalcById, storeCurCalc?.id]
  );

  const calculationId = useLocationParams()?.share as string;
  const { data: dataCalculation } = api.calculations.getCalculation.useQuery({
    id: calculationId ?? "",
  });

  const shouldUnloadPathCalcId =
    loadedStore &&
    locCalcId &&
    (authStatus === AUTH_STATUS.STATE_AUTHED ||
      authStatus === AUTH_STATUS.STATE_ANON ||
      (Interface.ENABLE_LOCAL_SAVED_CALCS &&
        !Interface.ENABLE_ANONYMOUS_AUTH)) &&
    !loadingCalculations &&
    !resolvingPublicCalc &&
    !storeCurCalc?.id &&
    !foundCalc?.id;

  React.useEffect(
    function bailOnPathCalcIdNotFound() {
      if (shouldUnloadPathCalcId) {
        if (Env.DEBUG_REDIRECTS) {
          l.debug(
            "Redirecting to non-id path",
            ROUTE_PATHS.CALCULATOR,
            router.query.strat
          );
        }
        dispatch(
          calcActions.init({
            strat: locStrat as StratName,
            defaultDisplayValueType: userData.userSettings
              ?.defaultDisplayValueType as DisplayValueTypes,
          })
        );
        // dispatch(
        //   calcActions.setCurrentCalcs([
        //     {
        //       strat: locStrat as StratName,
        //       defaultDisplayValueType: userData.userSettings
        //         ?.defaultDisplayValueType as DisplayValueTypes,
        //     },
        //     {
        //       strat: locStrat as StratName,
        //       defaultDisplayValueType: userData.userSettings
        //         ?.defaultDisplayValueType as DisplayValueTypes,
        //     },
        //     {
        //       strat: locStrat as StratName,
        //       defaultDisplayValueType: userData.userSettings
        //         ?.defaultDisplayValueType as DisplayValueTypes,
        //     },
        //     {
        //       strat: locStrat as StratName,
        //       defaultDisplayValueType: userData.userSettings
        //         ?.defaultDisplayValueType as DisplayValueTypes,
        //     },
        //     {
        //       strat: locStrat as StratName,
        //       defaultDisplayValueType: userData.userSettings
        //         ?.defaultDisplayValueType as DisplayValueTypes,
        //     }
        //   ])
        // )
        router.replace(
          {
            pathname: ROUTE_PATHS.CALCULATOR,
            query: { strat: router.query.strat },
          },
          ROUTE_PATHS.CALCULATOR.replace(
            "[strat]",
            // @ts-ignore
            router?.query?.strat
          ),
          { shallow: true }
        );
      }
    },
    [shouldUnloadPathCalcId, router]
  );

  const currentCalc = resolvingState
    ? props.initCurrentCalc
    : storeCurCalc || null;

  const [mobSelectedTab, setMobSelectedTab] = React.useState<MobTabs>(
    MobTabs.SETUP
  );

  const isCurrentlyLoading =
    loadingCalculations ||
    !loadedStore ||
    authStatus === AUTH_STATUS.STATE_LOADING;
  const { value: hasLoaded, enable: loaded } = useToggleState(
    !isCurrentlyLoading
  );
  React.useEffect(() => {
    if (!isCurrentlyLoading) {
      loaded();
    }
  }, [isCurrentlyLoading]);

  const viewProps = {
    currentCalc,
    symb: locSymb,
    showStrategySelector: locStrat === undefined || locStrat === "",
    mobSelectedTab,
    setMobSelectedTab,
    isLoading: !hasLoaded,
  };

  const [curCalc, setCurCalc] = React.useState<Strategy | null>(null);

  React.useEffect(() => {
    if (dataCalculation && "calculations" in dataCalculation) {
      const currentShareCalcData = JSON.parse(
        dataCalculation.calculations as string
      ) as Strategy;
      viewProps.currentCalc = currentShareCalcData;
      setCurCalc(currentShareCalcData);
      dispatch(calcActions.setCurrentCalc(currentShareCalcData));
    }
  }, [curCalc]);

  if (dataCalculation && "calculations" in dataCalculation && calculationId) {
    const currentShareCalcData = JSON.parse(
      dataCalculation.calculations as string
    ) as Strategy;
    viewProps.currentCalc = currentShareCalcData;
  }

  // @ts-ignore
  const stratMeta = STRAT_META_ITEMS_MAPPING[locStrat] || {};

  return (
    <MainLayout
      title={
        viewProps.showStrategySelector
          ? "Create options calculation"
          : stratMeta?.title || ""
      }
      initialPageTitle={
        viewProps.showStrategySelector
          ? "Create calculation"
          : currentCalc?.title
      }
      metaKeywords={stratMeta ? `${stratMeta?.title},${keyWordsPrefix}` : ""}
      metaDescription={stratMeta?.description || ""}
      canonicalLink={getFullUrl(`calculator/${locStrat}`)}
    >
      <Box className={["calcCss.content", "w-full"]}>
        <StrategyCalculator {...viewProps} />
      </Box>
    </MainLayout>
  );
};

// todo: getStaticProps not going to work with a dynamic path; consider hard-coding StratName paths for optimization
// export const getStaticProps: GetStaticProps = async (context) => {
export const getServerSideProps: GetServerSideProps = async (context) => {
  const stratRaw = context.params?.strat as Optional<string>;
  const strat = removeDotHtml(stratRaw);
  let defaultSymbol = (context.params?.code ||
    context.query?.stock) as Optional<string>;
  let defaultOptLegs: DefaultOptLeg[] = [];
  try {
    const decoded = context.query?.trade
      ? decodeOptionShortForm(context.query?.trade as string)
      : { legs: [], stock: undefined };
    if (decoded.stock) defaultSymbol = decoded.stock;
    defaultOptLegs = decoded.legs as DefaultOptLeg[];
  } catch (e: any) {
    reportClientError({
      id: "legsShortForm-parse-error",
      detail: e.message,
      data: { trade: context.query?.trade },
    });
  }
  const initCurrentCalc = strat
    ? TransformStrategy.stratToInitialState(
        Strategies.getStrategy(strat as StratName),
        {
          defaultSymbol,
          defaultOptLegs,
        }
      )
    : null;

  let calculator = null;
  let usecaseResult = null;
  let additionalDataChain = {};

  if (
    context.query.symbol &&
    context.query.strat &&
    context.query.leg1strike &&
    context.query.expiration
  ) {
    const symbol = context.query.symbol;
    const strategy = context.query.strat;
    const leg1strike = context.query.leg1strike;
    const expiration = context.query.expiration;
    const leg1price = context.query.leg1price;
    const act = context.query.act;
    const num = context.query.num;
    const opType = context.query.opType;

    const usecaseResultRaw = await axios.get(
      `${getBaseUrl(context.req)}/api/price/${symbol}`
    );
    const usecaseResultD = usecaseResultRaw.data;
    usecaseResult = usecaseResultD.data;

    let items = undefined;

    const expirationDate = parseDate(expiration as string);

    usecaseResult.meta = {
      autoRefresh: true,
      refreshPriceRangeOnly: false,
      fillPriceIfBlank: false,
    };

    if ("result" in usecaseResult) {
      if (usecaseResult.result == "SUCCESS") {
        //@ts-ignore
        const options = usecaseResult.options;

        items = options[expirationDate];
      }
    }

    if (items) {
      const priceItem = items["c"][leg1strike as string];
      let stock = null;

      if ("stock" in usecaseResult) {
        stock = usecaseResult.stock;
      }

      calculator = TransformStrategy.stratToInitialState(
        Strategies.getStrategy(strategy as StratName),
        {
          defaultSymbol: symbol as Optional<string>,
          defaultOptLegs: [
            {
              opType: opType ? (opType as "call" | "put") : "call",
              price: priceItem["a"],
              strike: Number(leg1strike),
              num: 1,
              act: "buy",
              expiry: expirationDate,
              iv: priceItem["iv"],
            },
          ],
        }
      );

      additionalDataChain["price"] = priceItem["a"];
      additionalDataChain["strike"] = Number(leg1strike);
      additionalDataChain["expiry"] = expirationDate;
      additionalDataChain["type"] = "call";
      additionalDataChain["iv"] = priceItem["iv"];
      additionalDataChain["legId"] = "option";

      calculator.legsById.underlying = {
        type: "stock",
        act: null,
        name: "Underlying stock",
        num: null,
        linkNum: false,
        val: symbol,
        curPriceUpdated: new Date().getTime(),
        curPriceBid: stock.bid,
        curPriceAsk: stock.ask,
        curPriceLast: stock.last,
        price: null,
      } as StratLeg & any;

      calculator.histIV = stock.ivHist;

      let curPrice = null;

      if (leg1price) {
        curPrice = Number(leg1price);
      }

      calculator.legsById.option = {
        type: "option",
        iv: priceItem["iv"],
        price: curPrice ?? priceItem["a"],
        priceRange: [priceItem["b"], priceItem["a"]],
        strike: Number(leg1strike as string),
        disabled: false,
        name: "Call option",
        act: act ?? "buy",
        opType: "call",
        expiry: expirationDate,
        num: num ?? 1,
        underlying: "underlying",
        showDetails: false,
        showGreeks: false,
        showExitPrice: false,
        customPrice: false,
        linkNum: false,
      } as StratLeg & any;
    }
  }

  return {
    props: {
      initCurrentCalc: sanitizeObjectForUndefined(
        calculator ?? initCurrentCalc
      ),
      defaultOptLegs: sanitizeObjectForUndefined(defaultOptLegs),
      prices: usecaseResult,
      additionalDataChain: additionalDataChain,
    },
  };
};

export default Calculator;

function getBaseUrl(req): string {
  const host = req.headers.host;
  const protocol = req.headers["x-forwarded-proto"] || "http";
  const baseUrl = `${protocol}://${host}`;
  return baseUrl;
}

function parseDate(dateString: string): string {
  let parts = dateString.split("-");
  let day = parts[0];
  let month = parts[1];
  let year = parts[2];
  let formattedDate = new Date(`${year}-${month}-${day}`);
  let result = formattedDate.toISOString().slice(0, 10).replace(/-/g, "");
  return result;
}
