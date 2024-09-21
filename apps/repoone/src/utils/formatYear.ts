import type { SortingState } from "@tanstack/react-table";
import { format } from "date-fns";

export const largeNumbersFormatter = (value: number) => {
  return Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
};

export function formatYear(date: Date) {
  return format(date, "MM/dd/yyyy");
}

export function unFormatYear(date: string): Date {
  const [month, day, year] = date.split("/");
  return new Date(Number(year), Number(month) - 1, Number(day));
}

/**
 * Create a date string that is typecasted as a `Date` to use as `defaultValues` in `react-hook-form`
 * This is because `react-hook-form` doesn't support `defaultValue` of type `Date` even if the types say so,
 * see https://github.com/orgs/react-hook-form/discussions/4718
 */
export function formatDefaultDate(
  initialDate: undefined | string | Date,
  fallback: Date,
  dateFormat: string
) {
  if (typeof initialDate === "string") {
    return initialDate as unknown as Date;
  }
  return format(initialDate ?? fallback, dateFormat) as unknown as Date;
}

export function tanstackTableToPrismaSorting(sorting: SortingState) {
  return sorting.reduce(
    (acc, sort) => ({ ...acc, [sort.id]: sort.desc ? "desc" : "asc" }),
    {}
  );
}
