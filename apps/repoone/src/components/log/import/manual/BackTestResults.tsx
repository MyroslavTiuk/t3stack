import { useMediaQueryCustom } from "~/utils/Hooks/useMediaQueryCustom";
import { TradesTable } from "./TradesTable";
import React from "react";
import Graph from "./Graph";
import Spinner from "~/pwa/components/primitives/Spinner";

type Props = {
  backTestCalc: any;
  isFormSubmitted: boolean;
  optionsLoading: boolean;
  equityLoading: boolean;
  optionsEquityLoading: boolean;
};

type DataItem = {
  last_profit: { amount: number };
  last_percent: number;
  total_trades: number;
  max_drawdown: { amount: number; percent: number };
  biggest_gain: { amount: number; percent: number };
};

const BackTestResults = ({
  backTestCalc,
  isFormSubmitted,
  optionsLoading,
  equityLoading,
  optionsEquityLoading,
}: Props) => {
  const matches = useMediaQueryCustom("(max-width: 768px)");

  if (optionsLoading || equityLoading || optionsEquityLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }
  if (!isFormSubmitted || !backTestCalc) {
    return;
  }
  if (backTestCalc?.data?.errorMessage) {
    return (
      <div
        className={`w-full h-full${
          matches ? "mt-4" : ""
        } rounded-lg bg-white font-semibold text-gray-800`}
      >
        <h3 className="p-3">Backtest Results</h3>
        <h1 className="m-auto p-3">
          <div
            dangerouslySetInnerHTML={{ __html: backTestCalc.data.errorMessage }}
          />
        </h1>
      </div>
    );
  } else if (
    backTestCalc?.data?.status === "success" &&
    backTestCalc?.data?.graph_items.length === 0 &&
    isFormSubmitted
  ) {
    return (
      <div
        className={`w-full h-full${
          matches ? "mt-4" : ""
        } rounded-lg bg-white font-semibold text-gray-800`}
      >
        <h3 className="p-3">Backtest Results</h3>
        <h1 className="m-auto p-3">
          <div
            dangerouslySetInnerHTML={{ __html: backTestCalc.data.list_items }}
          />
        </h1>
      </div>
    );
  }

  const datasets = backTestCalc?.data?.graph_items?.datasets || [];
  const underCharts = backTestCalc?.data?.under_charts || [];

  const graphItems = backTestCalc?.data?.graph_items || null;

  return (
    <div
      className={`w-full ${
        matches ? "mt-4" : ""
      } rounded-lg bg-white font-semibold text-gray-800`}
    >
      <h3 className="p-3">Backtest Results</h3>
      <div
        className={`m-auto w-full ${
          matches ? "max-w-[90vw]" : "max-w-[64vw]"
        } border-t border-gray-200`}
      ></div>
      <div className="p-4">
        {Object.entries(underCharts).map(([symbol, data], index) => {
          const chartData = data as DataItem;
          return (
            <div key={index}>
              <div className="mb-1 flex items-center gap-2">
                <div
                  style={{
                    backgroundColor:
                      datasets[index]?.borderColor || "transparent",
                  }}
                  className={`h-2 w-2 rounded-full`}
                ></div>
                <p>{symbol}</p>
              </div>
              <div
                className={`${
                  matches ? "flex-col" : "flex items-center justify-between"
                }`}
              >
                <div
                  key={symbol}
                  className={`${matches ? "mb-5" : ""} flex-col text-xs`}
                >
                  <p>Return</p>
                  <p className="font-medium">
                    {chartData.last_profit.amount.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                      minimumFractionDigits: 0,
                    })}{" "}
                    <span className="text-[8px]">
                      {(chartData.last_percent * 100).toFixed(2)}%
                    </span>
                  </p>
                </div>
                <div className={`${matches ? "mb-5" : ""} flex-col text-xs`}>
                  <p>Total Trades: </p>
                  <p className="font-medium">{chartData.total_trades}</p>
                </div>
                <div className={`${matches ? "mb-5" : ""} flex-col text-xs`}>
                  <p>Percent Profitable</p>
                  <p className="font-medium">
                    {(chartData.last_percent * 100).toFixed(2)}%
                  </p>
                </div>
                <div className={`${matches ? "mb-5" : ""} flex-col text-xs`}>
                  <p>Max Drawdown</p>
                  <p className="font-medium">
                    {chartData.max_drawdown.amount.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                      minimumFractionDigits: 0,
                    })}{" "}
                    <span className="text-[8px]">
                      {" "}
                      {(chartData.max_drawdown.percent * 100).toFixed(2)}%
                    </span>
                  </p>
                </div>
                <div className={`${matches ? "mb-5" : ""} flex-col text-xs`}>
                  <p>Biggest Gain</p>
                  <p className="font-medium">
                    {chartData.biggest_gain.amount.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                      minimumFractionDigits: 0,
                    })}{" "}
                    <span className="text-[8px]">
                      {" "}
                      {(chartData.biggest_gain.percent * 100).toFixed(2)}%
                    </span>
                  </p>
                </div>
              </div>
              {index ===
              backTestCalc?.data?.graph_items?.datasets.length - 1 ? null : (
                <div
                  className={`m-auto my-2 w-full ${
                    matches ? "max-w-[90vw]" : "max-w-[64vw]"
                  } border-t border-gray-200`}
                ></div>
              )}
            </div>
          );
        })}
      </div>
      <div className={`w-full ${matches ? "max-w-[90vw]" : "max-w-[64vw]"}`}>
        {graphItems && <Graph chartData={graphItems} />}
      </div>
      <TradesTable backTestCalc={backTestCalc} />
    </div>
  );
};

export default React.memo(BackTestResults);
