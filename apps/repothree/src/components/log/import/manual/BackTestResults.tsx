import { type Key } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
// @ts-ignore
import { useMediaQueryCustom } from "~/utils/Hooks/useMediaQueryCustom";

type Props = {
  isFormSubmitted: boolean;
  backTestCalc: any;
};
const BackTestResults = ({ backTestCalc, isFormSubmitted }: Props) => {
  const matches = useMediaQueryCustom("(max-width: 768px)");
  if (!isFormSubmitted || !backTestCalc) {
    return;
  }
  if (
    backTestCalc?.data?.status === "success" &&
    backTestCalc?.data?.graph_items.length === 0 &&
    isFormSubmitted
  ) {
    return (
      <div
        className={`w-full ${
          matches ? "mt-4" : ""
        } rounded-lg bg-white font-semibold text-gray-800`}
      >
        <h3 className="p-3">Backtest Results</h3>
        <h1 className="m-auto">
          <div
            dangerouslySetInnerHTML={{ __html: backTestCalc.data.list_items }}
          />
        </h1>
      </div>
    );
  }

  const datasets = backTestCalc?.data?.graph_items?.datasets || [];
  const labels = backTestCalc?.data?.graph_items?.labels || [];
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
        {datasets?.map(
          (
            dataset: {
              borderColor: any;
              label:
                | string
                | number
                | boolean
                | React.ReactElement<
                    any,
                    string | React.JSXElementConstructor<any>
                  >
                | Iterable<React.ReactNode>
                | React.ReactPortal
                | null
                | undefined;
              data: string | any[];
            },
            index: React.Key | null | undefined
          ) => (
            <div key={index}>
              <div className="mb-1 flex items-center gap-2">
                <div
                  style={{
                    backgroundColor: dataset.borderColor,
                  }}
                  className={`h-2 w-2 rounded-full`}
                ></div>
                <p>{dataset.label}</p>
              </div>
              <div
                className={`${
                  matches ? "flex-col" : "flex items-center justify-between"
                }`}
              >
                <div className={`${matches ? "mb-5" : ""} flex-col text-xs`}>
                  <p>Return</p>
                  <p className="font-medium">
                    ${dataset.data[dataset.data.length - 1]}{" "}
                    <span className="text-[8px]">
                      {dataset.data[dataset.data.length - 1]}%
                    </span>
                  </p>
                </div>
                <div className={`${matches ? "mb-5" : ""} flex-col text-xs`}>
                  <p>Total Trades</p>
                  <p className="font-medium">mocked</p>
                </div>
                <div className={`${matches ? "mb-5" : ""} flex-col text-xs`}>
                  <p>Percent Profitable</p>
                  <p className="font-medium">mocked%</p>
                </div>
                <div className={`${matches ? "mb-5" : ""} flex-col text-xs`}>
                  <p>Max Drawdown</p>
                  <p className="font-medium">
                    $mocked <span className="text-[8px]">mocked%</span>
                  </p>
                </div>
                <div className={`${matches ? "mb-5" : ""} flex-col text-xs`}>
                  <p>Biggest Gain</p>
                  <p className="font-medium">
                    $mocked <span className="text-[8px]">mocked%</span>
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
          )
        )}
      </div>
      <div className={`w-full ${matches ? "max-w-[90vw]" : "max-w-[64vw]"}`}>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            margin={{
              top: 25,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid
              strokeDasharray="0"
              horizontal={true}
              vertical={false}
            />
            <XAxis
              style={{
                fontSize: "12px",
                fontWeight: 500,
              }}
              tick={{ fill: "#221D28" }}
              axisLine={{ stroke: "transparent" }}
              tickLine={{ stroke: "transparent" }}
              dataKey="date"
              allowDuplicatedCategory={false}
            />
            <YAxis
              style={{
                fontSize: "12px",
                fontWeight: 500,
              }}
              tick={{ fill: "#221D28" }}
              tickFormatter={(tick) => `${tick} %`}
              axisLine={{ stroke: "transparent" }}
              tickLine={{ stroke: "transparent" }}
            />
            <Tooltip
              contentStyle={{
                background: "white",
                padding: "8px",
                borderRadius: "7px",
              }}
              formatter={(value, name) => [`${value}%`, name]} // Add this line
            />

            {datasets.map(
              (
                dataset: {
                  data: any[];
                  borderColor: string | undefined;
                  label: string | undefined;
                },
                index: Key | null | undefined
              ) => (
                // Render Line components here
                <Line
                  key={index}
                  type="monotone"
                  data={dataset.data.map(
                    (percent: any, i: string | number) => ({
                      date: labels[i],
                      percent,
                    })
                  )}
                  dataKey="percent"
                  stroke={dataset.borderColor}
                  strokeWidth={2}
                  name={dataset.label}
                />
              )
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BackTestResults;
