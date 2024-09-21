import React, {
  type FC,
  type ReactElement,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
// import { not } from "ramda";
import Draggable from "react-draggable";
import { RESULTS_VISUALIZATION } from "../../../../types/enums/RESULTS_VISUALIZATION";
import useBreakpoint from "../../../../utils/Hooks/useBreakpoint";
import usePartialledCallback from "../../../../utils/Hooks/usePartialledCallback";
import noop from "../../../../utils/Functional/noop";
// import getStrategyTitle from "../../../../utils/Finance/getStrategyTitle";
import useToggleState from "../../../../utils/Hooks/useToggleState";
import Box from "../../primitives/Box";
import T from "../../primitives/Typo";
import Card from "../../primitives/Card/Card.view";
import HelpIcon from "../../primitives/HelpIcon";
import Spinner from "../../primitives/Spinner";
import TextDivider from "../../primitives/TextDivider";
import Icon from "../../primitives/Icon";
// import Button from "../../primitives/Button";
// import { useModalContext } from "../../primitives/Modal/ModalProvider";
import Theme from "../../../theme/Theme";
import HELP_TEXT from "../../../../consts/HELP_TEXT";
import ROUTE_PATHS from "../../../../consts/ROUTE_PATHS";
import CONTENT_PATHS from "../../../../consts/CONTENT_PATHS";
import Interface from "../../../../config/Interface";
import { useUpdateLayoutTitle } from "../../layouts/MainLayout/MainLayout.view";

import Entry from "./Entry";
import OptionsChain from "./OptionsChain";
import PositionDetail from "./PositionDetail";
import Results from "./Results/Results";
import SaveCalculations from "./SaveCalculations/SaveCalculations.view";
import {
  MobTabs,
  SAVE_STICKY_VISIBILITY,
  type StrategyCalculatorProps,
} from "./StrategyCalculator.props";
import StrategyDesc from "./StrategyDesc/StrategyDesc";
import Summary from "./Summary";
import Title from "./Title";
import css from "./StrategyCalculator.module.scss";
// import Tooltip from "../../primitives/Tooltip";
import NewCalculationPanel from "./NewCalculationPanel";
import StrategySelector from "../StrategySelector/StrategySelector.view";
import {
  StrategyCalculatorContext,
  useStrategyCalculator,
} from "./StrategyCalculator.container";
import AcceptTermsAndConditions from "../TermsAndConditions/AcceptTermsAndConditions";
import { StratCalcMobile } from "./StrategyCalculator.mobile.view";
// import { FTUX_STAGES } from "../../../../types/enums/FTUX_STAGES";
import entryCss from "./Entry/Entry.module.scss";
import ContainerDimensions from "react-container-dimensions";
import clx from "../../../../utils/Html/clx";
import ToolsMenu from "./ToolsMenu/ToolsMenu";
import DropdownMenu from "../../primitives/DropdownMenu";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { uuid } from "short-uuid";
import { NewSavedCalcsContext } from "./NewSavedCalculations/NewSavedCalculationsContext";
import { LAYOUT_OPTIONS } from "opc-types/lib/LAYOUT_OPTIONS";
import { useRouter } from "next/router";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Mousewheel, Keyboard, Navigation } from "swiper/modules";
import "swiper/css";
// import { useMediaQuery } from "react-responsive";
import arrowLeft from "~/../public/arrowLeft.svg";
import arrowRight from "~/../public/arrowRight.svg";
import Image from "next/image";
import { useDispatch } from "react-redux";
import useSelectorSafe from "~/pwa/store/selectors/useSelectorSafe";
import type { Nullable } from "../../../../../opc-types/lib/util/Nullable";
import type { Strategy } from "../../../../../opc-types/lib/Strategy";
import calcActions from "~/pwa/store/actions/calculator";
import {
  CurrentCalculationQuickView,
  CurrentCalculationState,
} from "../../../../../opc-types/lib/store/CurrentCalculationState";

export const TAB_MENU_HEIGHT = 58; // risks being out of sync
export const SHOW_STICKY_DELAY = 1500;
export const SHOW_SAVED_CALCS = true;

// const floatRight = { float: "right" as const, maxWidth: "100%" };
// const floatLeftCL = {
//   float: "left" as const,
//   clear: "left" as const,
// };
// const clearBoth = { clear: "both" as const, maxWidth: "100%" };

// const StackedEntryBox = ({ children }: { children: React.ReactNode }) => (
//   <Box className={css.stackedEntryLayout} flexPri="space-between">
//     {children}
//   </Box>
// );

