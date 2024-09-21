import React, { type FC } from "react";
import { isNull } from "errable";

import { type Nullable } from "opc-types/lib/util/Nullable";
import { type StrategyEstimate } from "opc-types/lib/StrategyEstimate";
import { type PositionPair } from "opc-types/lib/PositionPair";
import { type Strategy } from "opc-types/lib/Strategy";

import Box from "../../../primitives/Box";
import useSelectorSafe from "../../../../store/selectors/useSelectorSafe";
import selectUnderlyingLeg from "../../../../store/selectors/currentCalculation/selectUnderlyingLeg";
import formatPrice, {
  makeFormatPrice,
} from "../../../../../utils/String/formatPrice/formatPrice";
import usePartialledCallback from "../../../../../utils/Hooks/usePartialledCallback";
import { codeToExp } from "../../../../../utils/String/DateFormat/DateFormat";
import clx from "../../../../../utils/Html/clx";
import useMediaQuery from "../../../../../utils/Hooks/useMediaQuery";
import parseInt10 from "../../../../../utils/Maths/parseInt10";

import { usePositionDetailData } from "./utils/usePositionDetailData";
import { StrategyCalculatorContext } from "../StrategyCalculator.container";
import css from "./PositionDetail.module.scss";
import { useSession } from "../../Session/SessionProvider";
import T from "../../../primitives/Typo";
import { PIN_RISK } from "../../../../../types/enums/PIN_RISK";

interface PassedProps {
  estimate: Nullable<StrategyEstimate>;
}

export interface ViewProps extends PassedProps {
  onClose: () => void;
  onBackToOpen: () => void;
  strat: Nullable<Strategy>;
  highlightedPosition: Nullable<PositionPair>;
  isCalculating: boolean;
}

export const formatPriceCents = makeFormatPrice({
  hideMinus: false,
  forceShowCents: true,
});

export const disclaimerClasses = {
  [PIN_RISK.HIGH]: "text-warning bold",
  [PIN_RISK.LOW]: "text",
  [PIN_RISK.NONE]: "text",
};

const PositionDetailView: FC<ViewProps> = (
  props: ViewProps
): ReturnType<typeof Box> => {
  const { userData } = useSession();
  const isMob = useMediaQuery("mobile-only");
  const showOpen = isNull(props.highlightedPosition);
  const title =
    showOpen || isNull(props.highlightedPosition)
      ? "To open"
      : `${
          parseInt10(props.highlightedPosition.date.slice(9, 11)) % 12
        }.${props.highlightedPosition.date.slice(11, 13)}${
          parseInt10(props.highlightedPosition.date.slice(9, 11)) >= 12
            ? "pm"
            : "am"
        } ${codeToExp(
          props.highlightedPosition.date.slice(0, 8),
          true
        )} @ ${formatPrice(props.highlightedPosition.strike, {
          forceShowCents: true,
        })}`;

  const openCloseDesc = showOpen ? "open" : "close";

  const posDetailData = usePositionDetailData(props, {
    stockChangeInValue: userData.userSettings.stockChangeInValue,
  });

  const [disclaimerNote, disclaimerClass] =
    posDetailData.hasPinRisk === PIN_RISK.LOW
      ? ["*Low Pin Risk after expiry", ""]
      : posDetailData.hasPinRisk === PIN_RISK.HIGH
      ? ["*High Pin Risk after expiry", "text-warning bold"]
      : [null, ""];

  return (
    <Box
      className={[
        css.positionDetail,
        (props.isCalculating || !props.estimate) && css["--is-calculating"],
        isMob && css["--is-mobile"],
      ]}
    >
      <table className={css.table}>
        <thead>
          <tr>
            <th className={clx([css.titleHeading, "align-left"])}>{title}</th>
            <th>Qty</th>
            <th>Price</th>
            <th>
              <Box className="align-center">Total</Box>
            </th>
          </tr>
        </thead>
        <tbody>
          {!posDetailData.components.length ? (
            <>
              <tr>
                <td colSpan={4} className={clx([css.label, "align-center"])}>
                  —
                </td>
              </tr>
              {}
            </>
          ) : (
            posDetailData.components.map((pos, i) => (
              <tr key={i}>
                <td className={css.label}>{pos.desc}</td>
                <td
                  className={clx([css.label, css["--id-qty"], "align-right"])}
                >
                  {pos.num ? `${pos.num}${pos.mult ? `x${pos.mult}` : ""}` : ""}
                </td>
                <td
                  className={clx([css.label, css["--id-price"], "align-right"])}
                >
                  {pos.act === "buy" ? "-" : ""}
                  {pos.num ? pos.priceEach : ""}
                </td>
                <td
                  className={clx([css.label, css["--id-total"], "align-right"])}
                >
                  {formatPriceCents(pos.total)}
                </td>
              </tr>
            ))
          )}
          <tr className={css.rowTotal}>
            <td colSpan={3} className={clx([css.label, "align-right"])}>
              Total to {openCloseDesc}
            </td>
            <td className={clx([css.label, "align-right"])}>
              {formatPriceCents(posDetailData.total)}
            </td>
          </tr>
          {showOpen || !posDetailData.opening?.total ? null : (
            <tr>
              <td colSpan={3} className={clx([css.label, "align-right"])}>
                (
                <T
                  content-detail
                  clickable
                  hinted
                  tagName="span"
                  onClick={props.onBackToOpen}
                >
                  To open
                </T>
                )
              </td>
              <td className={clx([css.label, "align-right"])}>
                {formatPriceCents(posDetailData.opening?.total)}
              </td>
            </tr>
          )}
          {showOpen ? null : (
            <tr className={css.grandTotal}>
              <td className={clx([css.label, css["--back-link"]])} colSpan={2}>
                <T content-detail-minor anemic className={disclaimerClass}>
                  {disclaimerNote}
                </T>
              </td>
              <td className={clx([css.label, "align-right"])}>Net P/L</td>
              <td className={clx([css.label, "align-right"])}>
                {formatPriceCents(
                  (posDetailData.opening?.total || 0) + posDetailData.total
                )}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </Box>
  );
};

type ContainerProps = PassedProps;

const PositionDetail: FC<ContainerProps> = (props: ContainerProps) => {
  const strat = useSelectorSafe((s) => s.currentCalculation, null);
  const {
    highlightedPosition,
    setHighlightedPosition,
    isCalculating,
    setShowPosDetail,
  } = React.useContext(StrategyCalculatorContext);
  const onBackToOpen = React.useCallback(
    () => setHighlightedPosition(null),
    [setHighlightedPosition]
  );

  const [firstRender, setFirstRender] = React.useState(true);
  React.useEffect(() => setFirstRender(true), []);

  React.useEffect(() => {
    if (!firstRender) {
      setHighlightedPosition(null);
    }
  }, [selectUnderlyingLeg(strat)?.val]);

  const closePosDetail = usePartialledCallback(setShowPosDetail, [false]);
  return (
    <PositionDetailView
      onBackToOpen={onBackToOpen}
      isCalculating={isCalculating}
      estimate={props.estimate}
      strat={strat}
      highlightedPosition={highlightedPosition}
      onClose={closePosDetail}
    />
  );
};

export default PositionDetail;
