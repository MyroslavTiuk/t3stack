import React, { type FC, useCallback } from "react";
import { always, filter, pipe } from "ramda";

import { type StratName } from "opc-types/lib/StratName";
import { type StratMenuItem } from "opc-types/lib/StratMenuItem";
import { type StratMenu } from "opc-types/lib/StratMenu";

import ROUTE_PATHS from "../../../../consts/ROUTE_PATHS";
import getStratCatName from "../../../../model/stratCategoryNames";
import useDependentMemo from "../../../../utils/Hooks/useDependentMemo";
import useDispaction from "../../../../utils/Redux/useDispaction";
import { mapObj } from "../../../../utils/Data";
import objectEntries from "../../../../utils/Data/objectEntries/objectEntries";
import objectFromEntries from "../../../../utils/Data/objectFromEntries/objectFromEntries";
import Strategies from "../../../../model/Strategies";
import Box from "../../primitives/Box";
import Link from "../../primitives/Link";
import Input from "../../primitives/Input";
import T from "../../primitives/Typo";
import GridCols from "../../primitives/GridCols";

import { type StrategySelectorProps } from "./StrategySelector.props";
import css from "./StrategySelector.module.scss";
// todo: Lift up file to common ancestor / sibling
import entryCss from "../StrategyCalculator/Entry/Entry.module.scss";
import reducer from "./StrategySelector.reducer";
import StrategyIcons from "./StrategyIcons";
import StrategyItem from "./StrategyItem";
import { useSession } from "../Session/SessionProvider";
import userSettingsActions from "../../../store/actions/userSettings";
// import useMediaQuery from "../../../../utils/Hooks/useMediaQuery";
import { MENU_VISIBILITY } from "../../../../types/enums/MENU_VISIBILITY";
import ifUndef from "../../../../utils/Data/ifUndef/ifUndef";

const filterStratMenu = (
  groupedStratMenu: StratMenu,
  searchTerm: string
): StratMenu => {
  const lcSearchTerm = searchTerm.toLowerCase();
  return pipe(
    always(groupedStratMenu),
    mapObj<StratMenuItem[], StratMenuItem[]>((items) =>
      items.filter((item) => item.title.toLowerCase().includes(lcSearchTerm))
    ),
    objectEntries,
    filter(([_key, menuItems]) => menuItems.length > 0),
    objectFromEntries
  )();
};

const StrategySelectorView: FC<StrategySelectorProps> = (
  props: StrategySelectorProps
) => {
  const code = props.symb || "";
  // const isMob = useMediaQuery("mobile-only");

  const [settings, localDispatch] = React.useReducer(reducer, {
    searchTerm: "",
  });
  const groupedStratMenu = React.useMemo(
    () => Strategies.getStrategyMenu(),
    [
      /* todo: settings.groupBy */
    ]
  );
  const stratMenu = useDependentMemo(filterStratMenu, [
    groupedStratMenu,
    settings.searchTerm,
  ]);
  // @ts-ignore
  const updateSearch = useDispaction<string, string>(
    "SEARCH_UPDATE",
    localDispatch
  );

  const { dispactionUserSettings } = useSession();
  const updateRecentStrategies = dispactionUserSettings(
    userSettingsActions.addRecentStrategy
  );
  const onClick = useCallback(
    (val: StratName) => {
      updateRecentStrategies(val);
      if (props?.onStratClick) {
        props.onStratClick();
      }
    },
    [updateRecentStrategies, props.onStratClick]
  );

  const colNodes = Object.keys(stratMenu).map((catName: string) => (
    <Box
      key={catName}
      className={[
        "_cols-mob-12 _cols-tab-6 _cols-dsk-plus-4",
        css["strat-group-card"],
        props.splitCustom && catName === "custom" && css["--own-line"],
        props.plain && css["--plain"],
      ]}
    >
      <T h5 className={css._header}>
        {getStratCatName(catName)}
      </T>
      <Box className={css._itemHolder}>
        {stratMenu[catName].map(
          (strat) =>
            ifUndef(strat.menuVisibility, MENU_VISIBILITY.SHOW) ==
              MENU_VISIBILITY.SHOW && (
              <Box key={strat.stratKey} className={[css.stratLink, css._item]}>
                <Link
                  to={ROUTE_PATHS.CALCULATOR}
                  payload={{
                    strat: strat.stratKey,
                  }}
                  query={code ? { code } : undefined}
                >
                  <p onClick={() => onClick(strat.stratKey)}>
                    <StrategyItem
                      title={strat.titleShort || strat.title}
                      hoverTitle={strat.titleShort ? strat.title : undefined}
                      icon={StrategyIcons[strat.stratKey]}
                    />
                  </p>
                </Link>
              </Box>
            )
        )}
      </Box>
    </Box>
  ));

  return (
    <Box className={[css.container, props.plain && css["--plain"]]}>
      <Box>
        {!props.plain && (
          <Box
            className={[entryCss["fields-set"], entryCss["--no-top-margin"]]}
            mt={1}
          >
            <GridCols>
              <T
                content-fields-set-label
                className={[
                  "_cols-tab-plus-6",
                  "_cols-mob-12",
                  entryCss._header,
                  entryCss["--no-bottom-margin"],
                ]}
              >
                All strategies
              </T>
              <Box
                className={[
                  "_cols-tab-plus-6",
                  "_cols-mob-12",
                  css["search-field"],
                ]}
              >
                <Box className={css._input}>
                  <Input
                    // @ts-ignore
                    value={settings.searchTerm}
                    // @ts-ignore
                    onChange={updateSearch}
                    placeholder={"Filter strategies by name"}
                    spellCheck={false}
                    autoComplete={"off"}
                  />
                </Box>
              </Box>
            </GridCols>
          </Box>
        )}
      </Box>
      {props.plain ? (
        <div className="grid w-full grid-cols-1 lg:w-[80vh] lg:grid-cols-4 ">
          {colNodes}
        </div>
      ) : (
        <GridCols className={[css["strat-groups"]]}>{colNodes}</GridCols>
      )}
    </Box>
  );
};

export default StrategySelectorView;
