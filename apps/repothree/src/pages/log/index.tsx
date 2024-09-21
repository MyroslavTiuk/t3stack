import {
  BellAlertIcon,
  BookOpenIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import { parseISO, sub } from "date-fns";
// @ts-ignore
import { AssetType } from "trackgreeks-database";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { type ParsedUrlQuery } from "querystring";
import React from "react";
import TimeRangeSelector from "~/components/atoms/TimeRangeSelector";
import Header from "~/components/layout/header/header";
import TradeList from "~/components/log/TradeList";

const Log: NextPage = () => {
  const { query } = useRouter();
  const initialStartDate = parseDateFromQuery(query, "startDate");
  const initialEndDate = parseDateFromQuery(query, "endDate");
  const [startDate, setStartDate] = React.useState<Date>(
    initialStartDate ?? sub(new Date(), { days: 7 })
  );
  const [endDate, setEndDate] = React.useState<Date>(
    initialEndDate ?? new Date()
  );

  return (
    <>
      <Header />
      <div className="flex w-full justify-center py-4">
        <div className="container flex w-full flex-col items-center gap-4 ">
          <h1 className="text-center text-xl font-bold text-neutral-700">
            Trading Log
            <BookOpenIcon className="ml-2 inline-block h-8 w-8" />
          </h1>
          <TimeRangeSelector
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            setToCustom={!!initialStartDate || !!initialEndDate}
          />
          <div className="flex w-full flex-wrap justify-around">
            <div className="w-[95%] md:w-[48%]">
              <h2 className="mb-2 flex items-center gap-2 text-3xl font-black text-neutral-700">
                <BellAlertIcon className="h-8 w-8" />
                Options
              </h2>
              <TradeList
                assetType={AssetType.Option}
                startDate={startDate}
                endDate={endDate}
              />
            </div>
            <div className="w-[95%] md:w-[48%]">
              <h2 className="mb-2 flex items-center gap-2 text-3xl font-black text-neutral-700">
                <CurrencyDollarIcon className="h-8 w-8" />
                Stocks
              </h2>
              <TradeList
                assetType={AssetType.Equity}
                startDate={startDate}
                endDate={endDate}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

function parseDateFromQuery(query: ParsedUrlQuery, key: string) {
  const date = query[key];
  if (!date || typeof date !== "string") {
    return null;
  }
  const parsedDate = parseISO(decodeURIComponent(date));
  if (isNaN(parsedDate.getTime())) {
    return null;
  }
  return parsedDate;
}

export default Log;
