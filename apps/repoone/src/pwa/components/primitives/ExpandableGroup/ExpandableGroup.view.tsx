import { type FC } from "react";
import React from "react";

import Box from "../Box";
import T from "../Typo";

import { type ExpandableGroupProps } from "./ExpandableGroup.props";
import useReducerLocalSetter from "../../../../utils/Hooks/useReducerLocalSetter";

import typoCss from "../../primitives/Typo/Typo.module.scss";
import css from "./ExpandableGroup.module.scss";
import DropdownToggle from "../DropdownToggle";

// todo: Use ReactSlidedown component for animation

const useLogic = (props: ExpandableGroupProps) => {
  const { state, update } = useReducerLocalSetter<Record<string, boolean>>(
    props.defaultShowing || {}
  );
  const groupKeys = React.useMemo(
    () => Object.keys(props.groups),
    [props.groups]
  );
  const collapsedGroupKeys = React.useMemo(
    () => groupKeys.filter((gKey) => !state[gKey]),
    [groupKeys, state]
  );
  const expandedGroupKeys = React.useMemo(
    () => groupKeys.filter((gKey) => state[gKey]),
    [groupKeys, state]
  );

  return {
    state,
    update,
    collapsedGroupKeys,
    expandedGroupKeys,
  };
};

const renderGroup = (
  gKey: string,
  state: boolean,
  groupContent: React.ReactNode
) => (
  <Box key={gKey}>
    <Box className={css["group-content"]}>{groupContent}</Box>
  </Box>
);

const ExpandableGroup: FC<ExpandableGroupProps> = (
  props: ExpandableGroupProps
): ReturnType<typeof Box> => {
  const { state, update, collapsedGroupKeys } = useLogic(props);

  return (
    <Box>
      <Box>
        {Object.keys(props.groups).map((gKey) => (
          <React.Fragment key={gKey}>
            {state[gKey] && (
              <Box
                className={[typoCss["content-tag"], css["show-item"]]}
                onClick={() => update(gKey, false)}
                tagName="span"
              >
                <T content-tag anemic className={css["show-label"]}>
                  –
                </T>{" "}
                {gKey}
              </Box>
            )}
            <DropdownToggle open={state[gKey] || false} key={gKey}>
              {renderGroup(gKey, state[gKey], props.groups[gKey])}
            </DropdownToggle>
          </React.Fragment>
        ))}
      </Box>
      {collapsedGroupKeys.map((gKey, index) => (
        <Box
          key={gKey}
          className={[typoCss["content-tag"], css["show-item-spacer"]]}
          tagName="span"
        >
          <Box
            onClick={() => update(gKey, true)}
            tagName="span"
            className={css["show-item"]}
          >
            {index === 0 ? <span className={css["show-label"]}>+ </span> : ""}
            {gKey}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default React.memo(ExpandableGroup);
