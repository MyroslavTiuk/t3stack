import { type FC } from "react";
import React from "react";

import Box from "../Box";
import T from "../Typo";
import Icon from "../Icon";

import { type LoadingProps } from "./Loading.props";

import css from "./Loading.module.scss";

const Loading: FC<LoadingProps> = ({
  text,
}: LoadingProps): ReturnType<typeof Box> => {
  return (
    <Box className={"--col --sec-center flex"}>
      <Icon icon="loading" small className={css.icon} />
      {text && (
        <T content-hint className={css["loading-text"]}>
          {text}
        </T>
      )}
    </Box>
  );
};

export default React.memo(Loading);
