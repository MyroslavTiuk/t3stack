import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

interface Props {
  value: Date | null;
  onChange: (newValue: Date | null, formattedDate: string) => void;
  buttonText?: string;
}

const CustomDatePicker: React.FC<Props> = ({ value, onChange, buttonText }) => {
  const [selectedYear, setSelectedYear] = useState<number | null>(
    value?.getFullYear() || new Date().getFullYear()
  );
  const [selectedMonth, setSelectedMonth] = useState<number | null>(
    value?.getMonth() || null
  );
  const [selectedDay, setSelectedDay] = useState<number | null>(
    value?.getDate() || null
  );
  const [calendarOpen, setCalendarOpen] = useState<boolean>(false);

  useEffect(() => {
    if (value) {
      setSelectedYear(value.getFullYear());
      setSelectedMonth(value.getMonth());
      setSelectedDay(value.getDate());
    }
  }, [value]);

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedYear = parseInt(event.target.value, 10);
    setSelectedYear(selectedYear);
    setSelectedMonth(null);
    setSelectedDay(null);
    setCalendarOpen(false);
  };

  const handleDateSelection = (date: Date) => {
    setSelectedYear(date.getFullYear());
    setSelectedMonth(date.getMonth());
    setSelectedDay(date.getDate());
    setCalendarOpen(false);

    const newFormattedDate = `${date
      .toLocaleDateString("gregory", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      })
      .replace(/ /g, "/")
      .replace(",", "")}`;

    onChange(date, newFormattedDate);
  };

  const currentYear = new Date().getFullYear();
  const startYear = 2002;
  const years = Array.from(
    { length: currentYear - startYear + 1 },
    (_, index) => currentYear - index
  );

  return (
    <div className="relative w-full max-w-[307px] bg-white">
      <div className="relative flex w-full max-w-[307px] items-center justify-between">
        <select
          value={selectedYear || ""}
          onChange={handleYearChange}
          className="focus:border-blue-500 rounded-lg border border-gray-300 px-3 py-2 text-xs font-normal focus:outline-none"
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => setCalendarOpen(!calendarOpen)}
          className="hover:bg-blue-600 w-full max-w-[150px] rounded-lg bg-black px-4 py-2 text-xs font-semibold text-white"
        >
          {buttonText}
        </button>
        <ExclamationCircleIcon className="h-6 w-6 text-gray-400" />
      </div>

      {calendarOpen && (
        <div className="absolute left-0 top-full z-50">
          <div className="rounded-lg border border-gray-300 bg-white p-4">
            <Calendar
              onChange={(date) => handleDateSelection(date as Date)}
              value={
                selectedYear !== null &&
                selectedMonth !== null &&
                selectedDay !== null
                  ? new Date(selectedYear, selectedMonth, selectedDay)
                  : new Date(
                      selectedYear || currentYear,
                      selectedMonth || 0,
                      selectedDay || 1
                    )
              }
              maxDate={new Date()}
              calendarType="gregory"
            />

            <button
              onClick={() => setCalendarOpen(false)}
              className="bg-blue-500 mt-4 rounded-lg px-4 py-2 text-black"
            >
              Close Calendar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDatePicker;
