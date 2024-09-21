import React, { type FC, type ReactElement } from "react";

import { type LogoProps } from "./Logo.props";
import T from "../Typo";

import css from "./Logo.module.scss";
import Box from "../Box";

const LogoView: FC<LogoProps> = (props: LogoProps): ReactElement<"div"> => {
  return (
    <Box className={[css["logo-ctnr"], "--sec-center flex"]}>
      <Box className={css["logo"]} mr={1 / 3}>
        <img src="/images/site/logo.svg" className={css.img} />
      </Box>
      <T
        tagName="h3"
        className={[
          css.text,
          props.showLogoTitleMobile && css["--show-logo-title"],
        ]}
      >
        Options
        <span className={css["text-space"]}> </span>
        Profit
        <span className={css["text-space"]}> </span>
        Calculator
      </T>
    </Box>
  );
};

export default React.memo(LogoView);
