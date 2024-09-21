import React, { type FC, type ReactElement, useEffect } from "react";

import { type Strategy } from "opc-types/lib/Strategy";
import { Switch } from "@headlessui/react";
import useDependentMemo from "../../../../../utils/Hooks/useDependentMemo";
import getOpLegCount from "../../../../../utils/Finance/getOpLegCount";
import useMediaQuery from "../../../../../utils/Hooks/useMediaQuery";
import HELP_TEXT from "../../../../../consts/HELP_TEXT";
import ROUTE_PATHS from "../../../../../consts/ROUTE_PATHS";
import filterOptionLegs from "../../../../store/selectors/currentCalculation/filterOptionLegs";
import legsWithIds from "../../../../store/selectors/currentCalculation/legsWithIds";
import CONTENT_PATHS from "../../../../../consts/CONTENT_PATHS";

import Box from "../../../primitives/Box";
import T from "../../../primitives/Typo";
import FieldSet from "../../../primitives/FieldSet";

import OptionLeg from "../OptionLeg";
import StockLeg from "../StockLeg";
import NetSummary from "../NetSummary";
import { type EntryProps } from "./Entry.props";
import css from "./Entry.module.scss";
import useDispaction from "../../../../../utils/Redux/useDispaction";
import calculatorActions from "../../../../store/actions/calculator";
import Icon from "../../../primitives/Icon";
import Button from "../../../primitives/Button";
import featureNotDisabled from "../../../../../utils/App/featureNotDisabled";
import { useDispatch } from "react-redux";
import useSelectorSafe from "~/pwa/store/selectors/useSelectorSafe";
import calcActions from "../../../../store/actions/calculator";

const renderMap: Record<string, typeof OptionLeg | typeof StockLeg> = {
  stock: StockLeg,
  option: OptionLeg,
};

const SHOW_FIELDSET_BORDERS = false;

const renderLeg = (
  i: number,
  countOpLegs: number,
  legId: string,
  props: EntryProps
) => {
  const leg = props.currentCalc.legsById[legId];
  const Leg = renderMap[leg.type] || ((_: any) => null);
  // @ts-ignore (ts correctly identifies the assumptions made here)
  return <Leg key={legId} legId={legId} leg={leg} ofLegs={countOpLegs} />;
};

function useGetIsAllOn(calc: Strategy) {
  const calcSettings = calc.settings;

  return (
    calc.linkNum &&
    (!calcSettings.showLinkExpiries || calc.linkExpiries) &&
    (calcSettings.showLinkOpTypes || !calc.changeOpType || calc.linkOpTypes) &&
    (!calcSettings.showLinkStrikes || calc.linkStrikes)
  );
}

