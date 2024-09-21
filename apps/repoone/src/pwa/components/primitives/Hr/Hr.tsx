import { type FC } from "react";
import React from "react";

import type Box from "../Box";

import css from "./Hr.module.scss";

type HrProps = {};

const Hr: FC<HrProps> = (): ReturnType<typeof Box> => {
  return <hr className={css.hr} />;
};

export default Hr;
