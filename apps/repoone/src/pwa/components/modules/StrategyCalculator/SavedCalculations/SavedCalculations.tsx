import React, { type FC, useContext, useRef } from "react";
// import { not } from "ramda";
// import { type Nullable } from "errable";

import { ASYNC_STATUS } from "../../../../../types/enums/ASYNC_STATUS";
import Box from "../../../primitives/Box";
import T from "../../../primitives/Typo";
import Link from "../../../primitives/Link/Link.view";
import { useModalContext } from "../../../primitives/Modal/ModalProvider";
import { useCalculations } from "../../../../../services/UserData/CalculationsProvider";
import LoadingText from "../../../primitives/Loading/Loading.view";
import ObjectKeys from "../../../../../utils/Data/ObjectKeys/ObjectKeys";
import { getStrategyTitleParts } from "../../../../../utils/Finance/getStrategyTitle";
import ROUTE_PATHS from "../../../../../consts/ROUTE_PATHS";
import nbsp from "../../../../../utils/Html/nbsp";
import portfolioPageName from "../../../pages/Portfolio/portfolio.page-name";

import { StrategyCalculatorContext } from "../StrategyCalculator.container";
import css from "./SavedCalculations.module.scss";
import useSelectorSafe from "../../../../store/selectors/useSelectorSafe";
import clx from "../../../../../utils/Html/clx";
import selectUnderlyingLeg from "../../../../store/selectors/currentCalculation/selectUnderlyingLeg";
import { useSession } from "../../Session/SessionProvider";
import { AUTH_STATUS } from "../../Session/Session.types";
import LoginRegistrationContainer, {
  LoginRegistrationTabOptions,
} from "../../Session/LoginRegistration.container";
import Interface from "../../../../../config/Interface";
import Icon from "../../../primitives/Icon";
import { LAYOUT_OPTIONS } from "../../../../../types/enums/LAYOUT_OPTIONS";

type SavedCalculationsProps = {
  onLoadCalc?: () => void;
  disablePanelOptions?: boolean;
  highlightTabs?: boolean;
  keepOpen: boolean;
  toggleKeepOpen: () => void;
  closeButton?: React.ReactNode;
  onTitleClick?: () => void;
  isOnNewStratPg?: boolean;
  isOpen: boolean;
  showAd: boolean;
};

const SHOW_PREVIEW_TOGGLE = false;

const useSavedCalculations = () => {
  const { groupedCalculations, deleteCalculation, loadingCalculations } =
    useCalculations();
  const {
    authStatus,
    userHasRegistered,
    userData: {
      userSettings: { layout },
    },
  } = useSession();
  const isAuthed = userHasRegistered;
  const isResolvingAuth = authStatus === AUTH_STATUS.STATE_LOADING;
  const { setPreviewCalcEst } = useContext(StrategyCalculatorContext);
  const curCalcId = useSelectorSafe((s) => s.currentCalculation?.id);
  const curCalcSymb = useSelectorSafe(
    (s) => selectUnderlyingLeg(s.currentCalculation)?.val
  );
  const oldCalcSyncStatus = useSelectorSafe(
    (s) => s.userSettings.oldCalcSyncStatus
  );
  const [preview, setPreview] = [false, () => {}];
  //   React.useState(
  //   Boolean(
  //     !props.disablePanelOptions &&
  //       true /* todo: load from userData preferences */,
  //   ),
  // );
  const togglePreview = React.useCallback(() => setPreview(), [setPreview]);
  const rolloverTimeoutId = useRef<ReturnType<typeof setTimeout>>();

  const checkPreview = React.useCallback(() => {
    return;
  }, [preview, /* calcsWithEstById, */ setPreviewCalcEst, rolloverTimeoutId]);

  const clearPreviewMomentarily = React.useCallback(() => {
    if (rolloverTimeoutId.current) {
      clearTimeout(rolloverTimeoutId.current);
    }
    // note: Delays so that this clearing can be cancelled by another mouseEnter
    // todo: make this to do with some sort of event target
    rolloverTimeoutId.current = setTimeout(() => setPreviewCalcEst(null), 80);
  }, [rolloverTimeoutId]);

  React.useEffect(() => {
    return () =>
      rolloverTimeoutId.current && clearTimeout(rolloverTimeoutId.current);
  }, []);

  return {
    groupedCalculations,
    preview,
    togglePreview,
    checkPreview,
    clearPreviewMomentarily,
    curCalcId,
    curCalcSymb,
    isAuthed,
    isResolvingAuth,
    oldCalcSyncStatus,
    deleteCalculation,
    loadingCalculations,
    layout,
  };
};

