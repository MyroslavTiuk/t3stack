import { type FC, type ReactElement } from "react";
import React from "react";

import MainLayout from "../../layouts/MainLayout";

import { type LearnProps } from "./Learn.props";

const LearnView: FC<LearnProps> = (_props: LearnProps): ReactElement<"div"> => {
  return (
    <MainLayout nestedCard>
      <hr />
    </MainLayout>
  );
};

export default LearnView;
