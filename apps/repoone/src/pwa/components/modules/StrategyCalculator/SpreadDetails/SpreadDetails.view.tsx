import React, { type FC } from "react";

import Box from "../../../primitives/Box";
import T from "../../../primitives/Typo";
import Autocomplete from "../../../primitives/Autocomplete";
import Input from "../../../primitives/Input";
import Tooltip from "../../../primitives/Tooltip";

import clx from "../../../../../utils/Html/clx";

import entryCss from "../Entry/Entry.module.scss";
import LinkToggleView from "../LinkToggle";
import makeGetExpiryItemValue from "../utils/getExpiryItemValue";
import makeGetStrikeItemValue from "../utils/getStrikeItemValue";

import { type SpreadDetailsProps } from "./SpreadDetails.props";
import {
  findATMItem,
  renderStrikeHeader,
  renderStrikeRow,
} from "../utils/strikeChoiceRenderUtils";
import useMediaQuery from "../../../../../utils/Hooks/useMediaQuery";
import HelpIcon from "../../../primitives/HelpIcon";
import HELP_TEXT from "../../../../../consts/HELP_TEXT";
import { HIGHLIGHT } from "../../../../../consts/HIGHLIGHT";
import { renderExpiryChoiceRow } from "../utils/expiryChoiceRenderUtils";
import ToggleButtonPair from "../../../primitives/ToggleButtonPair";
// import css from './SpreadDetails.scss';

const createPseudoEvt = (
  fieldId: string
): React.SyntheticEvent<HTMLElement> => {
  // @ts-ignore (this is the only part of FocusEvent that the handler is using)
  return { target: { dataset: { fieldId } } };
};