const EntryView: FC<EntryProps> = (props: EntryProps): ReactElement<"div"> => {
  const isMob = useMediaQuery("mobile-only");
  const countOpLegs = useDependentMemo(getOpLegCount, [props.currentCalc]);
  const calcOps = useDependentMemo(filterOptionLegs, [props.currentCalc]);
  const opLegs = useDependentMemo(legsWithIds, [
    calcOps,
    props.currentCalc.legs,
  ]);
  const category = props.currentCalc.metadata.category.complexity;

  const dispatch = useDispatch();
  const multiStrike = useSelectorSafe((s) => s.multiStrikeToggle, false);
  const multiStrikes = useSelectorSafe((s) => s.multiStrike, null);
  useEffect(() => {
    if (multiStrike && category != "single") {
      dispatch(calcActions.setMultiStrike(false));
    }
    if (multiStrikes) {
      dispatch(calcActions.resetMultiStrikes());
    }
  }, [category, multiStrike]);

  //// add new leg
  const addNewLeg = useDispaction(calculatorActions.addLeg);
  const opLegsJsx = opLegs.map((opLeg, i) => {
    return (
      <React.Fragment key={opLeg.legId}>
        <FieldSet
          basic={!SHOW_FIELDSET_BORDERS}
          title={SHOW_FIELDSET_BORDERS ? opLeg.name : undefined}
          className={css.fieldSetCtnr}
          helpIconText={HELP_TEXT.OPTION_LEG_SINGLE}
          helpClickThroughPath={undefined && ROUTE_PATHS.HELP}
          helpIconPos={"top-right"}
        >
          {renderLeg(i + 1, countOpLegs, opLeg.legId, props)}
        </FieldSet>
        {opLegs.length !== 1 && i !== opLegs.length - 1 && (
          <Box className={css.vertSeparator} />
        )}
      </React.Fragment>
    );
  });

  const updateCalcGlobal = useDispaction(calculatorActions.updateParam);
  const calc = props.currentCalc;
  const onToggleAll = React.useCallback(
    (onOff: boolean) => {
      // @ts-ignore
      updateCalcGlobal({ paramChain: ["linkNum"], paramValue: onOff });
      calc.defaults.linkExpiries &&
        // @ts-ignore
        updateCalcGlobal({ paramChain: ["linkExpiries"], paramValue: onOff });
      calc.defaults.linkStrikes &&
        // @ts-ignore
        updateCalcGlobal({ paramChain: ["linkStrikes"], paramValue: onOff });
      calc.defaults.linkOpTypes &&
        // @ts-ignore
        updateCalcGlobal({ paramChain: ["linkOpTypes"], paramValue: onOff });
      !calc.defaults.changeOpType &&
        // @ts-ignore
        updateCalcGlobal({ paramChain: ["changeOpType"], paramValue: !onOff });
      !calc.defaults.changeAct &&
        // @ts-ignore
        updateCalcGlobal({ paramChain: ["changeAct"], paramValue: !onOff });
    },
    [
      updateCalcGlobal /* props.currentCalc.changeOpType, props.currentCalc.changeAct, */,
      calc?.linkExpiries,
      calc?.linkStrikes,
      calc?.linkOpTypes,
      calc?.changeOpType,
      calc?.changeAct,
    ]
  );
  const toggleAllOn = useGetIsAllOn(calc);
  const opSettingsNode = (
    <>
      {opLegs.length > 1 && (
        <Box mt={2} mb={1 / 2} className={css.toggleAll}>
          <Box
            onClick={() => onToggleAll(!toggleAllOn)}
            flexSec="center"
            className={css._checkLabel}
          >
            <input
              className="styled --linked --small"
              type="checkbox"
              checked={toggleAllOn}
            />
            <T content-detail ml={1 / 4}>
              Link option leg details based on strategy
            </T>
          </Box>
          <T content-detail-minor className={css._desc} mt={1 / 4}>
            {toggleAllOn ? (
              <>
                Linked fields indicated with{" "}
                <T tagName="span" className={css._eg}>
                  dashed underline
                </T>
              </>
            ) : (
              "All fields can be edited independent of other legs"
            )}
          </T>
        </Box>
      )}
      {featureNotDisabled("ADD_REMOVE_LEGS") && (
        <Box mv={1} mh={-1 / 2}>
          <Button
            onClick={addNewLeg}
            small
            outline
            ghost
            className={css.addOptionLegButtonContainer}
            childrenClassName={css._addOptionLegButton}
          >
            <Icon icon="new" small colorClickable className={css._addIcon} />
            Add option leg
          </Button>
        </Box>
      )}
    </>
  );

  return (
    <Box className={css.main}>
      <FieldSet
        basic={!SHOW_FIELDSET_BORDERS}
        title={
          SHOW_FIELDSET_BORDERS
            ? props.currentCalc.legsById[props.currentCalc.underlyingElement]
                .name
            : undefined
        }
        helpIconText={HELP_TEXT.STOCK_LEG}
        helpClickThroughPath={CONTENT_PATHS.HELP_STOCK_LEG}
        helpIconPos={isMob ? "bottom-left" : undefined}
        className={css.fieldSetCtnr}
      >
        {renderLeg(0, countOpLegs, props.currentCalc.underlyingElement, props)}
      </FieldSet>
      <Box className={css.vertSeparator} style={{ marginTop: "19px" }} />
      <Box mb={SHOW_FIELDSET_BORDERS ? undefined : countOpLegs >= 2 ? 3 : 1}>
        {opLegsJsx}
        {opSettingsNode}
      </Box>
      {category == "single" && (
        <Box className="flex-column my-2 flex items-center">
          <T tagName="h3" h5>
            Multi-strike
          </T>
          <Switch
            checked={multiStrike}
            onClick={() => dispatch(calcActions.toggleMultiStrike())}
            className={`${
              multiStrike ? "bg-green-500" : "bg-gray-600"
            } relative ml-2 inline-flex h-6 w-11 items-center rounded-full`}
          >
            <span className="sr-only">Use setting</span>
            <span
              className={`${
                multiStrike ? "translate-x-6" : "translate-x-1"
              } inline-block h-4 w-4 transform rounded-full bg-white transition`}
            />
          </Switch>
        </Box>
      )}
      {countOpLegs >= 2 && (
        <FieldSet
          basic={!SHOW_FIELDSET_BORDERS}
          title="Trade summary"
          className={css.fieldSetCtnr}
          helpIconText={HELP_TEXT.TOTALS_LEG}
          helpClickThroughPath={ROUTE_PATHS.HELP}
        >
          <>
            <NetSummary currentCalc={props.currentCalc} />
          </>
        </FieldSet>
      )}
    </Box>
  );
};

export default React.memo(EntryView);
