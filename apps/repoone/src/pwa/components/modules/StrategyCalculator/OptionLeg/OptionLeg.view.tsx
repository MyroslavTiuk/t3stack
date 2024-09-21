import React, { type FC } from "react";
import { isNull } from "errable";

import { type Nullable } from "opc-types/lib/util/Nullable";
import { LAYOUT_OPTIONS } from "../../../../../types/enums/LAYOUT_OPTIONS";
import clx from "../../../../../utils/Html/clx";
import formatPrice from "../../../../../utils/String/formatPrice/formatPrice";
import orUndef from "../../../../../utils/Data/orUndef/orUndef";
import Box from "../../../primitives/Box";
import T from "../../../primitives/Typo";
import Autocomplete from "../../../primitives/Autocomplete";
import ExpandableGroupView from "../../../primitives/ExpandableGroup";
import Button from "../../../primitives/Button";
import Input from "../../../primitives/Input";
import Slider from "../../../primitives/Slider";
import selectUnderlyingLeg from "../../../../store/selectors/currentCalculation/selectUnderlyingLeg";
import useMediaQuery from "../../../../../utils/Hooks/useMediaQuery";
import Theme from "../../../../theme/Theme";

// import { type PriceChoice } from "../types/PriceChoice";
import type StrikeChoice from "./types/StrikeChoice";
import { type OptionLegProps } from "./OptionLeg.props";
import OptionGreekPanel from "./OptionGreekPanel.container";

import { HIGHLIGHT } from "../../../../../consts/HIGHLIGHT";
import makeGetExpiryItemValue from "../utils/getExpiryItemValue";
import {
  addATMdummyOption,
  findATMItem,
  findSelectedItem,
  getStrikeItemValue,
  renderStrikeHeader,
  renderStrikeRow,
  renderStrikeRowMobile,
  StrikeSelectorHints,
} from "../utils/strikeChoiceRenderUtils";

import entryCss from "../Entry/Entry.module.scss";
import css from "./OptionLeg.module.scss";
import { usePriceSliderProps } from "./utils/usePriceSliderProps";
import getUseCustomPrice from "./utils/getUseCustomPrice";
import { renderExpiryChoiceRow } from "../utils/expiryChoiceRenderUtils";
import Icon from "../../../primitives/Icon";
import featureNotDisabled from "../../../../../utils/App/featureNotDisabled";
import round from "../../../../../utils/Data/round/round";
import useToggleState from "../../../../../utils/Hooks/useToggleState";
import TradeToggle from "./TradeToggle";
import useDebounceEffect from "../../../../../utils/Hooks/useDebounceEffect";
import DropdownMenu from "../../../primitives/DropdownMenu";
import useCustomHotkeysCalculator, {
  CalculatorKeys,
} from "../utils/useCustomHotKeys";

const FULLY_LOCK_ACT = false;
const FULLY_LOCK_OP_TYPE = false;
const ALLOW_STACKED_OP_TWEAKS = false;

const RemoveLegButton = ({ removeLeg }: { removeLeg: () => void }) => (
  <Box onClick={removeLeg} flexPri="center" className={css.removeLegButton}>
    <Box className={css._icon}>
      <Icon
        icon="trash"
        xsmall
        className={css._removeLegIcon}
        alt="Remove leg"
      />
    </Box>
  </Box>
);

