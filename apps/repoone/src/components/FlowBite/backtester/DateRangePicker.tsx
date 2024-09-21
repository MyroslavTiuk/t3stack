import React, { useEffect } from "react";
import CustomDatePicker from "./NewDatePicker"; // Adjust the import path accordingly
import { toast } from "react-toastify";
import { toastProps } from "~/styles/toast";
import { ArrowRightIcon } from "@heroicons/react/24/solid";

type Props = {
  startDate: Date | null;
  setStartDate: (date: Date | null) => void;
  endDate: Date | null;
  setEndDate: (date: Date | null) => void;
  onChange?: () => void; // Add onChange prop
};

const formatDate = (date: Date | null): string => {
  return date
    ? date
        .toLocaleDateString("gregory", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        })
        .replace(/ /g, "/")
        .replace(",", "")
    : "Not selected";
};

const CustomDateRangePicker: React.FC<Props> = ({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  onChange,
}: Props) => {
  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);
    if (onChange) {
      onChange();
    }
  };

  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date);
    if (onChange) {
      onChange();
    }
  };

  useEffect(() => {
    if (onChange) {
      onChange();
    }
  }, [startDate, endDate, onChange]);

  useEffect(() => {
    if (startDate && endDate && startDate > endDate) {
      toast.error("End date cannot be earlier than start date", toastProps);
    }
  }, [startDate, endDate]);

  return (
    <div>
      <div className="mb-4">
        <CustomDatePicker
          value={startDate}
          onChange={handleStartDateChange}
          buttonText="Select Start Date"
        />
      </div>
      <div className="mb-4">
        <CustomDatePicker
          value={endDate}
          onChange={handleEndDateChange}
          buttonText="Select End Date"
        />
      </div>
      <div className="my-1">
        <p className="mb-2 font-semibold">Date Range</p>
        <p className="flex items-center justify-center gap-4 text-xs text-gray-600">
          {formatDate(startDate)} <ArrowRightIcon className="h-4 w-4" />{" "}
          {formatDate(endDate)}
        </p>
      </div>
    </div>
  );
};

export default CustomDateRangePicker;
