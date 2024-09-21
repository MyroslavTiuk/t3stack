import { Popover } from "@headlessui/react";
import { formatISO, sub } from "date-fns";
import React from "react";

const timeRanges = [
  { timeRange: "last 24 hours", startDate: sub(new Date(), { hours: 24 }) },
  { timeRange: "last 7 days", startDate: sub(new Date(), { days: 7 }) },
  { timeRange: "last 30 days", startDate: sub(new Date(), { days: 30 }) },
  { timeRange: "last year", startDate: sub(new Date(), { days: 365 }) },
  { timeRange: "all time", startDate: new Date(0) },
  { timeRange: "custom", startDate: new Date() },
] as const;

type TimeRange = (typeof timeRanges)[number]["timeRange"];

const TimeRangeSelector: React.FC<Props> = ({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  setToCustom,
}) => {
  const [timeRange, setTimeRange] = React.useState<TimeRange>(
    setToCustom ? "custom" : "last 7 days"
  );
  const [localCustomStartDate, setLocalCustomStartDate] =
    React.useState<Date>(startDate);
  const [localCustomEndDate, setLocalCustomEndDate] =
    React.useState<Date>(endDate);

  return (
    <>
      <div className="flex gap-5">
        {timeRanges.map((range) => {
          if (range.timeRange === "custom") {
            return (
              <Popover key="custom" as="div" className="relative">
                <Popover.Button
                  className={`font-bold text-neutral-700 underline ${
                    timeRange === range.timeRange ? "text-teal-600" : ""
                  }`}
                  onClick={() => setTimeRange(range.timeRange)}
                >
                  custom
                </Popover.Button>
                <Popover.Panel className="align-center absolute right-0 flex w-48 flex-col justify-center gap-3 rounded-md bg-neutral-50 p-4 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="flex flex-col gap-1">
                    <p>From</p>
                    <input
                      type="date"
                      className="rounded-md"
                      value={formatISO(localCustomStartDate, {
                        representation: "date",
                      })}
                      onChange={(event) => {
                        event.preventDefault();
                        event.target.valueAsDate &&
                          setLocalCustomStartDate(event.target.valueAsDate);
                      }}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <p>To</p>
                    <input
                      type="date"
                      className="rounded-md"
                      value={formatISO(localCustomEndDate, {
                        representation: "date",
                      })}
                      onChange={(event) => {
                        event.preventDefault();
                        event.target.valueAsDate &&
                          setLocalCustomEndDate(event.target.valueAsDate);
                      }}
                    />
                  </div>
                  <button
                    className="rounded-lg bg-teal-600 px-10 py-2 font-semibold text-white no-underline transition hover:bg-teal-600/70"
                    onClick={() => {
                      setStartDate(localCustomStartDate);
                      setEndDate(localCustomEndDate);
                    }}
                  >
                    Apply
                  </button>
                </Popover.Panel>
              </Popover>
            );
          }
          return (
            <button
              key={range.timeRange}
              className={`font-bold text-neutral-700 underline ${
                timeRange === range.timeRange ? "text-teal-600" : ""
              }`}
              onClick={() => {
                setTimeRange(range.timeRange);
                setStartDate(range.startDate);
                setEndDate(new Date());
              }}
            >
              {range.timeRange}
            </button>
          );
        })}
      </div>
    </>
  );
};

type Props = {
  startDate: Date;
  setStartDate: React.Dispatch<React.SetStateAction<Date>>;
  endDate: Date;
  setEndDate: React.Dispatch<React.SetStateAction<Date>>;
  setToCustom?: boolean;
};

export default TimeRangeSelector;