const OptionLegView: FC<OptionLegProps> = (
  props: OptionLegProps
): ReturnType<typeof Box> => {
  const isMobile = useMediaQuery("mobile-only");
  const { inputMethod, inputMethodMobile } = props;
  // console.log(props)
  const resolvedInputMethod = isMobile ? inputMethodMobile : inputMethod;
  const isInline = React.useMemo(
    () => resolvedInputMethod === "inline",
    [resolvedInputMethod, isMobile]
  );

  // useHotkeys("alt+o", () => {
  //   props.toggleOptionChain();
  // });

  useCustomHotkeysCalculator(CalculatorKeys.openOptionsChain, () => {
    props.toggleOptionChain();
  });

  const priceRef = React.useRef<Nullable<HTMLInputElement>>(null);
  const selectOptionRef = React.useRef<Nullable<HTMLButtonElement>>(null);
  const quantityRef = React.useRef<Nullable<HTMLInputElement>>(null);
  const opTypeRef = React.useRef<Nullable<HTMLInputElement>>(null);
  const strikeRef = React.useRef<Nullable<HTMLInputElement>>(null);
  const expiryRef = React.useRef<Nullable<HTMLInputElement>>(null);

  // let actNextRef;
  // let priceNextRef;
  // let opTypeNextRef;
  let strikeNextRef;
  let expiryNextRef;
  // let quantityNextRef;

  // Clearer to assign in groups (hence let and assignment)
  if (isInline) {
    // actNextRef = quantityRef;
    expiryNextRef = strikeRef;
    strikeNextRef = opTypeRef;
    // opTypeNextRef = priceRef;
    // priceNextRef = undefined;
  } /* !isInline (stacked) */ else {
    // actNextRef = selectOptionRef;
    // priceNextRef = quantityRef;
    // quantityNextRef = undefined;
    // opTypeNextRef = strikeRef;
    strikeNextRef = expiryRef;
    expiryNextRef = undefined;
  }

  // const getPriceItemValue = useCallback(
  //   (priceChoice: PriceChoice) =>
  //     `${formatPrice(priceChoice.price, { hideDollar: true })} (${
  //       priceChoice.position
  //     })`,
  //   []
  // );
  const optionComplete = !!props.optionCode;

  const showMiniInline =
    (!!props.leg.expiry || !!props.leg.strike) &&
    !!props.leg.opType &&
    ALLOW_STACKED_OP_TWEAKS &&
    !isInline;

  const clearLinkedFocus = React.useCallback(
    () => props.setFocusLinkedField(null),
    [props.setFocusLinkedField]
  );

  const opTypeChangable =
    props.curCalc.defaults.changeOpType ||
    props.curCalc.changeOpType ||
    !FULLY_LOCK_OP_TYPE;
  // const opTypeEncouraged =
  //   props.curCalc.defaults.changeOpType ||
  //   props.curCalc.changeOpType ||
  //   (!props.curCalcLeg.defaults.opType && props.ofLegs === 1) ||
  //   (!props.curCalc.linkOpTypes && props.ofLegs > 1);
  const opTypeLinked = props.curCalc.linkOpTypes;
  // const opTypeShowLinkSwitch =
  //   props.curCalc.settings.showLinkOpTypes ||
  //   props.curCalc.defaults.linkOpTypes;
  const opTypeOnClick = React.useCallback(
    (forcedType?: string) => {
      props.opTypeOnChange(
        forcedType || (props.leg.opType === "Put" ? "Call" : "Put")
      );
      props.opTypeOnSelect(
        forcedType || (props.leg.opType === "Put" ? "Call" : "Put")
      );
    },
    [props.leg.opType, props.opTypeOnChange, props.opTypeOnSelect]
  );
  const opTypeHasLinkedFocus =
    props.leg.linkOpTypes && props.focusLinkedField === "opType";
  const opTypeSetLinkedFocus = React.useCallback(
    () => props.setFocusLinkedField("opType"),
    [props.setFocusLinkedField]
  );
  const opTypeHighlight = opTypeLinked
    ? HIGHLIGHT.NO_HIGHLIGHT
    : !(props.leg.opType || "").length
    ? HIGHLIGHT.HIGHLIGHT
    : !(props.savedLeg.opType || "").length
    ? HIGHLIGHT.WARNING
    : undefined;
  const opTypeBlank = !props.leg.opType;
  const opTypeItems = ["Call", "Put"];

  const inputOpType = (
    <Box
      className={[
        entryCss["input-group"],
        entryCss["--id-op-type"],
        entryCss["input-row-line"],
        opTypeHasLinkedFocus && entryCss["--linked-field-focused"],
        opTypeLinked && entryCss["--linked"],
        opTypeBlank ? entryCss["--blank"] : entryCss["--binary"],
        showMiniInline && entryCss["--mini-inline"],
      ]}
    >
      <T
        className={entryCss._label}
        tagName="label"
        htmlFor={`${props.legId}_opType`}
      >
        {isInline ? "Type" : "Op. Type"}
      </T>
      <>
        {!props.leg.opType && opTypeChangable ? (
          <Autocomplete
            items={opTypeItems}
            value={""}
            onSelect={opTypeOnClick}
            className={[entryCss._input]}
            inputProps={{
              inputClassName: clx([entryCss["_entry-input"]]),
              inputId: `${props.legId}_opType`,
              highlight: opTypeHighlight,
              onFocus: opTypeSetLinkedFocus,
              onMouseOut: clearLinkedFocus,
              onMouseOver: opTypeSetLinkedFocus,
            }}
            placeholder="Type"
          />
        ) : (
          <Box
            onMouseOver={opTypeSetLinkedFocus}
            onMouseOut={clearLinkedFocus}
            className={entryCss._ctnr}
          >
            <Button
              className={clx([
                entryCss._input,
                opTypeHasLinkedFocus && entryCss["--linked-field-focused"],
                opTypeLinked && entryCss["--linked"],
              ])}
              childrenClassName={entryCss._btn}
              onClick={opTypeOnClick}
              ghost
              x-small
            >
              <Box flexSec="center">
                <span className={entryCss._text}>{props.leg.opType}</span>
                <Icon icon="flip" noSize ctnrClassName={entryCss._icon} />
              </Box>
            </Button>
          </Box>
        )}
      </>
    </Box>
  );

  // const showStrikeLink = props.curCalc.settings.showLinkStrikes;
  const strikeDisabled = false; // props.leg.linkStrikes;
  const strikeLinked = props.leg.linkStrikes;
  const checkItemMatch = React.useCallback(
    (i: StrikeChoice, val: string) =>
      i.strike.replace(",", "").includes(val.replace(",", "")),
    []
  );
  const strikeHasLinkedFocus =
    props.leg.linkStrikes && props.focusLinkedField === "strike";
  const strikeSetLinkedFocus = React.useCallback(
    () => props.setFocusLinkedField("strike"),
    [props.setFocusLinkedField]
  );
  const curPriceLast = React.useMemo(
    () => selectUnderlyingLeg(props.curCalc)?.curPriceLast ?? null,
    [props.curCalc]
  );
  const strikeChoicesWAtm = React.useMemo(
    () => addATMdummyOption(props.strikeChoices, curPriceLast),
    [props.strikeChoices, curPriceLast]
  );
  const defaultScrolledItem =
    findSelectedItem(props.leg.strike, props.strikeChoices) ||
    findATMItem(props.strikeChoices);
  const strikeHighlight =
    (props.leg.strike || "").length && !(props.savedLeg.strike || "").length
      ? HIGHLIGHT.WARNING
      : strikeLinked
      ? HIGHLIGHT.NO_HIGHLIGHT
      : !(props.leg.strike || "").length
      ? HIGHLIGHT.HIGHLIGHT
      : undefined;
  const strikeBlank = !props.leg.strike.length;
  const strikeChoices =
    !props.strikeChoices.length && props.priceLoading
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
      : strikeChoicesWAtm;
  const strikeFocus = React.useCallback(() => {
    if (!props.strikeChoices.length && !props.priceLoading) {
      props.getSymbPrices();
    }
    strikeSetLinkedFocus();
  }, [
    props.strikeChoices,
    props.priceLoading,
    props.getSymbPrices,
    strikeSetLinkedFocus,
  ]);
  const inputStrike = (
    <Box
      className={[
        entryCss["input-group"],
        entryCss["--id-strike"],
        entryCss["input-row-line"],
        strikeHasLinkedFocus && entryCss["--linked-field-focused"],
        strikeLinked && entryCss["--linked"],
        strikeBlank && entryCss["--blank"],
      ]}
    >
      <T
        className={entryCss._label}
        tagName="label"
        htmlFor={`${props.legId}_strike`}
      >
        Strike
      </T>
      <Autocomplete
        className={[entryCss._input]}
        dropdownClassName={entryCss._dropdown}
        position="middle"
        items={strikeChoices}
        defaultScrolledItem={defaultScrolledItem}
        getItemValue={getStrikeItemValue}
        renderRowString={orUndef(isMobile && renderStrikeRowMobile)}
        renderRow={renderStrikeRow}
        header={
          isMobile
            ? undefined
            : renderStrikeHeader(
                (props.savedLeg.expiry ? 0 : StrikeSelectorHints.EXPIRY) |
                  (props.savedLeg.opType ? 0 : StrikeSelectorHints.TYPE)
              )
        }
        checkItemMatch={checkItemMatch}
        value={props.leg.strike || ""}
        revertValue={props.savedLeg.strike || ""}
        placeholder={
          props.priceLoading ? "Loading..." : strikeDisabled ? "—" : "Strike"
        }
        onChange={props.strikeOnChange}
        onSelect={(v) => {
          props.strikeOnSelect(v);
          clearLinkedFocus();
        }}
        nextElementRef={strikeNextRef}
        inputRef={strikeRef}
        allowFreeEntry={!isMobile && !props.strikeChoices.length}
        inputProps={{
          prefix: "$",
          inputClassName: clx([
            entryCss["_entry-input"],
            entryCss["--has-prefix"],
          ]),
          inputId: `${props.legId}_strike`,
          onFocus: strikeFocus,
          onMouseOut: clearLinkedFocus,
          onMouseOver: strikeSetLinkedFocus,
          highlight: strikeHighlight,
          noUnderline: strikeLinked || showMiniInline,
          spellCheck: false,
        }}
      />
    </Box>
  );

  const getExpiryItemValue = makeGetExpiryItemValue();
  const expiryLinked = props.leg.linkExpiries;
  // const showExpiryLink = props.curCalc.settings.showLinkExpiries;
  const expiryHasLinkedFocus =
    props.leg.linkExpiries && props.focusLinkedField === "expiry";
  const expirySetLinkedFocus = React.useCallback(
    () => props.setFocusLinkedField("expiry"),
    [props.setFocusLinkedField]
  );
  const expiryBlank = !props.leg.expiry?.length;
  const expiryHighlight =
    (props.leg.expiry || "").length && !(props.savedLeg.expiry || "").length
      ? HIGHLIGHT.WARNING
      : props.leg.linkExpiries || !expiryBlank
      ? HIGHLIGHT.NO_HIGHLIGHT
      : HIGHLIGHT.HIGHLIGHT;
  const expiryChoices =
    !props.expiryChoices.length && props.priceLoading
      ? [{ date: "Loading...", dateCode: "" }]
      : props.expiryChoices;
  const expiryFocus = React.useCallback(() => {
    if (!props.expiryChoices.length && !props.priceLoading) {
      props.getSymbPrices();
    }
    expirySetLinkedFocus();
  }, [
    props.expiryChoices,
    props.priceLoading,
    props.getSymbPrices,
    expirySetLinkedFocus,
  ]);
  const inputExpiry = (
    <Box
      className={[
        entryCss["input-group"],
        entryCss["--id-expiry"],
        entryCss["input-row-line"],
        expiryHasLinkedFocus && entryCss["--linked-field-focused"],
        expiryLinked && entryCss["--linked"],
        expiryBlank && entryCss["--blank"],
      ]}
    >
      <T
        className={entryCss._label}
        tagName="label"
        htmlFor={`${props.legId}_expiry`}
      >
        Expiry
      </T>
      <Autocomplete
        className={[entryCss._input]}
        items={expiryChoices}
        // @ts-ignore
        value={props.leg.expiry || ""}
        // @ts-ignore
        revertValue={props.savedLeg.expiry || ""}
        renderRow={renderExpiryChoiceRow}
        placeholder={
          props.priceLoading ? "Loading..." : isInline ? "Expiry" : "Date"
        }
        getItemValue={getExpiryItemValue}
        onChange={props.expiryOnChange}
        onSelect={(v) => {
          props.expiryOnSelect(v);
          clearLinkedFocus();
        }}
        inputRef={expiryRef}
        nextElementRef={expiryNextRef}
        allowFreeEntry={!expiryChoices.length}
        autoScrollOffset={Theme.$headerHeight}
        disableSelectBySpace
        inputProps={{
          inputClassName: clx([entryCss["_entry-input"]]),
          inputId: `${props.legId}_expiry`,
          onFocus: expiryFocus,
          onMouseOver: expirySetLinkedFocus,
          onMouseOut: clearLinkedFocus,
          highlight: expiryHighlight,
          noUnderline: expiryLinked || showMiniInline,
          spellCheck: false,
        }}
      />
    </Box>
  );

  const actChangable =
    props.curCalc.defaults.changeAct ||
    props.curCalc.changeAct ||
    !FULLY_LOCK_ACT;
  // const actEncouraged =
  //   props.curCalc.defaults.changeAct || props.curCalc.changeAct;
  const actOnToggle = React.useCallback(() => {
    props.actOnChange(props.leg.act === "Buy" ? "Sell" : "Buy");
    props.actOnSelect(props.leg.act === "Buy" ? "Sell" : "Buy");
  }, [props.leg.act, props.actOnChange, props.actOnSelect]);
  const actOnClick = React.useCallback(
    (newVal: string) => {
      props.actOnChange(newVal);
      props.actOnSelect(newVal);
    },
    [props.leg.act, props.actOnChange, props.actOnSelect]
  );
  const inputAct = (
    <Box
      className={[
        entryCss["input-group"],
        entryCss["--id-act"],
        entryCss["input-row-line"],
      ]}
    >
      <T
        className={entryCss._label}
        tagName="label"
        htmlFor={`${props.legId}_act`}
      >
        {isInline ? (
          "Trd"
        ) : (
          <>
            Buy/sell
            <span
              className={
                props.leg.act ? entryCss.reqComplete : entryCss.reqIncomplete
              }
            >
              *
            </span>
          </>
        )}
      </T>
      {!isInline ? (
        <Box>
          <TradeToggle
            value={props.leg.act}
            setValue={actOnClick}
            disabled={props.stockNotSelected}
          />
        </Box>
      ) : !actChangable && FULLY_LOCK_ACT ? (
        <T
          content-pragmatic
          className={[entryCss._input, entryCss["--static"]]}
        >
          {props.leg.act}
        </T>
      ) : (
        <Box className={entryCss._ctnr}>
          <Button
            className={entryCss._input}
            childrenClassName={entryCss._btn}
            onClick={actOnToggle}
            ghost
            x-small
          >
            <Box flexSec="center">
              <span className={entryCss._text}>{props.leg.act}</span>
              <Icon icon="flip" noSize ctnrClassName={entryCss._icon} />
            </Box>
          </Button>
        </Box>
      )}
    </Box>
  );

  const inputSelectBtn = isInline ? (
    <Button
      x-small
      onClick={props.toggleOptionChain}
      disabled={props.stockNotSelected}
      buttonRef={selectOptionRef}
      className={clx([
        entryCss.openChainButton,
        entryCss["--show-triangle-indicator"],
        props.ofLegs >= 2 && entryCss["--of-multiple"],
        props.showChainForLeg === props.legId && entryCss["--selected"],
      ])}
    >
      Select from chain
      <Box tagName="span" className={[entryCss._chain]} />
    </Button>
  ) : (
    <Box flexPri="start" flexSec="center" className="flex-col lg:flex-row">
      {optionComplete && !ALLOW_STACKED_OP_TWEAKS ? (
        <T content-pragmatic mr={1 / 3}>
          {props.optionCode}
        </T>
      ) : (
        !optionComplete && !ALLOW_STACKED_OP_TWEAKS && null
      )}
      <Button
        small
        className={clx([
          entryCss.openChainButton,
          props.showChainForLeg === props.legId && entryCss["--selected"],
        ])}
        childrenClassName={entryCss._contents}
        onClick={props.toggleOptionChain}
        disabled={props.stockNotSelected}
        buttonRef={selectOptionRef}
        set-last={showMiniInline}
        in-set={showMiniInline}
      >
        {
          ///////////////// Option button of the call option or other legs
          showMiniInline
            ? "Select"
            : optionComplete && !ALLOW_STACKED_OP_TWEAKS
            ? `Select`
            : "Select option from chain"
        }
        <Box tagName="span" className={[entryCss._chain]} />
      </Button>
    </Box>
  );
  const inputSelectOption = (
    <Box
      className={[
        entryCss["input-group"],
        entryCss["--id-option"],
        entryCss["input-row-line"],
      ]}
    >
      <T className={entryCss._label} tagName="label">
        Option
        <span
          className={
            optionComplete ? entryCss.reqComplete : entryCss.reqIncomplete
          }
        >
          *
        </span>
      </T>
      <Box className={entryCss._input}>
        {showMiniInline ? (
          <Box className={entryCss["__mini-inline"]}>
            <Box className={[entryCss["fields-ctnr"], entryCss["--inline"]]}>
              {[inputExpiry, inputStrike, inputOpType, inputSelectBtn]}
            </Box>
          </Box>
        ) : (
          inputSelectBtn
        )}
      </Box>
    </Box>
  );

  // const useCustomPrice = props.curCalcLeg.customPrice;
  // const toggleCustomPrice = React.useCallback(
  //   () => props.customPriceOnSelect(!useCustomPrice),
  //   [useCustomPrice, props.customPriceOnSelect]
  // );
  React.useEffect(
    function forceUseCustomPriceIfOutsideRange() {
      if (
        getUseCustomPrice(
          props.curCalcLeg.price,
          props.curCalcLeg.priceRange[0],
          props.curCalcLeg.priceRange[1]
        )
      ) {
        props.customPriceOnSelect(true);
      }
    },
    [props.curCalcLeg.price, ...props.curCalcLeg.priceRange]
  );

  const [priceDispVal, setPriceDispVal] = React.useState(props.leg.price);
  const {
    value: priceHasFocus,
    enable: priceFocus,
    disable: priceBlur,
  } = useToggleState(false);
  useDebounceEffect(
    () => {
      props.priceOnChange(priceDispVal);
      props.priceOnSelect(priceDispVal);
    },
    [priceDispVal],
    500
  );
  React.useEffect(() => {
    if (
      !priceHasFocus ||
      props.curCalcLeg.price?.toFixed(2) !== props.leg.price
    ) {
      setPriceDispVal(props.leg.price);
    }
  }, [props.leg.price, priceHasFocus]);
  const fmtPriceDispVal = priceHasFocus
    ? priceDispVal
    : !isNaN(parseFloat(priceDispVal))
    ? parseFloat(priceDispVal).toFixed(2)
    : "";

  const priceSliderProps = usePriceSliderProps({
    range: props.curCalcLeg.priceRange,
    val: isNull(props.leg.price) ? null : parseFloat(props.leg.price),
    onChange: (v: number) => props.priceOnSelect(round(v, 2).toString()),
    onUpdate: (v: number) => setPriceDispVal(round(v, 2).toString()),
    showTag: false,
  });
  const inputPrice = (
    <Box
      className={[
        entryCss["input-group"],
        isInline && entryCss["--short-label"],
        entryCss["--id-price"],
        entryCss["input-row-line"],
      ]}
    >
      <T
        className={[entryCss._label, entryCss["--has-prefix"]]}
        tagName="label"
        htmlFor={`${props.legId}_price`}
      >
        Price each
        <span
          className={
            props.leg.price ? entryCss.reqComplete : entryCss.reqIncomplete
          }
        >
          *
        </span>
      </T>
      <Box className={entryCss._input} flexSec={"center"} flexPri={"start"}>
        <Input
          className={[entryCss["_custom-text"]]}
          inputClassName={[entryCss["_entry-input"], entryCss["--has-prefix"]]}
          prefix={"$"}
          onChange={setPriceDispVal}
          onFocus={priceFocus}
          onSet={(v) => {
            if (v !== "") {
              props.priceOnSelect(v);
            }
          }}
          onBlur={() => {
            priceBlur();
            clearLinkedFocus();
          }}
          value={fmtPriceDispVal}
          inputRef={priceRef}
          inputId={`${props.legId}_price`}
          spellCheck={false}
          autoComplete={"off"}
          disabled={!props.optionCode}
        />
        {!!props.optionCode && (
          <Box flex-1 style={{ maxWidth: "10em" }}>
            <Slider {...priceSliderProps} />
          </Box>
        )}
      </Box>
    </Box>
  );

  // const showNumLink = Boolean(props.legSettings.suggestedNumEle);
  const numLinked = props.leg.linkNum;
  const numHasLinkedFocus =
    props.leg.linkNum && props.focusLinkedField === "num";
  const numSetLinkedFocus = React.useCallback(
    () => props.setFocusLinkedField("num"),
    [props.setFocusLinkedField]
  );
  const numHighlight = numLinked
    ? HIGHLIGHT.NO_HIGHLIGHT
    : !(props.leg.num || "").length
    ? HIGHLIGHT.HIGHLIGHT
    : !(props.savedLeg.num || "").length
    ? HIGHLIGHT.WARNING
    : undefined;
  const numInputFieldNode = (
    <Input
      className={entryCss._inputField}
      type={"number"}
      inputClassName={[entryCss["_entry-input"]]}
      placeholder={isInline ? "Qty" : "# contracts"}
      onChange={props.numOnChange}
      onBlur={(v) => {
        props.numOnSelect(v);
        clearLinkedFocus();
      }}
      onFocus={numSetLinkedFocus}
      onMouseOver={numSetLinkedFocus}
      onMouseOut={clearLinkedFocus}
      value={props.leg.num}
      highlight={numHighlight}
      inputRef={quantityRef}
      inputId={`${props.legId}_num`}
      spellCheck={false}
      autoComplete={"off"}
      noStyle={numLinked || numHasLinkedFocus}
      debounce
    />
  );
  const inputNum = (
    <Box
      className={[
        entryCss["input-group"],
        entryCss["--id-quantity"],
        entryCss["input-row-line"],
        numHasLinkedFocus && entryCss["--linked-field-focused"],
        numLinked && entryCss["--linked"],
      ]}
    >
      <T
        className={[entryCss._label]}
        tagName="label"
        htmlFor={`${props.legId}_num`}
      >
        {isInline ? (
          "Qty"
        ) : (
          <>
            Quantity
            <span
              className={
                props.leg.num ? entryCss.reqComplete : entryCss.reqIncomplete
              }
            >
              *
            </span>
          </>
        )}
      </T>
      <Box className={entryCss._input}>
        {isInline ? (
          numInputFieldNode
        ) : (
          <Box flexSec="baseline">
            {numInputFieldNode}
            <T content-detail hint mt={2}>
              &nbsp;x&nbsp;100
            </T>
          </Box>
        )}
        {isInline && (
          <>
            <T content-pragmatic anemic className={entryCss._ghostText}>
              {props.leg.num}
            </T>
            <T content-pragmatic anemic className={entryCss._x}>
              {props.leg.num ? "x" : ""}
            </T>
          </>
        )}
      </Box>
    </Box>
  );
  const totalCalculable = !!(props.leg.num && props.leg.price);
  const inputTotalCost = (
    <Box
      className={[
        entryCss["input-group"],
        entryCss["--id-total"],
        entryCss["input-row-line"],
        numHasLinkedFocus && entryCss["--linked-field-focused"],
        numLinked && entryCss["--linked"],
      ]}
    >
      <T
        className={[entryCss._label]}
        tagName="label"
        htmlFor={`${props.legId}_num`}
      >
        Leg Cost
      </T>
      <Box className={entryCss._input}>
        <T
          content-pragmatic={totalCalculable}
          content-hint={!totalCalculable}
          style={{ whiteSpace: "nowrap" }}
        >
          {totalCalculable ? (
            <>
              {formatPrice(
                parseFloat(props.leg.num) * parseFloat(props.leg.price) * 100
              )}
              {props.leg.act === "Sell" && (
                <T tagName="span" content-detail hint>
                  &nbsp;(credit)
                </T>
              )}
            </>
          ) : (
            "—"
          )}
        </T>
      </Box>
    </Box>
  );

  const showName = true; // props.ofLegs >= 2;
  const checkBoxToLeft =
    !isMobile && !(props.layout === LAYOUT_OPTIONS.SIDE_BY_SIDE);
  return (
    <Box
      className={[
        css.container,
        entryCss["fields-set"],
        props.leg?.disabled && css["--disabled"],
      ]}
    >
      <Box
        className={[
          entryCss._header,
          checkBoxToLeft && css["--checkBoxToLeft"],
          css.header,
          !showName && entryCss["--no-top-margin"],
          "--pri-space-between",
          "--sec-baseline",
        ]}
        flex
      >
        {showName && (
          <Box flex>
            <Box
              flexSec="center"
              style={{ flexDirection: checkBoxToLeft ? "row" : "row-reverse" }}
              mr={4}
            >
              <Box
                mr={checkBoxToLeft ? 1 / 4 : 0}
                ml={!checkBoxToLeft ? 1 / 3 : 0}
                flex-center
              >
                <input
                  className={clx(["styled --small", css.disableLegChkbox])}
                  type="checkbox"
                  onChange={() => props.disabledOnSelect(!props.leg?.disabled)}
                  checked={!props.leg?.disabled || false}
                />
              </Box>
              <T
                h5
                className={[
                  entryCss._name,
                  `--sec-center flex ${isMobile ? "mr-2" : "ml-2"}`,
                ]}
              >
                {props.name}
              </T>
            </Box>
            {featureNotDisabled("ADD_REMOVE_LEGS") && props.ofLegs > 1 && (
              <DropdownMenu className={css.actionMenu} position="bottomRight">
                {[
                  <Box key={5} mh={1 / 4} className={css.actionMenuTrigger}>
                    <Icon
                      icon="three-dot-menu"
                      colorClickable
                      small
                      rotate={90}
                    />
                  </Box>,
                  <Box
                    key={5}
                    flex
                    className={css.actionMenu}
                    onClick={props.removeLeg}
                  >
                    <T clickable content-pragmatic subtle>
                      Delete&nbsp;leg
                    </T>
                    <RemoveLegButton removeLeg={props.removeLeg} />
                  </Box>,
                ]}
              </DropdownMenu>
            )}
          </Box>
        )}
        {isInline && (
          <Box flexPri="end" flex-1>
            {inputSelectBtn}
          </Box>
        )}
      </Box>
      {isInline ? (
        <>
          <Box
            className={[
              entryCss["fields-ctnr"],
              entryCss[`--${resolvedInputMethod}`],
            ]}
          >
            {inputAct}
            {inputNum}
            {inputExpiry}
            {inputStrike}
            {inputOpType}
          </Box>
          <Box
            className={[
              entryCss["fields-ctnr"],
              entryCss["--collapse-child-top-margin"],
              entryCss[`--stacked`],
            ]}
          >
            {inputPrice}
          </Box>
          <ExpandableGroupView
            // todo: Make a controlled component / receive updates to store expanded preferences
            defaultShowing={{}}
            groups={{
              "IV & Greeks": (
                <OptionGreekPanel
                  optPrice={props.optPrice}
                  legId={props.legId}
                />
              ),
            }}
          />
        </>
      ) : (
        <Box
          className={[
            entryCss["fields-ctnr"],
            entryCss[`--${resolvedInputMethod}`],
          ]}
        >
          {inputAct}
          {inputSelectOption}
          {inputPrice}
          {inputNum}
          {inputTotalCost}
          <ExpandableGroupView
            // todo: Make a controlled component / receive updates to store expanded preferences
            defaultShowing={{}}
            groups={{
              // Details: (
              //   <Box
              //     className={[entryCss['fields-ctnr'], entryCss[`--${inputMethod}`]]}
              //   >
              //     {inputOpType}
              //     {inputStrike}
              //     {inputExpiry}
              //   </Box>
              // ),
              "IV & Greeks": (
                <OptionGreekPanel
                  optPrice={props.optPrice}
                  legId={props.legId}
                />
              ),
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default OptionLegView;
