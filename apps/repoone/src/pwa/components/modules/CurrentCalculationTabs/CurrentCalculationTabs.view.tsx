import React, { type FC, type ReactElement } from "react";

import { isNull } from "errable";

import { type Nullable } from "opc-types/lib/util/Nullable";

import orUndef from "../../../../utils/Data/orUndef/orUndef";
import useBreakpoint from "../../../../utils/Hooks/useBreakpoint";
import { useModalContext } from "../../primitives/Modal/ModalProvider";
import Box from "../../primitives/Box";
import T from "../../primitives/Typo";
import Card from "../../primitives/Card";

import groupCalcs from "../../../../utils/Finance/groupCalcs";
import CurrentCalculationGroupMenu from "./CurrentCalculationGroup/CurrentCalculationGroupMenu";
import { type CurrentCalculationTabsProps } from "./CurrentCalculationTabs.props";
import css from "./CurrentCalculationTabs.module.scss";

const useGetNumRows = (bkpt: string) => {
  if (bkpt === "mobile") return;
  return 4;
};

const CurrentCalculationTabsView: FC<CurrentCalculationTabsProps> = (
  props: CurrentCalculationTabsProps
): ReactElement<"div"> => {
  const bkpt = useBreakpoint();
  const isMobile = bkpt === "mobile";
  const [pinnedSymb, setPinnedSymb] = React.useState<Nullable<string>>(
    props.keepOpenDefault
  );
  const [hoveredSymb, setHoveredSymb] = React.useState<Nullable<string>>(null);
  const symbToShowInBar = hoveredSymb || pinnedSymb;
  const maxNumRows = useGetNumRows(bkpt);
  const groupedCalcs = groupCalcs(props.calcs, maxNumRows);
  const menuSymbols = Object.keys(groupedCalcs);

  const calcsShownInBar = symbToShowInBar && groupedCalcs[symbToShowInBar];
  const pinnedCalculation =
    isMobile ||
    isNull(pinnedSymb) ||
    isNull(symbToShowInBar) ||
    !calcsShownInBar ? null : (
      <CurrentCalculationGroupMenu
        isExpanded
        isPinned={pinnedSymb === symbToShowInBar}
        currentCalcId={props.currentCalcId}
        symbolCalcs={calcsShownInBar}
        symb={symbToShowInBar}
        setPinned={setPinnedSymb}
      />
    );

  const { showModal } = useModalContext();

  const clickSymbolMenuItem = React.useCallback(
    (symb: string) => {
      setPinnedSymb(symb);
      const groupedCalc = groupedCalcs[symb];
      if (isMobile && groupedCalc) {
        showModal({
          // eslint-disable-next-line react/display-name
          content: () => (
            <CurrentCalculationGroupMenu
              isExpanded
              isPinned={pinnedSymb === symbToShowInBar}
              symbolCalcs={groupedCalc}
              symb={symb}
              setPinned={setPinnedSymb}
              currentCalcId={props.currentCalcId}
            />
          ),
          onCloseModal: () => {
            setPinnedSymb(null);
            setHoveredSymb(null);
          },
        });
      }
    },
    [setPinnedSymb, showModal, isMobile, groupedCalcs]
  );

  return (
    <Box className={css.container} onMouseLeave={() => setHoveredSymb(null)}>
      <Box className={[css._bar, "--sec-center"]} flex>
        <Box className={[css.portfolioLink, "--sec-center"]} flex>
          {/*<Link*/}
          {/*  to={ROUTE_PATHS.CALCULATOR_NEW}*/}
          {/*  query={orUndef(*/}
          {/*    !isNull(props.curCalcSymbol) && { code: props.curCalcSymbol },*/}
          {/*  )}*/}
          {/*>*/}
          <T anemic className={css._text}>
            Saved calcs:
          </T>
          {/*</Link>*/}
        </Box>
        <Box
          className={[css.symbolCtnr, orUndef(pinnedSymb && css["--pinned"])]}
          flex
        >
          {menuSymbols.length === 0 ? (
            <T content-pragmatic anemic className={[css._placeholder]}>
              No saved calculations
            </T>
          ) : (
            menuSymbols.map((symb) => {
              const symbolCalcs = groupedCalcs[symb];
              return (
                <Box
                  key={symb}
                  className={[
                    css._symbol,
                    pinnedSymb === symb && css["--open"],
                  ]}
                >
                  <T
                    content-pragmatic
                    className={[css._text, "align-center"]}
                    onMouseOver={() => pinnedSymb && setHoveredSymb(symb)}
                    onClick={() => clickSymbolMenuItem(symb)}
                  >
                    {symb.toUpperCase()}
                  </T>
                  {!pinnedSymb && symbolCalcs && (
                    <Card no-pad className={[css._calcMenu, css.calcMenuCtnr]}>
                      <CurrentCalculationGroupMenu
                        setPinned={setPinnedSymb}
                        isPinned={symb === pinnedSymb}
                        symb={symb}
                        symbolCalcs={symbolCalcs}
                        currentCalcId={props.currentCalcId}
                      />
                    </Card>
                  )}
                </Box>
              );
            })
          )}
        </Box>
      </Box>
      <Box
        className={[
          css._sub,
          pinnedSymb ? css.calcMenuCtnr : undefined,
          props.useSecondaryBackground && css["--secondary"],
        ]}
      >
        {pinnedCalculation}
      </Box>
    </Box>
  );
};

export default CurrentCalculationTabsView;