const SpreadDetailsView: FC<SpreadDetailsProps> = (
  props: SpreadDetailsProps
): ReturnType<typeof Box> => {
  const isMobile = useMediaQuery("mobile-only");
  const { settings: calcSettings } = props.currentCalc;

  const clearLinkedFocus = React.useCallback(
    () => props.setFocusLinkedField(null),
    [props.setFocusLinkedField]
  );

  const linkNumClick = (val: boolean) =>
    props.multiOnBlur(val, createPseudoEvt("linkNum"));
  const numHasLinkedFocus =
    props.spreadVals.linkOpTypes && props.focusLinkedField === "num";
  const numSetLinkedFocus = React.useCallback(
    () => props.setFocusLinkedField("num"),
    [props.setFocusLinkedField]
  );
  const inputNum = (
    <Box
      className={[
        entryCss["input-group"],
        entryCss["--id-quantity"],
        entryCss["input-row-line"],
        numHasLinkedFocus && entryCss["--linked-field-focused"],
        !props.spreadVals.linkNum && entryCss["--disabled"],
      ]}
    >
      <T
        className={[
          entryCss._label,
          entryCss["--has-icon-after"],
          !props.spreadVals.linkNum && entryCss["--disabled"],
        ]}
        tagName="label"
        htmlFor={`_spread_num`}
      >
        Quantity
      </T>
      <Input
        type="number"
        className={[entryCss._input, entryCss["--has-icon-after"]]}
        inputClassName={[entryCss["_entry-input"]]}
        placeholder={"# Contracts"}
        onChange={props.multiOnChange}
        onBlur={props.multiOnBlur}
        value={props.spreadVals.num || ""}
        // inputRef={quantityRef}
        inputId={`_spread_num`}
        spellCheck={false}
        autoComplete={"off"}
        data-field-id={"num"}
        disabled={!props.spreadVals.linkNum}
        onFocus={numSetLinkedFocus}
        onMouseOver={numSetLinkedFocus}
        onMouseOut={clearLinkedFocus}
        debounce
      />
      {
        <Box className={entryCss["_icon-after"]}>
          <Tooltip
            right={!isMobile}
            hard-bottom-left={isMobile}
            tip={
              props.spreadVals.linkNum
                ? "Unlink quantity (contracts)"
                : "Link quantity (contracts)"
            }
          >
            <LinkToggleView
              noToolTip
              state={props.spreadVals.linkNum}
              onClick={linkNumClick}
            />
          </Tooltip>
        </Box>
      }
    </Box>
  );

  const getExpiryItemValue = makeGetExpiryItemValue();
  const expiryEncouraged = props.spreadVals.linkExpiries;
  const linkExpiryClick = (val: boolean) =>
    props.multiOnBlur(val, createPseudoEvt("linkExpiries"));
  const expiryOnChange = React.useCallback(
    (val: string) => {
      props.multiOnChange(val, createPseudoEvt("expiry"));
    },
    [props.multiOnChange]
  );
  const expiryOnSelect = React.useCallback(
    (val: string) => props.multiOnBlur(val, createPseudoEvt("expiry")),
    [props.multiOnBlur]
  );
  const expiryHasLinkedFocus =
    props.spreadVals.linkOpTypes && props.focusLinkedField === "expiry";
  const expirySetLinkedFocus = React.useCallback(
    () => props.setFocusLinkedField("expiry"),
    [props.setFocusLinkedField]
  );
  const expiryHighlight = !expiryEncouraged
    ? undefined
    : !(props.spreadVals.expiry || "").length
    ? HIGHLIGHT.HIGHLIGHT
    : undefined;
  const expiryChoices =
    !props.expiryChoices.length && props.pricesLoading
      ? [{ date: "Loading...", dateCode: "" }]
      : props.expiryChoices;
  const expiryFocus = React.useCallback(() => {
    if (!props.expiryChoices.length && !props.pricesLoading) {
      props.getSymbPrices();
    }
    expirySetLinkedFocus();
  }, [expirySetLinkedFocus]);

  const inputExpiry = !calcSettings.showLinkExpiries ? null : (
    <Box
      className={[
        entryCss["input-group"],
        entryCss["--id-expiry"],
        entryCss["input-row-line"],
        expiryHasLinkedFocus && entryCss["--linked-field-focused"],
        !props.spreadVals.linkExpiries && entryCss["--disabled"],
      ]}
    >
      <T
        className={[entryCss._label]}
        tagName="label"
        htmlFor={`_spread_expiry`}
      >
        Expiry
      </T>
      {
        /*props.pricesLoading && props.spreadVals.linkExpiries ?
        <T content-pragmatic className={[entryCss._input, entryCss['--has-icon-after'], entryCss['--loading']]}>Loading...</T>
        : */
        <Autocomplete
          className={[entryCss._input, entryCss["--has-icon-after"]]}
          items={expiryChoices}
          value={props.spreadVals.expiry || ""}
          renderRow={renderExpiryChoiceRow}
          placeholder={
            props.pricesLoading
              ? "Loading..."
              : !props.spreadVals.linkExpiries
              ? "—"
              : "Date (DD Mmm YYYY)"
          }
          getItemValue={getExpiryItemValue}
          onChange={expiryOnChange}
          onSelect={expiryOnSelect}
          revertValue={props.savedSpreadVals.expiry || ""}
          // inputRef={expiryRef}
          // nextElementRef={expiryNextRef}
          allowFreeEntry={!props.expiryChoices.length}
          disableSelectBySpace
          inputProps={{
            inputClassName: clx([entryCss["_entry-input"]]),
            inputId: `_spread_expiry`,
            disabled: !props.spreadVals.linkExpiries,
            onFocus: expiryFocus,
            onMouseOver: expirySetLinkedFocus,
            onMouseOut: clearLinkedFocus,
            highlight: expiryHighlight,
            spellCheck: false,
          }}
        />
      }
      {
        <Box className={entryCss["_icon-after"]}>
          <Tooltip
            right={!isMobile}
            hard-bottom-left={isMobile}
            tip={
              props.spreadVals.linkExpiries
                ? "Unlink expiries"
                : "Link expiries"
            }
          >
            <LinkToggleView
              noToolTip
              state={props.spreadVals.linkExpiries}
              onClick={linkExpiryClick}
            />
          </Tooltip>
        </Box>
      }
    </Box>
  );

  const getStrikeItemValue = makeGetStrikeItemValue();
  const strikeEncouraged = props.spreadVals.linkStrikes;
  const linkStrikeClick = (val: boolean) =>
    props.multiOnBlur(val, createPseudoEvt("linkStrikes"));
  const strikeOnChange = React.useCallback(
    (val: string) => props.multiOnChange(val, createPseudoEvt("strike")),
    [props.multiOnChange]
  );
  const strikeOnSelect = React.useCallback(
    (val: string) => props.multiOnBlur(val, createPseudoEvt("strike")),
    [props.multiOnBlur]
  );
  const strikeHasLinkedFocus =
    props.spreadVals.linkOpTypes && props.focusLinkedField === "strike";
  const strikeSetLinkedFocus = React.useCallback(
    () => props.setFocusLinkedField("strike"),
    [props.setFocusLinkedField]
  );
  const defaultScrolledItem = findATMItem(props.strikeChoices);
  const strikeHighlight = !strikeEncouraged
    ? undefined
    : !(props.spreadVals.strike || "").length
    ? HIGHLIGHT.HIGHLIGHT
    : undefined;
  const strikeChoices =
    !props.strikeChoices.length && props.pricesLoading
      ? [
          {
            strike: "Loading...",
            percFromCur: "",
            delta: "",
            priceBid: null,
            priceAsk: null,
            isITM: false,
            legsAtStk: [],
            iv: null,
          },
        ]
      : /*isMobile ? mobileStrikeChoices :*/ props.strikeChoices;
  const strikeFocus = React.useCallback(() => {
    if (!props.strikeChoices.length && !props.pricesLoading) {
      props.getSymbPrices();
    }
    strikeSetLinkedFocus();
  }, [strikeSetLinkedFocus]);
  const inputStrike = !props.currentCalc?.settings?.showLinkStrikes ? null : (
    <Box
      className={[
        entryCss["input-group"],
        entryCss["--id-strike"],
        entryCss["input-row-line"],
        strikeHasLinkedFocus && entryCss["--linked-field-focused"],
        !props.spreadVals.linkStrikes && entryCss["--disabled"],
      ]}
    >
      <T
        className={[entryCss._label]}
        tagName="label"
        htmlFor={`_spread_strike`}
      >
        Strike
      </T>
      {
        <Autocomplete
          className={[entryCss._input, entryCss["--has-icon-after"]]}
          dropdownClassName={entryCss._dropdown}
          getItemValue={getStrikeItemValue}
          renderRow={renderStrikeRow}
          header={renderStrikeHeader()}
          items={strikeChoices}
          defaultScrolledItem={defaultScrolledItem}
          value={props.spreadVals.strike || ""}
          revertValue={props.savedSpreadVals.strike || ""}
          placeholder={props.pricesLoading ? "Loading..." : "Strike"}
          onChange={strikeOnChange}
          onSelect={strikeOnSelect}
          // inputRef={strikeRef}
          // nextElementRef={strikeNextRef}
          allowFreeEntry={!props.strikeChoices.length}
          disableSelectBySpace
          inputProps={{
            prefix: "$",
            prefixWidthRem: 1,
            inputClassName: clx([entryCss["_entry-input"]]),
            inputId: `_spread_strike`,
            disabled: !props.spreadVals.linkStrikes,
            onFocus: strikeFocus,
            onMouseOver: strikeSetLinkedFocus,
            onMouseOut: clearLinkedFocus,
            highlight: strikeHighlight,
            spellCheck: false,
          }}
        />
      }
      {
        <Box className={entryCss["_icon-after"]}>
          <Tooltip
            right={!isMobile}
            hard-bottom-left={isMobile}
            tip={
              props.spreadVals.linkStrikes ? "Unlink strikes" : "Link strikes"
            }
          >
            <LinkToggleView
              noToolTip
              state={props.spreadVals.linkStrikes}
              onClick={linkStrikeClick}
            />
          </Tooltip>
        </Box>
      }
    </Box>
  );

  const linkOpTypeClick = (val: boolean) =>
    props.multiOnBlur(val, createPseudoEvt("linkOpTypes"));
  // const opTypeEncouraged = props.spreadVals.linkOpTypes;
  // const opTypeOnChange = React.useCallback(
  //   (val: string) => props.multiOnChange(val, createPseudoEvt("opType")),
  //   [props.multiOnChange]
  // );
  // const opTypeOnSelect = React.useCallback(
  //   (val: string) => props.multiOnBlur(val, createPseudoEvt("opType")),
  //   [props.multiOnBlur]
  // );
  const opTypeOnClick = React.useCallback(
    (val: string) => {
      props.multiOnChange(val, createPseudoEvt("opType"));
      props.multiOnBlur(val, createPseudoEvt("opType"));
    },
    [props.multiOnChange, props.multiOnBlur]
  );
  const opTypeHasLinkedFocus =
    props.spreadVals.linkOpTypes && props.focusLinkedField === "opType";
  // const opTypeSetLinkedFocus = React.useCallback(
  //   () => props.setFocusLinkedField("opType"),
  //   [props.setFocusLinkedField]
  // );
  const opTypeOptions = React.useMemo(
    () => ({
      Call: "Call",
      Put: "Put",
    }),
    []
  );
  // const opTypeHighlight = !opTypeEncouraged
  //   ? undefined
  //   : !(props.spreadVals.opType || "").length
  //   ? HIGHLIGHT.HIGHLIGHT
  //   : undefined;
  const inputOpType = !props.currentCalc?.settings?.showLinkOpTypes ? null : (
    <Box
      className={[
        entryCss["input-group"],
        entryCss["--id-opType"],
        entryCss["input-row-line"],
        opTypeHasLinkedFocus && entryCss["--linked-field-focused"],
        !props.spreadVals.linkOpTypes && entryCss["--disabled"],
      ]}
    >
      <T
        className={[entryCss._label]}
        tagName="label"
        htmlFor={`_spread_opType`}
      >
        Op. Type
      </T>
      <Box>
        <ToggleButtonPair
          value={props.spreadVals.opType}
          setValue={opTypeOnClick}
          options={opTypeOptions}
        />
      </Box>
      {
        <Box className={entryCss["_icon-after"]}>
          <Tooltip
            right={!isMobile}
            hard-bottom-left={isMobile}
            tip={
              props.spreadVals.linkOpTypes
                ? "Unlink option type"
                : "Link option type"
            }
          >
            <LinkToggleView
              noToolTip
              state={props.spreadVals.linkOpTypes}
              onClick={linkOpTypeClick}
            />
          </Tooltip>
        </Box>
      }
    </Box>
  );

  const toggleAllOn =
    props.spreadVals.linkNum &&
    (!calcSettings.showLinkExpiries || props.spreadVals.linkExpiries) &&
    (calcSettings.showLinkOpTypes ||
      !props.currentCalc.changeOpType ||
      props.spreadVals.linkOpTypes) &&
    (props.currentCalc.changeAct || !props.currentCalc.changeAct) &&
    (!props.currentCalc.linkStrikes || props.spreadVals.linkStrikes);

  return (
    <Box className={entryCss["fields-set"]}>
      <Box className={[entryCss["fields-ctnr"], entryCss["--stacked"]]}>
        {inputNum}
        {inputExpiry}
        {inputStrike}
        {inputOpType}
      </Box>
      <T
        tagName="span"
        content-detail
        clickable
        subtle
        onClick={() => props.onToggleAll(!toggleAllOn)}
      >
        <input
          type="checkbox"
          className="styled"
          checked={toggleAllOn}
          onChange={() => props.onToggleAll(!toggleAllOn)}
        />{" "}
        Link option details based on strategy
      </T>{" "}
      <HelpIcon
        wide
        helpIconPos={"top-left"}
        tip={
          !toggleAllOn
            ? HELP_TEXT.SPREAD_DETAILS_LINK_BTN_LINK
            : HELP_TEXT.SPREAD_DETAILS_LINK_BTN_UNLINK
        }
      />
    </Box>
  );
};

export default SpreadDetailsView;
