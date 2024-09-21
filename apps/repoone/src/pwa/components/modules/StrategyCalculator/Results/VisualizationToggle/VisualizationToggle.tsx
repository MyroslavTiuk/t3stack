import { type FC } from "react";
import React from "react";

import Box from "../../../../primitives/Box";
import ToolTip from "../../../../primitives/Tooltip";
import Icon from "../../../../primitives/Icon";
import InputLabelInline from "../../../../primitives/InputLabelInline/InputLabelInline";
import clx from "../../../../../../utils/Html/clx";

import css from "../ResultsMatrixToolbar/ResultsMatrixToolbar.module.scss";

type VisualizationToggleProps = {
  isMatrix: boolean;
  disabled: boolean;
  setIsMatrix: (value: boolean) => void;
};

const VisualizationToggle: FC<VisualizationToggleProps> = ({
  isMatrix,
  disabled,
  setIsMatrix,
}: VisualizationToggleProps): ReturnType<typeof Box> => {
  const isLineGraph = !isMatrix;
  return (
    <InputLabelInline
      label={"Chart type"}
      mobileLabel={"Chart"}
      className={[css.expiryCtnr, "mr-1-2"]}
      disabled={disabled}
    >
      <Box className={css.matrixContentToggleButton} flex>
        <ToolTip tip="Line Graph" emWidth={6.5} no-touch>
          <Icon
            icon="strategy-long-call"
            ctnrClassName={clx([
              css.iconContainer,
              isLineGraph && css["--active"],
            ])}
            className={clx([css._icon, isLineGraph && css["--active"]])}
            onClick={() => {
              setIsMatrix(false);
            }}
          />
        </ToolTip>
        <ToolTip tip="Matrix Table" hard-top-left emWidth={7.2} no-touch>
          <Icon
            icon="visualization-matrix"
            ctnrClassName={clx([
              css.iconContainer,
              !isLineGraph && css["--active"],
            ])}
            className={clx([css._icon, !isLineGraph && css["--active"]])}
            onClick={() => {
              setIsMatrix(true);
            }}
          />
        </ToolTip>
      </Box>
    </InputLabelInline>
  );
};

export default VisualizationToggle;
