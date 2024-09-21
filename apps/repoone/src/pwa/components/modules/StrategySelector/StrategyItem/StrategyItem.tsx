import { type Ref } from "react";
import React from "react";
import { type Nullable } from "opc-types/lib/util/Nullable";

import Box from "../../../primitives/Box";
import T from "../../../primitives/Typo";

import css from "./StrategyItem.module.scss";
import Icon from "../../../primitives/Icon";

type StrategyItemProps = {
  title: string;
  hoverTitle?: string;
  icon: Nullable<string>;
};

const parseTitle = (str: string) => {
  const bktPos = str.indexOf("(");
  const bkt = bktPos !== -1 ? str.substr(bktPos) : null;
  const full = bktPos !== -1 ? str.substr(0, bktPos) : str;

  return (
    <>
      <span>{full}</span>
      {bkt && <span className={css.sub}>{bkt}</span>}
    </>
  );
};

const StrategyItem = (
  props: StrategyItemProps,
  _ref: Ref<any>
): ReturnType<typeof Box> => {
  return (
    <Box flex className={["--sec-center", "cursor-pointer"]}>
      <Box className={css.iconHolder} mr={1 / 3}>
        {props.icon && (
          // @ts-ignore (icon code is dynamic *cross fingers*)
          <Icon icon={`strategy-${props.icon}`} noSize />
        )}
      </Box>
      <T
        content-pragmatic
        anemic
        title={props.hoverTitle}
        className={css.menuItem}
      >
        {parseTitle(props.title)}
      </T>
    </Box>
  );
};

export default React.forwardRef(StrategyItem);
