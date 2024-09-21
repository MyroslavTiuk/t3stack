import { type FC } from "react";
import React from "react";

import Box from "../../primitives/Box";
import Card from "../../primitives/Card";
// import T from '../../primitives/Typo';

import { type PopupMessageProps } from "./PopupMessage.props";

import css from "./PopupMessage.module.scss";

const PopupMessageView: FC<PopupMessageProps> = (
  props: PopupMessageProps
): ReturnType<typeof Box> => {
  return !props.messages.length ? null : (
    <Box className={[css.overlay, "flex", "--center"]}>
      <Card className={css["message-box"]}>{props.messages[0]}</Card>
    </Box>
  );
};

export default PopupMessageView;
