import React, { useState } from "react";
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
import moment from "moment";
import { DateRangePicker, isInclusivelyBeforeDay } from "react-dates";
// import '~/styles/react_dates_overrides.css'

export default function DatePicker({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}: Props) {
  const [focusedInput, setFocusedInput] = useState(null);
  const startDateMoment = moment(startDate);
  const endDateMoment = moment(endDate);

  return (
    <div
      className="App"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <DateRangePicker
        small={true}
        isOutsideRange={(day) => !isInclusivelyBeforeDay(day, moment())}
        startDate={startDateMoment}
        startDateId="your_unique_start_date_id"
        endDate={endDateMoment}
        endDateId="your_unique_end_date_id"
        onDatesChange={({ startDate, endDate }) => {
          if (!startDate || !endDate) return;
          setStartDate(startDate.toDate());
          setEndDate(endDate.toDate());
        }}
        focusedInput={focusedInput}
        // @ts-ignore
        onFocusChange={(focusedInput) => setFocusedInput(focusedInput)}
      />
    </div>
  );
}

type Props = {
  startDate: Date;
  setStartDate: React.Dispatch<React.SetStateAction<Date>>;
  endDate: Date;
  setEndDate: React.Dispatch<React.SetStateAction<Date>>;
  setToCustom?: boolean;
};
