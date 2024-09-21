import React, { useContext } from "react";

import Interface from "../../../../config/Interface";
import clx from "../../../../utils/Html/clx";
import Box from "../../primitives/Box";
import Icon from "../../primitives/Icon";
import T from "../../primitives/Typo";
import MobileMenu from "../../primitives/MobileMenu";
import ROUTE_PATHS from "../../../../consts/ROUTE_PATHS";
import Link from "../../primitives/Link/Link.view";

import {
  type MobTabs,
  type SAVE_STICKY_VISIBILITY,
  type StrategyCalculatorCalcedProps,
  type StrategyCalculatorPublicProps,
} from "./StrategyCalculator.props";
import css from "./StrategyCalculator.module.scss";
import entryCss from "./Entry/Entry.module.scss";
import stratCalcMobCss from "./StrategyCalculator.mobile.module.scss";
import SaveCalculations from "./SaveCalculations/SaveCalculations.view";
import DropdownMenu from "../../primitives/DropdownMenu";
import ToolsMenu from "./ToolsMenu/ToolsMenu";
import { NewSavedCalcsContext } from "./NewSavedCalculations/NewSavedCalculationsContext";
// import { useMediaQueryCustom } from "~/utils/Hooks/useMediaQueryCustom";

interface StratCalcMobProps {
  isOnNewStratPg: boolean;
  calcAnonComplete: boolean;
  props: StrategyCalculatorPublicProps & StrategyCalculatorCalcedProps;
  setShowSaveCalcSticky: (
    value:
      | ((prevState: SAVE_STICKY_VISIBILITY) => SAVE_STICKY_VISIBILITY)
      | SAVE_STICKY_VISIBILITY
  ) => void;
  stratDescNode: React.ReactNode;
  entryNode: React.ReactNode;
  mobSelectedTab: MobTabs;
  setMobSelectedTab: (
    value: ((prevState: MobTabs) => MobTabs) | MobTabs
  ) => void;
  calcUpdateAvailable: boolean;
  setCalcUpdateAvailable: (
    value: ((prevState: boolean) => boolean) | boolean
  ) => void;
  savedCalcsNodeMob: JSX.Element;
  // tabSwitchBtnEntryToResults: JSX.Element;
  optionsChainNode: React.ReactNode;
  // tabSwitchBtnResultsToEntry: React.ReactNode;
  showPosDetailLink: React.ReactNode;
  summaryNode: React.ReactNode;
  resultsNode: React.ReactNode;
  positionDetailNode: React.ReactNode;
  savedCalcsOpen: boolean;
  setSavedCalcsOpen: (b: boolean) => void;
  title?: string;
}

