import { type FC, type ReactElement } from "react";
import React from "react";
import { flatten } from "ramda";

import { type Optional } from "opc-types/lib/util/Optional";
import clx from "../../../../utils/Html/clx";

import { type CardProps } from "./Card.props";

import css from "./Card.module.scss";

const CardPaddingView: FC<CardProps> = (
  props: CardProps
): ReactElement<"div"> => {
  const classes = flatten([props.className]) as Optional<string>[];

  return (
    <div className={clx([...classes, css["--default-padding"]])}>
      {props.children}
    </div>
  );
};

export default React.memo(CardPaddingView);
