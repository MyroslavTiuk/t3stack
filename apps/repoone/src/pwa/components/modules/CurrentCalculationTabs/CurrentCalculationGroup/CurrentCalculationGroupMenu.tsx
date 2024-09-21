import React from "react";

import { type StrategyOverview } from "opc-types/lib/StrategyOverview";
import { type Nullable } from "opc-types/lib/util/Nullable";

import useMediaQuery from "../../../../../utils/Hooks/useMediaQuery";
import T from "../../../primitives/Typo";
import Box from "../../../primitives/Box";
import Icon from "../../../primitives/Icon";

import css from "./CurrentCalculationGroupMenu.module.scss";
import Link from "../../../primitives/Link/Link.view";
import ROUTE_PATHS from "../../../../../consts/ROUTE_PATHS";
import clx from "../../../../../utils/Html/clx";

interface Props {
  symbolCalcs: StrategyOverview[][];
  symb: string;
  setPinned: (symb: Nullable<string>) => void;
  isPinned: boolean;
  isExpanded?: boolean;
  currentCalcId: Nullable<string>;
}

const CurrentCalculationGroupMenu = (props: Props) => {
  const isMobile = useMediaQuery("mobile-only");

  return (
    <Box className={css.calcMenu}>
      <Box
        className={[
          css._padded,
          "--col",
          "--pri-start",
          props.isExpanded && css["--full"],
        ]}
        flex
      >
        {!isMobile && (
          <Box flex className={["--sec-center", css._actions]}>
            <Box ml={1 / 2}>
              <T
                content-detail
                clickable
                onClick={() =>
                  props.setPinned(props.isExpanded ? null : props.symb)
                }
              >
                {props.isExpanded ? (
                  <Icon icon={"close"} className={css.closeIcon} small />
                ) : (
                  <>
                    Keep open
                    <Box
                      tagName={"span"}
                      className={css.openIcon}
                      inline-block
                      ml={1 / 4}
                    />
                  </>
                )}
              </T>
            </Box>
          </Box>
        )}
        <table className={css._calcs}>
          <tbody>
            {props.symbolCalcs?.map((rowCalcs, i) => (
              <tr key={i}>
                {rowCalcs.map(
                  (calc, i) =>
                    calc.id && (
                      <td key={calc.id || i}>
                        <Link
                          className={clx([
                            css._text,
                            calc.id === props.currentCalcId &&
                              css["--selected"],
                          ])}
                          to={ROUTE_PATHS.CALCULATOR}
                          payload={{ strat: calc.stratKey }}
                          query={{ id: calc.id }}
                        >
                          {calc.title}
                        </Link>
                      </td>
                    )
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
    </Box>
  );
};

export default CurrentCalculationGroupMenu;
