import React from "react";
import DateRangePicker from "@wojtekmaj/react-daterange-picker";
import "@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css";
import "react-calendar/dist/Calendar.css";

export function BackTesterDatePicker({ value, change }: Props) {
  const today = new Date();

  return (
    <DateRangePicker
      className="w-full max-w-[275px] rounded-lg bg-gray-50 text-xs font-normal text-[#505050] "
      maxDate={today}
      onChange={change}
      value={value}
    />
  );
}
type Props = {
  value: Date | null;
  change: (newValue: Date | null) => void;
};
