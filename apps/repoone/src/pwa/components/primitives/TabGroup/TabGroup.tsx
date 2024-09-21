import { type FC } from "react";
import React from "react";
import { type ObjRecord } from "opc-types/lib/util/ObjRecord";

import Box from "../Box";

import css from "./TabGroup.module.scss";

type TabGroupProps = {
  initTab?: string;
  tabs: ObjRecord<React.ReactNode>;
  children: (curKey: string) => React.ReactNode;
};

const TabGroup: FC<TabGroupProps> = (
  props: TabGroupProps
): ReturnType<typeof Box> => {
  const tabKeys = React.useMemo(() => Object.keys(props.tabs), [props.tabs]);
  const initTab = React.useMemo(
    () => props.initTab ?? tabKeys[0] ?? "",
    [props.initTab, tabKeys]
  );
  const [curTab, setCurTab] = React.useState(initTab);

  return (
    <>
      <Box className={[css.tabCtnr, "justify-center lg:justify-start"]}>
        {tabKeys.map((tabKey) => (
          <Box
            className={[css._tab, tabKey === curTab && css["--selected"]]}
            key={tabKey}
            onClick={() => setCurTab(tabKey)}
          >
            {props.tabs[tabKey] ?? null}
          </Box>
        ))}
      </Box>
      <Box className={css.tabBodysCtnr}>
        {props.children(curTab)}
        {/* {tabKeys.map(
          (tabKey) => (
            <Box className={css._tabBody} key={tabKey}>
              {props.tabs[tabKey] ?? null}
            </Box>
          )
        )} */}
      </Box>
    </>
  );
};

export default TabGroup;