const StrategyCalculatorView: FC<StrategyCalculatorProps> = (
  props: StrategyCalculatorProps
): ReactElement<"div"> => {
  const bkpt = useBreakpoint();
  const {
    preStrategyStockCode,
    setPreStrategyStockCode,
    highlightedPosition,
    showStratSelectionFull,
    showStrategySelector: ctxShowStratSelector,
    setHighlightedPosition,
    showAgreeTNClink,
    // setFtuxStage,
    // initialFtuxStage,
  } = useStrategyCalculator();
  const showStrategySelector = ctxShowStratSelector || !props.currentCalc;

  useUpdateLayoutTitle(
    showStrategySelector ? "Create calculation" : props.currentCalc?.title || ""
  );

  const showSaveSticky =
    !Interface.ENABLE_LOCAL_SAVED_CALCS && !props.userIsAuthed;

  const isMob = bkpt === "mobile";

  const { viewStacked } = props;
  const isTablet = ["tablet", "tablet-large"].includes(bkpt);
  const isTabletSml = ["tablet"].includes(bkpt);
  const isDsk = ["desktop-small", "desktop-large"].includes(bkpt);
  // const isDskLg = ["desktop-large"].includes(bkpt);
  const classicView = isTablet || viewStacked;

  const { mobSelectedTab, setMobSelectedTab } = props;
  React.useEffect(
    function scrollOnTabChange() {
      if (window?.scrollY > Theme.$headerHeight) {
        window?.scrollTo(0, Theme.$headerHeight);
      }
    },
    [mobSelectedTab]
  );
  const [calcUpdateAvailable, setCalcUpdateAvailable] = React.useState(false);
  const [localEstimate, setLocalEstimate] = React.useState(props.estimate);
  const {
    value: savedCalcsOpen,
    setValue: setSavedCalcsOpen,
    // enable: openShowSavedCalcs,
    disable: closeShowSavedCalcs,
  } = useToggleState(false);

  // const [showLayoutTooltip, setShowLayoutTooltip] = React.useState(false);

  // React.useEffect(() => {
  //   const shouldFlip = !(initialFtuxStage & FTUX_STAGES.SEEN_LAYOUT_SWITCH);
  //   if (shouldFlip && !viewStacked) {
  //     const t = setTimeout(() => {
  //       setShowLayoutTooltip(true);
  //     }, 2000);
  //     return () => clearTimeout(t);
  //   }
  // }, [!viewStacked]);

  // todo: store dismissed state as default in userData
  const [showSaveCalcSticky, setShowSaveCalcSticky] =
    React.useState<SAVE_STICKY_VISIBILITY>(
      showSaveSticky
        ? SAVE_STICKY_VISIBILITY.INITIAL_HIDDEN
        : SAVE_STICKY_VISIBILITY.CLOSED
    );
  // const showSaveCalcStickyAvailable =
  //   props.formCompleted &&
  //   showSaveCalcSticky === SAVE_STICKY_VISIBILITY.SHOWING &&
  //   !props.userIsAuthed;

  const isNewCalculationSelection = props.showStrategySelector;
  React.useEffect(
    function revertToSetupTabOnNew() {
      if (isNewCalculationSelection && mobSelectedTab !== MobTabs.SETUP) {
        setMobSelectedTab(MobTabs.SETUP);
      }
    },
    [isNewCalculationSelection]
  );
  const forceSideBarOpen = isDsk && isNewCalculationSelection;
  const showSavedCalcsSidebar = savedCalcsOpen || forceSideBarOpen;

  const calcAnonComplete = React.useMemo(
    () => !props.userIsAuthed && Boolean(props.estimate),
    [props.userIsAuthed, Boolean(props.estimate)]
  );

  useEffect(() => {
    if (props.currentCalc == null) {
      dispatch(calcActions.resetCurrentCalcsStrategies());
    }
  }, [props.currentCalc]);

  // todo: for mobile
  React.useEffect(() => {
    if (
      props.estimate &&
      showSaveSticky &&
      showSaveCalcSticky === SAVE_STICKY_VISIBILITY.INITIAL_HIDDEN
    ) {
      // setTimeout(() => {
      //   setShowSaveCalcSticky(SAVE_STICKY_VISIBILITY.SHOWING);
      // }, SHOW_STICKY_DELAY);
    }
    if (
      mobSelectedTab === MobTabs.SETUP &&
      props.estimate !== localEstimate &&
      props.estimate !== null
    ) {
      setCalcUpdateAvailable(true);
      setLocalEstimate(props.estimate);
    }
  }, [props.estimate]);

  const onDismissChainOverlay = React.useCallback(
    () => props.showChainForLeg && props.setShowChainForLeg(null),
    [props.showChainForLeg, props.setShowChainForLeg]
  );

  const title = showStrategySelector
    ? "New Calculation"
    : `${props.currentCalc?.title || ""} Calculator`;
  const titleNode = <Title mb={1 / 4}>{title}</Title>;
  const stratDescNode =
    showStrategySelector || !props.currentCalc?.metadata?.stratKey ? null : (
      <StrategyDesc stratName={props.currentCalc?.metadata?.stratKey} />
    );

  const closePosDetail = usePartialledCallback(props.setShowPosDetail, [false]);
  const positionDetailHeadingNode = (
    <T tagName="div" h5 className={css._heading} mb={1 / 4}>
      <Box flexPri="space-between">
        <Box flexSec="baseline">
          <span>
            {highlightedPosition ? "Position to close" : "Opening trade"}&nbsp;
          </span>
          <HelpIcon tip={""} clickThroughPath={ROUTE_PATHS.HELP} />
        </Box>
        <Icon
          icon="close"
          onClick={closePosDetail}
          small
          className={css._closeBtn}
        />
      </Box>
    </T>
  );
  const positionDetailNode = (
    <Box className={css.positionDetail}>
      <Card no-pad className={css._card}>
        {positionDetailHeadingNode}
        <Box className={css._inner}>
          <PositionDetail estimate={props.estimate} />
        </Box>
      </Card>
    </Box>
  );

  const currentMultiStrikes = useSelectorSafe((s) => s.multiStrike, null);
  // const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  const sliderRef = useRef(null);

  const handlePrev = useCallback(() => {
    if (!sliderRef.current) return;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    sliderRef.current.swiper.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    if (!sliderRef.current) return;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    sliderRef.current.swiper.slideNext();
  }, []);

  // const stratTitle = props.currentCalc && getStrategyTitle(props.currentCalc);
  const summaryNode =
    props.multiStrikeEstimates && props.multiStrikeEstimates.length > 1 ? (
      <div className="mt-4 flex w-full flex-col gap-4">
        <div className="w-full">
          <div className="relative flex w-full max-w-[650px] gap-5">
            <Swiper
              ref={sliderRef}
              className="my-10 w-full"
              cssMode={true}
              navigation={{
                enabled: true,
                prevEl: "prev-slide",
                nextEl: "next-slide",
              }}
              mousewheel={true}
              keyboard={true}
              modules={[Pagination, Mousewheel, Keyboard, Navigation]}
              slidesPerView={1}
              spaceBetween={10}
              centeredSlides={true}
            >
              {props.multiStrikeEstimates.map((mse, i) => (
                <SwiperSlide key={i}>
                  <div className="w-full min-w-fit">
                    <p className="font-bold uppercase text-gray-500">
                      Strike {currentMultiStrikes[i].stage}:
                    </p>
                    <Summary
                      twoCol={!(isMob || isTabletSml)}
                      stratEst={mse}
                      isCalculating={
                        props.estimateForResults !== props.estimate &&
                        props.isCalculating
                      }
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            <button
              id="prev-slide"
              onClick={handlePrev}
              className="absolute left-[-40px] z-10 cursor-pointer"
              style={{ top: "calc(50% - 20px)" }}
            >
              {/*@ts-ignore*/}
              <Image src={arrowLeft} alt="arrow-left" height={40} width={27} />
            </button>
            <button
              id="next-slide"
              onClick={handleNext}
              className="absolute right-0 z-10 cursor-pointer"
              style={{ top: "calc(50% - 20px)" }}
            >
              <Image
                // @ts-ignore
                src={arrowRight}
                alt="arrow-right"
                height={40}
                width={27}
              />
            </button>
          </div>
        </div>
      </div>
    ) : (
      <Summary
        twoCol={!(isMob || isTabletSml)}
        stratEst={props.estimateForResults}
        isCalculating={
          props.estimateForResults !== props.estimate && props.isCalculating
        }
      />
    );

  // const { showModal, hideModal } = useModalContext();
  // const openStratSelectModal = React.useCallback(() => {
  //   showModal({
  //     content: () => (
  //       <StrategySelector
  //         symb={preStrategyStockCode}
  //         onStratClick={hideModal}
  //       />
  //     ),
  //   });
  // }, [showModal, hideModal, preStrategyStockCode]);

  const entryNode =
    showStrategySelector || !props.currentCalc ? (
      <NewCalculationPanel
        setShowStratSelectionFull={noop}
        showStratSelectionFull={showStratSelectionFull}
        preStrategyStockCode={preStrategyStockCode}
        setPreStrategyStockCode={setPreStrategyStockCode}
        showAllStrats
      />
    ) : (
      <Box>
        <Entry currentCalc={props.currentCalc} />
      </Box>
    );

  const { data: dataSession, status } = useSession();

  const completionPromptHintText =
    "Complete your trade details to view estimates";
  const resultsNode = (
    <Results
      authStatus={status}
      multiStrikeEstimates={props.multiStrikeEstimates}
    />
  );
  const resultsPlaceholderNode =
    isNewCalculationSelection ? null : !showAgreeTNClink &&
      props.formCompleted ? (
      <Spinner />
    ) : showAgreeTNClink ? (
      <Card>
        <AcceptTermsAndConditions />
      </Card>
    ) : (
      <Box flexPri="start" className={css.resultsPlaceholder} p={3}>
        <Icon icon="double-arrow-line-right" ctnrClassName={css._arrow} small />
        <T content-hint className={[css._text, "align-center"]}>
          {completionPromptHintText}
        </T>
      </Box>
    );

  const dispatch = useDispatch();
  const storeCurCalc = useSelectorSafe<Nullable<Strategy>>(
    (store) => store.currentCalculation,
    null
  );

  const storeCurCalcs = useSelectorSafe<Nullable<CurrentCalculationState[]>>(
    (store) => store.currentCalculations,
    null
  );

  const storeCurCalcsStrategies = useSelectorSafe<
    Nullable<CurrentCalculationQuickView[]>
  >((store) => store.currentCalculationsStrategies, null);

  const estimatesHeadingNode = (
    <T tagName="div" h5 className={css._heading + " max-w-[700px]"} mb={1 / 4}>
      {storeCurCalcsStrategies && storeCurCalcsStrategies.length > 0 && (
        <div className="flex cursor-pointer select-none gap-2 py-4 font-normal text-gray-500">
          {storeCurCalcsStrategies?.length > 0 && (
            <p className="mr-2 font-bold">STRATEGY: </p>
          )}
          {storeCurCalcsStrategies.map((s, i) => (
            <p
              key={s.id}
              className={
                s.metadata.stratKey == storeCurCalc?.metadata.stratKey
                  ? "text-gray-900 underline"
                  : "min-w-fit"
              }
              onClick={() => {
                dispatch(calcActions.setCurrentCalc(s));
              }}
            >
              {s.type}
              {i == storeCurCalcsStrategies?.length - 1 ? "" : ","}
            </p>
          ))}
        </div>
      )}
      {storeCurCalcs && storeCurCalcs.length > 1 && (
        <div className="flex cursor-pointer select-none gap-2 py-4 font-normal text-gray-500">
          <p className="mr-2 font-bold">UNDERLYING: </p>
          {storeCurCalcs.map((s, i) => (
            <p
              key={s.id}
              className={
                // @ts-ignore
                s.legsById.underlying.val ==
                // @ts-ignore
                storeCurCalc?.legsById?.underlying?.val
                  ? "text-gray-900 underline"
                  : ""
              }
              onClick={() => {
                dispatch(calcActions.setCurrentCalc(s));
              }}
            >
              {/*@ts-ignore*/}
              {s.legsById.underlying.val.toUpperCase()}
              {i == storeCurCalcs?.length - 1 ? "" : ","}
            </p>
          ))}
        </div>
      )}
      <span>Estimates </span>
      <HelpIcon
        tip={HELP_TEXT.ESTIMATES_HEADING}
        clickThroughPath={CONTENT_PATHS.HELP_ESTIMATE_SUMMARY}
      />
    </T>
  );
  const optionsChainNode = props.showChainForLeg && (
    <OptionsChain
      close={onDismissChainOverlay}
      isDraggable={classicView && !isTablet}
    />
  );

  const stratSelectionFullNode = props.showStratSelectionFull && (
    <StrategySelector
      symb={preStrategyStockCode}
      onStratClick={() => props.setShowStratSelectionFull(false)}
    />
  );

  const openPosDetail = React.useCallback(() => {
    props.setShowPosDetail(true);
    setHighlightedPosition(null);
  }, []);
  const showPosDetailLink = React.useMemo(
    () =>
      !props.estimateForResults ? null : (
        <T
          tagName="span"
          content-tag-clickable
          clickable
          onClick={openPosDetail}
        >
          View opening trade
        </T>
      ),
    [props.setShowPosDetail, !!props.estimateForResults]
  );

  const {
    // value: keepOpen,
    setValue: setKeepOpen,
    // toggle: toggleKeepOpen,
  } = useToggleState(!isMob && classicView);
  React.useEffect(() => {
    if (isMob) {
      setKeepOpen(false);
    } else {
      setKeepOpen(classicView);
    }
    setSavedCalcsOpen(classicView && !isMob);
  }, [isMob, classicView, setSavedCalcsOpen, setKeepOpen]);

  const savedCalcsNode = (
    // <SavedCalculations
    //   onLoadCalc={closeShowSavedCalcs}
    //   disablePanelOptions={classicView}
    //   highlightTabs={classicView}
    //   keepOpen={keepOpen}
    //   toggleKeepOpen={toggleKeepOpen}
    //   isOnNewStratPg={isNewCalculationSelection}
    //   onTitleClick={closeShowSavedCalcs}
    //   isOpen={showSavedCalcsSidebar}
    //   showAd={classicView}
    // />
    <div></div>
  );
  const savedCalcsNodeMob = (
    // <SavedCalculations
    //   onLoadCalc={closeShowSavedCalcs}
    //   disablePanelOptions
    //   keepOpen={keepOpen}
    //   toggleKeepOpen={toggleKeepOpen}
    //   isOnNewStratPg={isNewCalculationSelection}
    //   onTitleClick={closeShowSavedCalcs}
    //   isOpen={showSavedCalcsSidebar}
    //   showAd={false}
    //   closeButton={
    //     <Box
    //       className={[css._closeBtn, css.clickableBackBtn]}
    //       onClick={closeShowSavedCalcs}
    //     >
    //       <Icon icon="double-h-caret" small ctnrClassName={css._iconCtnr} />
    //     </Box>
    //   }
    // />
    <div></div>
  );
  const savedCalcsPanelNode = SHOW_SAVED_CALCS && (
    <Box
      className={[
        css.savedCalcs,
        css._savedCalcs,
        showSavedCalcsSidebar && css["--open"],
        "hidden",
      ]}
    >
      <Box className={[css._panel, "hidden"]} flex-col flexPri="start">
        <Box className={css._inner} ph={1} pt={1 / 2} flex-col flexPri="start">
          {savedCalcsNode}
        </Box>
        <Box
          className={[
            css._closeBtn,
            css.clickableBackBtn,
            forceSideBarOpen && css["--disabled"],
          ]}
          onClick={closeShowSavedCalcs}
        >
          <Icon
            icon="double-h-caret"
            ctnrClassName={clx([css._iconCtnr, classicView && css["--small"]])}
          />
        </Box>
      </Box>
    </Box>
  );

  const headerMenuItemTextProps = {
    tagName: "span",
    "content-pragmatic": true,
    anemic: true,
    className: css.headerMenuItem,
    ph: 1 / 2,
    mr: 1 / 4,
  };
  // const canMakeCopy = Boolean(
  //   !showStrategySelector && props.formCompleted && props.currentCalc?.id
  // );

  // const canShare = canMakeCopy;

  // const [calcSettingsMenuOpen, setCalcSettingsMenuOpen] = React.useState(false);
  // const closeCalcSettingsMenu = usePartialledCallback(setCalcSettingsMenuOpen, [
  //   false,
  // ]);

  // const toggleCalcSettingsMenu = React.useCallback(
  //   () => setCalcSettingsMenuOpen(not),
  //   [setCalcSettingsMenuOpen]
  // );

  // const acknowledgeLayoutTip = React.useCallback(() => {
  //   setFtuxStage(FTUX_STAGES.SEEN_LAYOUT_SWITCH);
  //   // setShowLayoutTooltip(false);
  // }, [setFtuxStage]);
  // const clickSwitchLayout = React.useCallback(() => {
  //   acknowledgeLayoutTip();
  //   toggleViewStacked();
  // }, [acknowledgeLayoutTip, toggleViewStacked]);
  const calcSettingsMenu = (
    <>
      {!isNewCalculationSelection && (
        <>
          {/*{viewStacked && (*/}
          {/*  <Box mr={1 / 3} className={css.newTag}>*/}
          {/*    New*/}
          {/*  </Box>*/}
          {/*)}*/}
          {/*<Button outline small onClick={clickSwitchLayout}>*/}
          {/*  {viewStacked ? <>Try Beta Layout</> : 'Back to Classic View'}*/}
          {/*</Button>*/}
          {/* <T content-pragmatic pr={1 / 3} clickable subtle> */}
          {/* </ButtonT> */}
          {/* <SwitchToggle */}
          {/*  state={!viewStacked} */}
          {/*  onChange={() => setShowLayoutTooltip(false)} */}
          {/* /> */}
        </>
      )}
      <DropdownMenu className={css.viewMenu} position="bottomLeft">
        <Box flexSec="center" className={css._btn}>
          <Icon icon="cog" small colorHalfLink className={css._icon} />
          View settings&nbsp;
        </Box>
        <Box className={css._dropdown}>
          <ToolsMenu />
        </Box>
      </DropdownMenu>
    </>
  );

  const [isCloning, setIsCloning] = useState<boolean>(false);
  // const [isUpdatingCalc, setIsUpdatingCalc] = useState<boolean>(false);

  const { currentCalcForResults: currentCalc } = React.useContext(
    StrategyCalculatorContext
  );

  const updateCalculation = api.calculations.updateCalculations.useMutation();

  const contextSavedCalcs = useContext(NewSavedCalcsContext);

  const saveCalculation = async () => {
    try {
      if (status === "authenticated" && dataSession?.user && currentCalc) {
        setIsCloning(true);
        if (currentCalc.id === null) {
          currentCalc.id = uuid();
        }
        await updateCalculation.mutateAsync({
          calculations: currentCalc,
        });
        if (contextSavedCalcs !== undefined) {
          contextSavedCalcs.setIsRefetch(true);
        }
        setIsCloning(false);
      }
    } catch (e) {
      setIsCloning(false);
    }
  };

  // const updateCurrentCalculation = async () => {
  //   try {
  //     if (status === "authenticated" && dataSession?.user && currentCalc) {
  //       setIsUpdatingCalc(true);
  //       if (currentCalc.id) {
  //         await updateCalculation.mutateAsync({
  //           calculations: currentCalc,
  //         });
  //       }
  //       if (contextSavedCalcs !== undefined) {
  //         contextSavedCalcs?.setDisableFocus(false);
  //         contextSavedCalcs.setIsRefetch(true);
  //       }
  //       setIsUpdatingCalc(false);
  //     }
  //   } catch (e) {
  //     setIsUpdatingCalc(false);
  //   }
  // };

  // const canSave = (): boolean => {
  //   if (!currentCalc || !currentCalc.id) {
  //     return false;
  //   }
  //   return true;
  // };

  const headerToolbarNode = (
    <Box
      className={[
        css.header,
        !viewStacked && css["--bottomBorder"],
        css._header,
        showSavedCalcsSidebar && css["--open"],
        "flex items-center justify-between gap-10 px-4 transition-all ease-in-out",
        `${
          contextSavedCalcs?.calculatorUserViewSettings.screenLayout ===
            LAYOUT_OPTIONS.SIDE_BY_SIDE && contextSavedCalcs?.isSidebarOpened
            ? "!pl-[500px]"
            : ""
        }`,
      ]}
      flex
      flexSec="center"
      pr={1}
    >
      <div className="flex gap-8">
        {!contextSavedCalcs?.isSidebarOpened && (
          <>
            <T
              {...headerMenuItemTextProps}
              className={[css.headerMenuItem]}
              onClick={() => {
                contextSavedCalcs?.setIsSidebarOpened(
                  !contextSavedCalcs?.isSidebarOpened
                );
              }}
            >
              <Icon icon="open" ctnrClassName={css._icon} small /> Saved
              calculations
              {/* <T tagName="span" className={css._iconSavedCalc} ml={1 / 4}>
              {{showSavedCalcs ? <>&laquo;</> : <>&raquo;</>}}
            </T> */}
            </T>
            <Box ph={1 / 3} mh={1 / 4}>
              <TextDivider vertical no-pad />
            </Box>
          </>
        )}
        <T
          {...headerMenuItemTextProps}
          onClick={() => {
            //props.newCalc();
            //contextSavedCalcs?.setDisableFocus(true);
            //(!classicView || !keepOpen) && closeShowSavedCalcs();
            routerQ.push("/calculator");
          }}
        >
          <Icon icon="new" small inline ctnrClassName={css._icon} />
          New strategy
        </T>
        <T
          {...headerMenuItemTextProps}
          className={[
            headerMenuItemTextProps.className,
            !props.estimateForResults && css["--disabled"],
          ]}
          onClick={props.estimateForResults ? saveCalculation : noop}
        >
          {isCloning ? (
            <span className={css._icon} style={{ height: "20px" }}>
              <Spinner small />
            </span>
          ) : (
            <Icon icon="copy" small inline ctnrClassName={css._icon} />
          )}
          Make a copy
        </T>
      </div>
      <Box>
        <SaveCalculations
          formCompleted={props.formCompleted}
          currentCalc={props.currentCalc}
        />
        {calcSettingsMenu}
      </Box>
    </Box>
  );

  // const tipContentNode = (
  //   <Box flexPri="space-between" flexSec="center">
  //     <T content-pragmatic mr={1 / 3}>
  //       {viewStacked ? (
  //         <>
  //           You can try out the new
  //           <br />
  //           layout at any time
  //         </>
  //       ) : (
  //         <>
  //           You can switch to back to
  //           <br />
  //           classic view at any time
  //         </>
  //       )}
  //     </T>
  //     <Button onClick={acknowledgeLayoutTip} text="Ok" secondary />
  //     {/* <Icon */}
  //     {/*  inline */}
  //     {/*  className={css.closeIcon} */}
  //     {/*  icon={'close'} */}
  //     {/*  noSize */}
  //     {/*  onClick={acknowledgeLayoutTip} */}
  //     {/* /> */}
  //   </Box>
  // );
  // const toggleLayoutTooltip = (
  //   <Box className={css.saveSticky}>
  //     <Tooltip
  //       tip={tipContentNode}
  //       strong
  //       showing
  //       hard-bottom-left
  //       className={css._tooltip}
  //     >
  //       <Box className={css.sticky} />
  //     </Tooltip>
  //   </Box>
  // );

  // const [showAdBesideGraph, setShowAdBesideGraph] = React.useState(true);
  const [graphWidth] = React.useState(0);
  const [adWidth] = React.useState(0);

  const routerQ = useRouter();

  // todo: measure visCtnr and feed into the adPlacement for CALC_RIGHT_SKYSCRAPER spot (if width allows bigger ad)
  if (["mobile"].includes(bkpt)) {
    return (
      <StratCalcMobile
        isOnNewStratPg={isNewCalculationSelection}
        calcAnonComplete={calcAnonComplete}
        props={props}
        setShowSaveCalcSticky={setShowSaveCalcSticky}
        stratDescNode={stratDescNode}
        entryNode={entryNode}
        mobSelectedTab={mobSelectedTab}
        setMobSelectedTab={setMobSelectedTab}
        calcUpdateAvailable={calcUpdateAvailable}
        setCalcUpdateAvailable={setCalcUpdateAvailable}
        savedCalcsNodeMob={savedCalcsNodeMob}
        optionsChainNode={optionsChainNode}
        showPosDetailLink={showPosDetailLink}
        summaryNode={summaryNode}
        resultsNode={resultsNode}
        positionDetailNode={positionDetailNode}
        savedCalcsOpen={savedCalcsOpen}
        setSavedCalcsOpen={setSavedCalcsOpen}
        title={title}
      />
    );
  }

  if (classicView || (isDsk && isNewCalculationSelection) /** I.e. Tablet **/) {
    const estimatesTitleAndSummaryNode = (
      <Box inline-block mt={1}>
        {showPosDetailLink}
        <Box
          flexPri="space-between"
          className={["flex-col lg:flex-row"]}
          flexSec="baseline"
        >
          {estimatesHeadingNode}
        </Box>
        {showAgreeTNClink ? (
          <Box mv={2}>
            <AcceptTermsAndConditions />
          </Box>
        ) : !props.estimateForResults ? (
          <Box mt={1}>{resultsPlaceholderNode}</Box>
        ) : (
          // <T content-hint mt={1 / 2} mb={1 / 3}>
          //   {completionPromptHintText}
          // </T>
          <Box mb={1}>{summaryNode}</Box>
        )}
      </Box>
    );

    const tabletResultsNode = (
      <Box style={{ display: "inline-block", maxWidth: "100%" }}>
        <>
          <Box className={[css._item, css["--id-estimates"]]}>
            {!isNewCalculationSelection && (
              <>
                <Box
                  className={[entryCss.vertSeparator, entryCss["--visible"]]}
                />
                <Box>{estimatesTitleAndSummaryNode}</Box>
              </>
            )}
          </Box>
          <Box ml={-1}>{props.estimateForResults && resultsNode}</Box>
        </>
      </Box>
    );

    return (
      <Box
        className={[
          "w-full",
          css.container,
          css["--layout-stacked"],
          !classicView && css["--layout-stacked--new-calc"],
        ]}
        style={{ position: "relative" }}
        flex
      >
        {props.showPosDetail && !isNewCalculationSelection && (
          <Draggable>{positionDetailNode}</Draggable>
        )}
        {props.showChainForLeg &&
          (isTablet ? (
            <Box
              className={[css.optionsChainCtnr, css["--layout-stacked"]]}
              ///////////////// pop-up of the call option or other legs
            >
              {optionsChainNode}
            </Box>
          ) : (
            <Draggable>
              <Box className={[css.optionsChainCtnr, css["--layout-stacked"]]}>
                {optionsChainNode}
              </Box>
            </Draggable>
          ))}
        {/* showSaveCalcStickyAvailable && saveCalcStickyNode */}
        {savedCalcsPanelNode}
        <Box
          className={[css._content, "!ml-0 !w-full pt-5 lg:pt-0"]}
          mt={1 / 3}
          flex-1
        >
          <ContainerDimensions>
            {({ width: contentWidth }) => {
              const pad = 9 + 16 + 24;
              const showAdBesideGraph =
                contentWidth - graphWidth > adWidth + pad;
              return (
                <Box className={css._}>
                  <Box className={css._headerToolbar}>{headerToolbarNode}</Box>
                  <Box className={css._adScrollCtnr}>
                    <Box
                      mr={1}
                      mb={1}
                      className={[
                        css._ad,
                        css["--id-right-skyscraper"],
                        isNewCalculationSelection && "hide-dsk-sml-down",
                        "hidden",
                      ]}
                    ></Box>
                    <div
                      className={`${
                        contextSavedCalcs &&
                        contextSavedCalcs.calculatorUserViewSettings
                          .screenLayout === LAYOUT_OPTIONS.SIDE_BY_SIDE &&
                        "grid w-full grid-cols-2"
                      }`}
                    >
                      <Box flex-1 className={css._calculation}>
                        <Box className={css._card}>
                          <Box
                            className={[
                              css._item,
                              !isNewCalculationSelection &&
                                css["--id-entry-form"],
                            ]}
                            mr={1 / 2}
                          >
                            <Box className={css.__entryForm} mb={1}>
                              <>
                                {titleNode}
                                <Box className={css._stratDescCtnr}>
                                  {stratDescNode}
                                </Box>
                                <Box mt={2} mb={1}>
                                  <Box className={css._entry}>{entryNode}</Box>
                                </Box>
                              </>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                      {showAdBesideGraph && tabletResultsNode}
                    </div>
                  </Box>
                  {!showAdBesideGraph && tabletResultsNode}
                </Box>
              );
            }}
          </ContainerDimensions>
        </Box>
      </Box>
    );
  }
  if (isDsk) {
    return (
      <Box className={[css.container, css["--layout-desktop"]]}>
        {savedCalcsPanelNode}
        {headerToolbarNode}
        <Box flexPri="stretch" flexSec="stretch">
          <Box className={css.entrySideBar}>
            <Box ph={1} pt={2}>
              {titleNode}
              {stratDescNode}
              <Box mt={2}>{entryNode}</Box>
            </Box>
          </Box>
          {props.showChainForLeg && (
            <Box
              className={[css.optionsChainCtnr, css["--layout-side-by-side"]]}
            >
              <Box inline-block className={css._inner}>
                {optionsChainNode}
              </Box>
            </Box>
          )}
          <Box
            className={[
              css.results,
              !!props.showChainForLeg && css["--chain-open"],
            ]}
            pl={2}
            pr={1}
            pb={2}
            flex-col
          >
            {/* showLayoutTooltip && toggleLayoutTooltip */}
            {
              <Box className={css._inner} pt={1} flex-1>
                {props.showStratSelectionFull &&
                (showStrategySelector || !props.currentCalc) ? (
                  <Card className={[css._stratSelectionFull]}>
                    {stratSelectionFullNode}
                  </Card>
                ) : (
                  props.estimateForResults && (
                    <Card no-pad className={css._summary}>
                      <Box
                        flexPri="space-between"
                        flexSec="baseline"
                        mb={1 / 4}
                      >
                        {estimatesHeadingNode}
                        {showPosDetailLink}
                      </Box>
                      <p>UNDERLYINGS: </p>
                      {summaryNode}
                    </Card>
                  )
                )}

                {!(
                  props.showStratSelectionFull &&
                  (showStrategySelector || !props.currentCalc)
                ) && !props.estimateForResults ? (
                  <Box className={css.resultsPlaceholderFs}>
                    <Box flex-center flex-col className={css._inner}>
                      {resultsPlaceholderNode}
                    </Box>
                  </Box>
                ) : (
                  <Box
                    className={[
                      css._visCtnr,
                      props.resultsVisualization ===
                        RESULTS_VISUALIZATION.MATRIX && css["--is-floated"],
                    ]}
                  >
                    <Card no-pad className={css._inner}>
                      {resultsNode}
                    </Card>
                  </Box>
                )}
                {props.showPosDetail && !isNewCalculationSelection && (
                  <Draggable>{positionDetailNode}</Draggable>
                )}
                <Box style={{ clear: "both" }}></Box>
              </Box>
            }
          </Box>
        </Box>
      </Box>
    );
  }
  return <div />;
};

export default StrategyCalculatorView;
