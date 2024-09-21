import React from "react";
import Story from "../../../../primitives/Story";
import Box from "../../../../primitives/Box";
import ResultsMatrix from "./ResultsMatrix.view";
import { type StrategyEstimate } from "opc-types/lib/StrategyEstimate";
import { type PositionEstimateInitial } from "opc-types/lib/PositionEstimate";
import { type StrategyEstimateSummary } from "opc-types/lib/StrategyEstimateSummary";
import { type StrategyComplete } from "opc-types/lib/Strategy";
import { testPartialStrategyLongCall } from "../../../../../../services/calculate/helpers/testPartialStrategyLongCall";
import noop from "../../../../../../utils/Functional/noop";
import { PIN_RISK } from "../../../../../../types/enums/PIN_RISK";

const genPosEst = (n: number) => ({
  gross: n,
  legs: { option: { value: n, pinRisk: PIN_RISK.NONE, expiring: false } },
});

const genStrike = (stk: number) => ({
  "2020-05-22": genPosEst(stk / 20),
  "2020-05-23": genPosEst((stk - 0.1) / 20),
  "2020-05-24": genPosEst((stk - 0.2) / 20),
  "2020-05-25": genPosEst((stk - 0.3) / 20),
  "2020-05-26": genPosEst((stk - 0.4) / 20),
  "2020-05-27": genPosEst((stk - 0.5) / 20),
  "2020-05-28": genPosEst((stk - 0.6) / 20),
  "2020-05-29": genPosEst((stk - 0.7) / 20),
  "2020-05-30": genPosEst((stk - 0.9) / 20),
  "2020-06-01": genPosEst((stk - 0.11) / 20),
  "2020-06-02": genPosEst((stk - 0.14) / 20),
  "2020-06-03": genPosEst((stk - 0.17) / 20),
});

const sampleResults: StrategyEstimate = {
  initial: {} as PositionEstimateInitial,
  theoPoints: {
    10: genStrike(10),
    11: genStrike(11),
    12: genStrike(12),
    13: genStrike(13),
    14: genStrike(14),
    15: genStrike(15),
    16: genStrike(16),
    17: genStrike(17),
    18: genStrike(18),
  },
  summary: {
    maxRisk: 80,
  } as StrategyEstimateSummary,
};

const ResultsMatrixStory = () => {
  return (
    <Box className="grid">
      <Story title="Basic - Net (default)">
        <ResultsMatrix
          showPositionDetail={() => undefined}
          isBuffering={false}
          stratEst={sampleResults}
          currentCalc={
            testPartialStrategyLongCall as unknown as StrategyComplete
          }
          setSecondaryYAxisType={noop}
        />
      </Story>
      <Story title="Buffering">
        <ResultsMatrix
          showPositionDetail={() => undefined}
          isBuffering={true}
          stratEst={sampleResults}
          currentCalc={
            testPartialStrategyLongCall as unknown as StrategyComplete
          }
          setSecondaryYAxisType={noop}
        />
      </Story>
    </Box>
  );
};

export default ResultsMatrixStory;
