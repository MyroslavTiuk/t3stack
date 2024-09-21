import { useCallback, useContext } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { type Strategy } from "opc-types/lib/Strategy";
import { type StratLegOpt } from "opc-types/lib/StratLegOpt";
import { type FinderOutcome } from "opc-types/lib/api/responses/FinderResp";
import ucFirst from "../../../../utils/String/ucFirst/ucFirst";
import formatPrice from "../../../../utils/String/formatPrice/formatPrice";
import formatPercent from "../../../../utils/String/formatPercent/formatPercent";
import { codeToExp } from "../../../../utils/String/DateFormat/DateFormat";
import ROUTE_PATHS from "../../../../consts/ROUTE_PATHS";
import calcActions from "../../../store/actions/calculator";
import Box from "../../primitives/Box";
import T from "../../primitives/Typo";
import HelpIcon from "../../primitives/HelpIcon";
import Button from "../../primitives/Button";
import { OptionFinderContext } from "../OptionFinder/OptionFinderContext";
import css from "./OptionFinderResults.module.scss";

type FinderResultProps = {
  outcome: FinderOutcome;
};

const cleanTitle = (title: string) =>
  title.replace(/( \(bullish\)| \(bearish\))/g, "");

const FinderResult = ({ outcome }: FinderResultProps) => {
  const strat: Strategy = outcome.vars?.strat;
  if (!strat) return;

  const router = useRouter();
  const dispatch = useDispatch();

  const onOpen = useCallback(() => {
    dispatch(calcActions.setCurrentCalc(strat));
    router.push(
      `${ROUTE_PATHS.CALCULATOR}?source=finder`,
      `${ROUTE_PATHS.CALCULATOR.replace(
        "[strat]",
        strat?.metadata?.stratKey
      )}?source=finder`
    );
  }, [outcome, dispatch]);

  let title = "";
  if (
    ["long-put", "long-call", "short-put", "short-call"].indexOf(
      strat.metadata.stratKey
    ) >= 0
  ) {
    const op = strat.legsById.option as StratLegOpt;

    title = `${cleanTitle(strat.title)}: ${ucFirst(op.act)} ${
      op.num
      // @ts-ignore
    }x ${codeToExp(op.expiry)} ${formatPrice(op.strike)} ${ucFirst(
      op.opType
    )} @ ${formatPrice(op.price)}`;
  } else if (
    [
      "bearish-call-credit-spread",
      "bullish-put-credit-spread",
      "bearish-put-debit-spread",
      "bullish-call-debit-spread",
    ].indexOf(strat.metadata.stratKey) >= 0
  ) {
    const long = strat.legsById.long as StratLegOpt;
    const short = strat.legsById.short as StratLegOpt;
    title = `${cleanTitle(strat.title)}: ${long.num}x ${codeToExp(
      // @ts-ignore
      long.expiry
      // @ts-ignore
    )} ${formatPrice(long.strike)}/${short.strike} ${ucFirst(
      long.opType
    )} @ ${formatPrice(long.price - short.price)}`;
  }

  const { maxRisk, init, roiMaxRisk, net, pop } = outcome;

  return (
    <Box className={css.option}>
      <T h6 className={css._title}>
        {title}
      </T>
      <Box className={[css.optionResultTable, css._table]}>
        <Box className={[css._col, css["_col-price"]]}>
          <Box className={css._label}>Cost</Box>
          <Box className={css._value}>{init && formatPrice(init)}</Box>
        </Box>
        <Box className={[css._col, css["_col-maxRisk"]]}>
          <Box className={css._label}>Max Risk</Box>
          <Box className={css._value}>
            {typeof maxRisk === "string"
              ? maxRisk
              : maxRisk
              ? formatPrice(maxRisk)
              : ""}
          </Box>
        </Box>
        <Box className={[css._col, css["_col-return"]]}>
          <Box className={css._label}>Est. Return</Box>
          <Box className={css._value}>
            {net && formatPrice(net)}
            {roiMaxRisk && ` (${formatPercent(roiMaxRisk)})`}
          </Box>
        </Box>
        <Box className={[css._col, css["_col-pop"]]}>
          <Box className={css._label}>
            POP <HelpIcon tip="Probability of Profit" />
          </Box>
          <Box className={css._value}>{pop && formatPercent(pop)}</Box>
        </Box>
      </Box>
      <Box className={css._button} flex flexSec="center">
        <Button onClick={onOpen} outline small full-width-mobile text="Open" />
      </Box>
    </Box>
  );
};

const OptionFinderResults = () => {
  const props = useContext(OptionFinderContext);

  if (props.noResultsFound) {
    return (
      <>
        <T>No results found for your search</T>
      </>
    );
  }

  return (
    <>
      <T h5>Top options</T>
      <T content-caption>
        Sorted by % ROI of max risk (or % ROI initial collateral, for naked
        options)
      </T>
      <Box mt={1}>
        {props.resultsData?.outcomes.map((outcome, i) => (
          <Box key={i}>
            <FinderResult outcome={outcome} />
          </Box>
        ))}
      </Box>
    </>
  );
};

export default OptionFinderResults;
