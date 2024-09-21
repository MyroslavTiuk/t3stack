import React, {
  type PropsWithChildren,
  type ReactNode,
  useContext,
  useRef,
} from "react";
// @ts-ignore
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import Theme from "../../../theme/Theme";
import StockLookupAutocomplete from "../../modules/StockLookupAutocomplete";
import Box from "../../primitives/Box";
import T from "../../primitives/Typo";
import Input from "../../primitives/Input/Input.view";
import LoadingText from "../../primitives/Loading";
import { ASYNC_STATUS } from "~/types/enums/ASYNC_STATUS";
import StockPriceDetails from "../StockPriceDetails";
import clx from "../../../../utils/Html/clx";
import Autocomplete from "../../primitives/Autocomplete";
import { HIGHLIGHT } from "~/consts/HIGHLIGHT";
import entryCss from "../StrategyCalculator/Entry/Entry.module.scss";
import { renderExpiryChoiceRow } from "../StrategyCalculator/utils/expiryChoiceRenderUtils";
import optionFinderCss from "./OptionFinder.module.scss";
import CheckboxLabel from "../../primitives/CheckboxLabel";
import Button from "../../primitives/Button";
import {
  DateTypeSelection,
  ExpectedPriceComparitor,
  OptionFinderContext,
} from "./OptionFinderContext";

const expectedPriceComparitorOptions = [
  { value: "(at close)", id: ExpectedPriceComparitor.AT_CLOSE },
  { value: "or above", id: ExpectedPriceComparitor.OR_ABOVE },
  { value: "or below", id: ExpectedPriceComparitor.OR_BELOW },
];

function Row({
  label,
  children,
  complete,
  onClick,
  noColon,
  labelBaseline,
  error,
}: {
  label: string | ReactNode;
  children: ReactNode;
  complete?: boolean;
  onClick?: () => void;
  noColon?: boolean;
  labelBaseline?: boolean;
  error?: boolean;
}) {
  const req = complete !== undefined;
  return (
    <Box
      className={[
        optionFinderCss.fieldsCtnr,
        entryCss["fields-ctnr"],
        entryCss[`--stacked`],
      ]}
      onClick={onClick}
    >
      <Box
        className={[
          entryCss["input-group"],
          entryCss["--custom-width-label"],
          optionFinderCss["--longer-label"],
          entryCss["input-row-line"],
        ]}
      >
        <T
          className={[
            entryCss["_label"],
            noColon && entryCss["--no-colon"],
            labelBaseline && entryCss["--valign-baseline"],
            error && entryCss["--color-error"],
          ]}
        >
          {label}
          {req && (
            <span
              className={
                complete ? entryCss.reqComplete : entryCss.reqIncomplete
              }
            >
              *
            </span>
          )}
        </T>
        <Box className={entryCss["_input"]}>{children}</Box>
      </Box>
    </Box>
  );
}

function Header({ children }: PropsWithChildren<{}>) {
  return (
    <>
      <Box className={entryCss._header}>
        <T h5 className={[entryCss._name, "--sec-center flex"]}>
          {children}
        </T>
      </Box>
    </>
  );
}

