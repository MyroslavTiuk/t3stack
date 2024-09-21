import { pipe } from "ramda";

export const MM_TO_MMM: Record<string, string> = {
  "01": "Jan",
  "02": "Feb",
  "03": "Mar",
  "04": "Apr",
  "05": "May",
  "06": "Jun",
  "07": "Jul",
  "08": "Aug",
  "09": "Sep",
  "10": "Oct",
  "11": "Nov",
  "12": "Dec",
};

export const MMM_TO_MM: Record<string, string> = {
  Jan: "01",
  Feb: "02",
  Mar: "03",
  Apr: "04",
  May: "05",
  Jun: "06",
  Jul: "07",
  Aug: "08",
  Sep: "09",
  Oct: "10",
  Nov: "11",
  Dec: "12",
};

type ShortYearFlag = false | true | 2;
export const SHORT_YEAR_FLAG = {
  FULL: false,
  SHORT: true,
  NONE: 2 as const,
};

const stripDashes = (s: any) => s.toString().replace(/-/g, "");

export const codeToExp = (
  dateCodeRaw: string,
  shortYear: ShortYearFlag = false
) => {
  const dateCode = stripDashes(dateCodeRaw);
  if (dateCode.length !== 8) {
    console.warn("Unexpected dateCode format", dateCode);
    return "";
  }
  return `${parseInt(dateCode.substr(6, 2))} ${
    MM_TO_MMM[dateCode.substr(4, 2)] || ""
  }${
    shortYear === 2
      ? ""
      : shortYear
      ? ` '${dateCode.substr(2, 2)}`
      : ` ${dateCode.substr(0, 4)}`
  }`;
};

export const expToCode = (expDate: string) => {
  if (expDate.length < 8 || expDate.length > 11) {
    console.warn("Unexpected dateCode format", expDate);
    return "";
  }
  const YYYY = pipe(
    () => expDate.slice(-4),
    (d) => (d.includes(" ") ? d.slice(-2) : d),
    (d) => (d.length === 2 ? (parseInt(d) < 90 ? `20${d}` : `19${d}`) : d)
  )();
  const firstSpace = expDate.indexOf(" ");

  return `${YYYY}${
    MMM_TO_MM[expDate.substr(firstSpace + 1, 3)] || "--"
  }${expDate.slice(0, firstSpace).padStart(2, "0")}`;
};

export const validateDate = (input: string): string | false => {
  const validDateRegex =
    /^(?:(?:20|19)\d{2})([-/])?(0[1-9]|1[0-2])\1(0[1-9]|[12][0-9]|3[01])$/;

  if (!validDateRegex.test(input)) {
    return false;
  }

  const cleanInput = input.replace(/[^0-9]/g, "");

  const year = cleanInput.slice(0, 4);
  const month = cleanInput.slice(4, 6);
  const day = cleanInput.slice(6, 8);

  const formattedDate = `${year}-${month}-${day}`;

  const parsedDate = new Date(`${year}-${month}-${day}`);
  if (isNaN(parsedDate.getTime())) {
    return false;
  }

  return formattedDate;
};

export const dateObjectToCode = (date: Date) => {
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}${month}${day}`;
};