const AnonNode = () => {
  const { showModal, hideModal } = useModalContext();
  const reg = React.useCallback(() => {
    showModal({
      // eslint-disable-next-line react/display-name
      content: () => (
        <LoginRegistrationContainer
          initialActiveTab={LoginRegistrationTabOptions.Register}
          onLoginSuccess={hideModal}
        />
      ),
    });
  }, [showModal, hideModal]);
  return (
    <Box pt={2}>
      <T content>
        To save calculations{" "}
        <T content clickable tagName={"span"} onClick={reg}>
          create a free account
        </T>
      </T>
    </Box>
  );
};

const SavedCalculations: FC<SavedCalculationsProps> = (
  props: SavedCalculationsProps
): ReturnType<typeof Box> => {
  const {
    groupedCalculations,
    preview,
    togglePreview,
    checkPreview,
    clearPreviewMomentarily,
    curCalcId,
    curCalcSymb,
    isAuthed,
    isResolvingAuth,
    oldCalcSyncStatus,
    deleteCalculation,
    loadingCalculations,
    layout,
  } = useSavedCalculations();
  const topSymb = React.useMemo(() => curCalcSymb, [props.isOpen]);
  const symbols = React.useMemo(
    () =>
      props.isOnNewStratPg
        ? ObjectKeys(groupedCalculations)
        : ObjectKeys(groupedCalculations).sort((a, b) =>
            a === topSymb ? -1 : b === topSymb ? 1 : 0
          ),
    [props.isOnNewStratPg, groupedCalculations, topSymb]
  );

  const onLinkClick = React.useCallback(() => {
    !props.keepOpen && props.onLoadCalc && props.onLoadCalc();
  }, [props.keepOpen, props.onLoadCalc]);
  const onDeleteCalc = React.useCallback(deleteCalculation, [
    deleteCalculation,
  ]);

  return (
    // note: flex-1 should come from parent
    <Box className={css.container} mb={1} flex-col flexPri="start">
      <Box flexSec="center" flexPri="start">
        <Box
          flexSec="center"
          flexPri="start"
          p={layout === LAYOUT_OPTIONS.SIDE_BY_SIDE ? 1 : 1 / 2}
          pl={1 / 2}
          m={layout === LAYOUT_OPTIONS.SIDE_BY_SIDE ? -1 / 2 : -1 / 2}
          onClick={props.onTitleClick}
        >
          <T h5>Saved calculations</T>
        </Box>
        <Box flex-1 flexPri="end">
          {props.closeButton || null}
        </Box>
      </Box>
      <Box className={css._inner} flex-col flexPri="space-between" flex-1>
        <Box className={css._}>
          {!props.disablePanelOptions && (
            <Box
              flexPri="end"
              flexSec="center"
              className={css.keepOpenToggle}
              mt={1 / 2}
            >
              <T content-detail tagName={"label"}>
                <input
                  type="checkbox"
                  className="styled --small"
                  checked={props.keepOpen}
                  onChange={props.toggleKeepOpen}
                />
                &nbsp;Keep&nbsp;open
              </T>
            </Box>
          )}
          {Interface.ENABLE_LOCAL_SAVED_CALCS &&
          (isResolvingAuth ||
            loadingCalculations ||
            (oldCalcSyncStatus &&
              [ASYNC_STATUS.LOADING, ASYNC_STATUS.INITIAL].includes(
                oldCalcSyncStatus
              ))) ? (
            <Box flex-center>
              {oldCalcSyncStatus == ASYNC_STATUS.LOADING ? (
                <LoadingText text="Importing your calculations" />
              ) : (
                <LoadingText />
              )}
            </Box>
          ) : !Interface.ENABLE_LOCAL_SAVED_CALCS && !isAuthed ? (
            <AnonNode />
          ) : symbols.length === 0 ? (
            <T content-hint mv={1}>
              Calculations you make will appear here
            </T>
          ) : (
            <Box className={css._symbolGroupCtnr} mt={1}>
              {symbols.map((symbol) => {
                const symbolCalcs = groupedCalculations[symbol] || [];
                return (
                  <Box key={symbol} className={css._symbolGroup} mb={1}>
                    <T h6 style={{ marginBottom: "2px" }}>
                      {symbol.toUpperCase()}
                    </T>
                    {symbolCalcs.map(([calc]) => {
                      const isSelected =
                        !props.isOnNewStratPg && curCalcId === calc.id;
                      const stratDescBits = getStrategyTitleParts(
                        calc.calculation
                      );

                      return (
                        <Box
                          mr={-1}
                          ml={-1 / 2}
                          ph={1 / 2}
                          key={calc.id || ""}
                          flexPri="space-between"
                          flexSec="center"
                          className={[
                            css._calcHolder,
                            props.highlightTabs &&
                              isSelected &&
                              css["--selected"],
                          ]}
                        >
                          <Box
                            className={css._calculation}
                            onMouseOver={() => checkPreview()}
                            onMouseOut={clearPreviewMomentarily}
                          >
                            <Link
                              to={ROUTE_PATHS.CALCULATOR}
                              payload={{ strat: calc.stratKey }}
                              query={{ id: calc.id || "" }}
                              shallow
                              scroll={false}
                            >
                              <p
                                className={clx([
                                  css._link,
                                  isSelected && css["--selected"],
                                ])}
                                onClick={onLinkClick}
                              >
                                <T
                                  content-pragmatic
                                  anemic
                                  className={css._text}
                                >
                                  <span>{stratDescBits.legs}</span>
                                  <T
                                    tagName="span"
                                    content-detail
                                    anemic
                                    className={css._stratName}
                                  >
                                    {stratDescBits.strategy}
                                  </T>
                                </T>
                              </p>
                            </Link>
                          </Box>
                          <Box
                            className={css._close}
                            p={1 / 3}
                            mr={-1 / 3}
                            onClick={() => {
                              calc.id && onDeleteCalc(calc.id);
                            }}
                          >
                            <Icon icon="close" xsmall />
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                );
              })}
            </Box>
          )}
          {isAuthed ||
            (Interface.ENABLE_LOCAL_SAVED_CALCS && (
              <>
                {Interface.ALLOW_PUBLIC_PORTFOLIO_ACCESS && (
                  <Box>
                    <Link
                      to={ROUTE_PATHS.PORTFOLIO}
                    >{`View calculation summaries in ${portfolioPageName.titleCase}`}</Link>
                  </Box>
                )}
                <Box mv={1}>
                  {SHOW_PREVIEW_TOGGLE && !props.disablePanelOptions && (
                    <Box flexPri="end" className={css.previewHoverToggle}>
                      <T content-pragmatic tagName={"label"}>
                        <input
                          type="checkbox"
                          className="styled"
                          checked={preview}
                          onChange={togglePreview}
                        />
                        {nbsp}Preview on hover
                      </T>
                    </Box>
                  )}
                </Box>
              </>
            ))}
        </Box>
      </Box>
    </Box>
  );
};

export default SavedCalculations;
