import { type FC } from "react";
import React from "react";
import Experiment from "react-ab-test/lib/Experiment";
import Variant from "react-ab-test/lib/Variant";

import clx from "../../../../../utils/Html/clx";
// import StrategySelectorView from "../../../modules/StrategySelector/StrategySelector.view";
import Box from "../../../primitives/Box";
import T from "../../../primitives/Typo";
import TabGroup from "../../../primitives/TabGroup";
// import { useModalContext } from "../../../primitives/Modal/ModalProvider";

import css from "./QuickStartPanel.module.scss";
import { type QuickStartPanelProps } from "./QuickStartPanel.props";
import { EXPERIMENTS } from "../../../../../services/Experiments/experiments";
import OptionFinder from "../../../../components/modules/OptionFinder";
import { useOptionsFinderHasResults } from "../../../../components/modules/OptionFinder/OptionFinderContext";
import OptionFinderResults from "../../../../components/modules/OptionFinderResults";
import Title from "~/pwa/components/modules/StrategyCalculator/Title";

const QuickStartPanel: FC<QuickStartPanelProps> = (
  props: QuickStartPanelProps
): ReturnType<typeof Box> => {
  // const [ preStrategyStockCode ] = React.useState("");

  // const { showModal, hideModal } = useModalContext();
  // const openStratSelectModal = React.useCallback(() => {
  //   showModal({
  //     content: () => (
  //       <StrategySelectorView
  //         symb={preStrategyStockCode}
  //         onStratClick={hideModal}
  //       />
  //     ),
  //   });
  // }, [showModal, hideModal, preStrategyStockCode]);

  const showFinderResults = useOptionsFinderHasResults();

  return (
    <Box className={[props.className && clx(props.className), css.container]}>
      {/*<T h3 mb={1 / 2}>*/}
      {/*  Make a calculation*/}
      {/*</T>*/}
      <Title>Option Finder</Title>
      <Box className={css.tabHolder}>
        <TabGroup
          tabs={
            {
              // custom: (
              //   <>
              //     Custom
              //     <T tagName="span" className="hide-mob">
              //       &nbsp;Builder
              //     </T>
              //   </>
              // ),
            }
          }
        >
          {(curTab) => (
            <Box
              className={[css.tabContainer, "justify-center lg:justify-start"]}
            >
              {/* <Box className={[curTab !== 'stratCalc' && 'hidden']}>
                <T content>To start, select an options trading strategy...</T>
                <NewCalculationPanel
                  setShowStratSelectionFull={openStratSelectModal}
                  showStratSelectionFull={showStratSelectionFull}
                  preStrategyStockCode={preStrategyStockCode}
                  setPreStrategyStockCode={setPreStrategyStockCode}
                  showAllStrats
                  showQuick={props.showQuick}
                />
              </Box> */}
              <Box
                formatted-content
                // className={[curTab !== 'finder' && 'hidden']}
              >
                <OptionFinder />
                {showFinderResults && (
                  <Box mt={2}>
                    <OptionFinderResults />
                  </Box>
                )}
              </Box>
              <Box
                formatted-content
                className={[curTab !== "custom" && "hidden"]}
              >
                <T content>
                  You'll be able to custom-build strategies someday soon
                </T>
              </Box>
            </Box>
          )}
        </TabGroup>
      </Box>
    </Box>
  );
};

const QuickStartExpPanel: FC<QuickStartPanelProps> = (props) => {
  return (
    <Experiment name={EXPERIMENTS.POPULAR_STRAT_BUTTONS}>
      <Variant name={"quick_strats"}>
        <QuickStartPanel {...props} showQuick={true} />
      </Variant>
      <Variant name={"all_strats_only"}>
        <QuickStartPanel {...props} showQuick={false} />
      </Variant>
    </Experiment>
  );
};

export default QuickStartExpPanel;