const OptionFinder = () => {
  const props = useContext(OptionFinderContext);

  const stockInputRef = useRef();
  const expirySelectorRef = useRef();

  const priceStatusNode =
    props.priceStatus === ASYNC_STATUS.LOADING ? (
      <Box flex-center ml={1 / 2}>
        <LoadingText />
      </Box>
    ) : (
      <StockPriceDetails
        chainAvailable={!props.prices?.options}
        prices={props.prices?.stock}
        lastRetrieved={props.prices?.retrievedTime}
        outOfDate={false}
        refreshPrices={props.onPriceRefresh}
        priceOnChange={() => {}}
      />
    );

  return (
    <Box className={optionFinderCss.optionFinderBase}>
      <Box className={entryCss["fields-set"]}>
        <Header>Underlying stock symbol</Header>
        <Row
          label={"Symbol"}
          complete={props.symbolComplete}
          error={!!props.validationErrors.symbol?.length}
          labelBaseline
        >
          <StockLookupAutocomplete
            val={props.symbolForDisplay || ""}
            onChange={props.setSymbolForDisplay}
            onSelect={props.setSymbolAndShowCompanyName}
            className={entryCss["_input"]}
            // error={props.priceError}
            autoScrollOffset={Theme.$headerHeight + 16}
            inputRef={stockInputRef}
          />
          {!!props.validationErrors.symbol?.length && (
            <T
              content-detail
              anemic
              className={optionFinderCss.error}
              mt={1 / 4}
            >
              {props.validationErrors.symbol.join("\n")}
            </T>
          )}
        </Row>
        <Row label={"Price"}>
          <Box flexSec="center" flexPri="start">
            {priceStatusNode}
          </Box>
        </Row>
      </Box>

      <Box className={entryCss["fields-set"]}>
        <Header>Expected stock movement</Header>
        <Row
          label={"Expected Price"}
          complete={props.expectedPriceComplete}
          labelBaseline
          error={!!props.validationErrors.price?.length}
        >
          <Box flexSec="center" flexPri="start">
            <Box>
              <Input
                className={optionFinderCss._expectedPrice}
                onSet={props.setExpectedPrice}
                debounce
                // inline
                prefix="$"
                prefixWidthRem={1.2}
              />
            </Box>
            <Box ml={1 / 3}>
              <Autocomplete
                className={optionFinderCss._expectedPriceComparitor}
                inputProps={{ inputClassName: optionFinderCss._input }}
                items={expectedPriceComparitorOptions}
                value={
                  expectedPriceComparitorOptions.find(
                    (i) => i.id === props.expectedPriceComparitor
                  )?.value
                }
                onChange={() => {}}
                onSelect={(v, i) => props.setExpectedPriceComparitor(i.id)}
                allowFreeEntry={false}
                getItemId={(i) => i.id}
                getItemValue={(i) => i.value}
              />
            </Box>
          </Box>
          {!!props.validationErrors.price?.length && (
            <T
              content-detail
              anemic
              className={optionFinderCss.error}
              mt={1 / 4}
            >
              {props.validationErrors.price.join("\n")}
            </T>
          )}
        </Row>
        <Row label="Date" error={!!props.validationErrors.date?.length}>
          &nbsp;
        </Row>
        <Row
          label={
            <Box pl={1 / 3}>
              <input
                type="radio"
                checked={
                  props.dateTypeSelection === DateTypeSelection.SPECIFIC_DATE
                }
              />{" "}
              Specific date:
            </Box>
          }
          onClick={props.setDateTypeSpecific}
          noColon
        >
          <Box flexSec="center" flexPri="start">
            <DatePicker
              selected={props.datePickerDate}
              onChange={props.setDatePickerDate}
              className={optionFinderCss.datePickerInput}
            />
          </Box>
        </Row>
        <Row
          label={
            <Box pl={1 / 3}>
              <input
                type="radio"
                checked={props.dateTypeSelection === DateTypeSelection.EXPIRY}
              />{" "}
              Select expiry:
            </Box>
          }
          onClick={props.setDateTypeExpiry}
          noColon
        >
          <Box flexSec="center" flexPri="start">
            <Autocomplete
              className={[entryCss._input, optionFinderCss._expirySelect]}
              items={props.expiryChoices}
              value={props.expiryDateInput || ""}
              revertValue={props.expiryDate}
              renderRow={renderExpiryChoiceRow}
              placeholder={
                props.priceStatus === ASYNC_STATUS.LOADING
                  ? "Loading..."
                  : "Expiry"
              }
              getItemValue={props.getExpiryItemValue}
              onChange={props.setExpiryDateInput}
              onSelect={(v, choice) => {
                if (choice) {
                  props.setExpiryDate(choice.dateCode);
                }
                props.setExpiryDateInput(v);
              }}
              inputRef={expirySelectorRef}
              allowFreeEntry={false}
              autoScrollOffset={Theme.$headerHeight}
              disableSelectBySpace
              inputProps={{
                inputClassName: clx([entryCss["_entry-input"]]),
                inputId: `expirySelect`,
                highlight: HIGHLIGHT.NO_HIGHLIGHT,
                spellCheck: false,
                appearDisabled:
                  props.dateTypeSelection !== DateTypeSelection.EXPIRY,
              }}
            />
          </Box>
        </Row>
        {!!props.validationErrors.date?.length && (
          <T content-detail anemic className={optionFinderCss.error} mt={1 / 4}>
            {props.validationErrors.date.join(", ")}
          </T>
        )}
      </Box>
      <Box className={entryCss["fields-set"]}>
        <Header>Budget for trade</Header>
        <Row
          label={
            <>
              Max cost/risk:
              <T content-detail-minor>Optional</T>
            </>
          }
          noColon
        >
          <Box flexSec="center" flexPri="start">
            <Input
              onSet={props.setBudget}
              debounce
              inline
              prefix="$"
              prefixWidthRem={1.2}
            />
          </Box>
        </Row>
      </Box>

      <Box className={entryCss["fields-set"]}>
        <Header>Strategies</Header>
        <T content-detail mb={1 / 2}>
          Choose which strategies to include in results
        </T>
        <CheckboxLabel
          label="Long option"
          checked={props.strategies.includes("option-purchase")}
          onClick={() => props.toggleStrategy("option-purchase")}
        />
        <CheckboxLabel
          label="Short/naked option"
          checked={props.strategies.includes("short-option")}
          onClick={() => props.toggleStrategy("short-option")}
        />
        <CheckboxLabel
          label="Credit spreads"
          checked={props.strategies.includes("credit-spread")}
          onClick={() => props.toggleStrategy("credit-spread")}
        />
        <CheckboxLabel
          label="Debit spreads"
          checked={props.strategies.includes("debit-spread")}
          onClick={() => props.toggleStrategy("debit-spread")}
        />
      </Box>
      <Box className={entryCss["fields-set"]}>
        <Button loading={props.isLoadingResults} onClick={props.submit}>
          Find options
        </Button>
      </Box>
    </Box>
  );
};

export default OptionFinder;
