import React from "react";
import TimeRangeSelector from "../atoms/TimeRangeSelector";
import { sub } from "date-fns";
import OverviewCards from "./OverviewCards";

const TradeOverview: React.FC = () => {
  const [startDate, setStartDate] = React.useState<Date>(
    sub(new Date(), { days: 7 })
  );
  const [endDate, setEndDate] = React.useState<Date>(new Date());

  return (
    <div className="flex flex-col gap-3">
      <TimeRangeSelector
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
      />
      <OverviewCards startDate={startDate} endDate={endDate} />
    </div>
  );
};

export default TradeOverview;