export function StratCalcMobile({
  isOnNewStratPg,
  props,
  stratDescNode,
  entryNode,
  // calcAnonComplete,
  // setShowSaveCalcSticky,
  // mobSelectedTab,
  // setMobSelectedTab,
  // calcUpdateAvailable,
  // setCalcUpdateAvailable,
  savedCalcsNodeMob,
  // tabSwitchBtnEntryToResults,
  optionsChainNode,
  // tabSwitchBtnResultsToEntry,
  showPosDetailLink,
  summaryNode,
  resultsNode,
  positionDetailNode,
  savedCalcsOpen,
  setSavedCalcsOpen,
  title,
}: StratCalcMobProps) {
  // cheat
  // const isMob = true;
  // const matches = useMediaQueryCustom("(max-width: 500px)");
  const resultsContentNode = (
    <>
      <Box flexPri="space-between" flexSec="end" mb={1 / 2}>
        {
          Interface.CALCULATOR_MOBILE_USE_CONTINUOUS_SCROLLING ? (
            <T tagName="h3" h5>
              Estimates
            </T>
          ) : null
          // tabSwitchBtnResultsToEntry
        }
        <Box className={css._openInitPosLink}>{showPosDetailLink}</Box>
      </Box>
      {!props.estimateForResults ? (
        <Box flexPri="start" className={css.resultsPlaceholder} p={3}>
          <Icon
            icon="double-arrow-line-right"
            ctnrClassName={css._arrow}
            small
          />
          <T content-hint className={[css._text, "align-center"]}>
            Complete your trade details to view estimates
          </T>
        </Box>
      ) : (
        <>
          <Box mt={1 / 2} mb={1} className={css._summary}>
            {summaryNode}
          </Box>
          {resultsNode}
          {props.showPosDetail && positionDetailNode}
        </>
      )}
      {/*<T h5 mv={1 / 3}>{stratTitle}</T>*/}
    </>
  );

  const contextSavedCalcs = useContext(NewSavedCalcsContext);

  return (
    <Box className={[css.container, css["--layout-mobile"]]} flex-col mb={4}>
      <SaveCalculations
        formCompleted={props.formCompleted}
        currentCalc={props.currentCalc}
      />
      {Interface.CALCULATOR_MOBILE_USE_CONTINUOUS_SCROLLING ? (
        <Box>
          <Box
            mt={1 / 4}
            className="mt-2 flex flex-col-reverse gap-2 lg:mt-0 lg:flex-row"
          >
            <Box
              className={[css["mobile-nav"], css["--style-simple-scroller"]]}
              style={{ float: "left" }}
              flexSec="center"
              tagName={"div"}
            >
              <Box
                p={1 / 2}
                ml={-1 / 2}
                className={[css._tab, "items-center"]}
                onClick={() => {
                  contextSavedCalcs?.setIsSidebarOpened(
                    !contextSavedCalcs?.isSidebarOpened
                  );
                }}
                flexSec="stretch"
              >
                <T tagName="span" className="flex gap-1 pr-2 text-sm">
                  <Icon icon="open" ctnrClassName={css._icon} small /> Saved
                  calculations
                </T>
              </Box>
              <Link to={ROUTE_PATHS.CALCULATOR_NEW}>
                <p className={clx([css.headerMenuItem, css._tab, "p-1-2"])}>
                  <Icon icon="new" small inline ctnrClassName={css._icon} />
                  New strategy
                </p>
              </Link>
            </Box>
            <DropdownMenu
              className={[css.viewMenu, "hidden md:block"]}
              position="bottomLeft"
            >
              <Box flexSec="center" className={[css._btn, "items-center"]}>
                <T content-detail anemic className="hide-mob w-fit">
                  View settings&nbsp;
                </T>
                <Icon icon="cog" small className={css._icon} />
              </Box>
              <Box className={css._dropdown}>
                <ToolsMenu />
              </Box>
            </DropdownMenu>
          </Box>
          <Box style={{ clear: "both" }} />
          <MobileMenu
            openButtonComponent={null}
            closeButtonComponent={null}
            isExpanded={savedCalcsOpen}
            onExpandedUpdated={setSavedCalcsOpen}
            overlayClass={stratCalcMobCss.overlay}
            menuClass={stratCalcMobCss.menuCtnr}
            direction={"left"}
          >
            <Box className={stratCalcMobCss.savedCalcsCtnr}>
              {savedCalcsNodeMob}
            </Box>
          </MobileMenu>
          <Box className={css.mobileTabs}>
            {
              <Box mt={1}>
                {title && <T h3>{title}</T>}
                {stratDescNode}
                <Box mt={1}>{entryNode}</Box>
                <Box
                  className={[entryCss.vertSeparator, entryCss["--visible"]]}
                />
              </Box>
            }
            {!isOnNewStratPg && (
              <Box
                className={[css._tab, css._resultsArea, css["--selected"]]}
                mt={2}
              >
                {resultsContentNode}
              </Box>
            )}
          </Box>
        </Box>
      ) : // <>
      //   <StratMobileMenu
      //     savedCalcsDisabled={!SHOW_SAVED_CALCS}
      //     className={css['mobile-nav']}
      //     mobSelectedTab={mobSelectedTab}
      //     onClickSavedTab={() => setMobSelectedTab(MobTabs.SAVED)}
      //     calcUpdateAvailable={calcUpdateAvailable}
      //     calculating={props.isCalculating}
      //     onClickSetupTab={() => setMobSelectedTab(MobTabs.SETUP)}
      //     onClickEstimatesTab={() => {
      //       setMobSelectedTab(MobTabs.RESULTS);
      //       setCalcUpdateAvailable(false);
      //     }}
      //   >
      //     {{
      //       after: (
      //         <Box
      //           className={css.actionButtons}
      //           flexPri="end"
      //           flexSec={'center'}
      //         >
      //           {calcAnonComplete ? (
      //             <SaveCalculations
      //               currentCalc={props.currentCalc}
      //               formCompleted={props.formCompleted}
      //               onClickSave={() =>
      //                 setShowSaveCalcSticky(SAVE_STICKY_VISIBILITY.CLOSED)
      //               }
      //             />
      //           ) : (
      //             <>
      //               {props.isCloning ? (
      //                 <span className={css._icon} style={{ height: '20px' }}>
      //                   <Spinner small />
      //                 </span>
      //               ) : (
      //                 <Icon
      //                   icon="copy"
      //                   small
      //                   inline
      //                   ctnrClassName={clx([
      //                     css._icon,
      //                     !canMakeCopy && css['--disabled'],
      //                   ])}
      //                   onClick={canMakeCopy ? props.cloneCalc : noop}
      //                 />
      //               )}
      //               <Icon
      //                 icon="share"
      //                 small
      //                 inline
      //                 ctnrClassName={clx([
      //                   css._icon,
      //                   !canShare && css['--disabled'],
      //                 ])}
      //               />
      //             </>
      //           )}
      //         </Box>
      //       ),
      //     }}
      //   </StratMobileMenu>
      //   <Box className={css.mobileTabs} pt={1 / 2}>
      //     <Box
      //       className={[
      //         css._tab,
      //         css._savedArea,
      //         mobSelectedTab === MobTabs.SAVED && css['--selected'],
      //       ]}
      //     >
      //       {savedCalcsNodeMob}
      //     </Box>
      //     <Box
      //       className={[
      //         css._tab,
      //         css._setupArea,
      //         mobSelectedTab === MobTabs.SETUP && css['--selected'],
      //       ]}
      //     >
      //       {
      //         <>
      //           {stratDescNode}
      //           {
      //             // todo: ad unit
      //           }
      //           {entryNode}
      //           {!isOnNewStratPg &&
      //             !Interface.CALCULATOR_MOBILE_USE_CONTINUOUS_SCROLLING &&
      //             tabSwitchBtnEntryToResults}
      //           {!calcAnonComplete &&
      //             props.formCompleted &&
      //             Boolean(props.estimate) && (
      //               <SaveCalculations
      //                 currentCalc={props.currentCalc}
      //                 formCompleted={props.formCompleted}
      //                 onClickSave={() =>
      //                   setShowSaveCalcSticky(SAVE_STICKY_VISIBILITY.CLOSED)
      //                 }
      //               />
      //             )}
      //         </>
      //       }
      //     </Box>
      //     <Box
      //       className={[
      //         css._tab,
      //         css._resultsArea,
      //         mobSelectedTab === MobTabs.RESULTS && css['--selected'],
      //       ]}
      //     >
      //       {resultsContentNode}
      //     </Box>
      //   </Box>
      // </>
      null}
      {props.showChainForLeg && (
        <Box className={[css.optionsChainCtnr, css["--fullscreen"]]}>
          {optionsChainNode}
        </Box>
      )}
    </Box>
  );
}
