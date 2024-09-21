import { type Nullable } from "opc-types/lib/util/Nullable";

const stripNonNumeric = (str: string): string => {
  return str.replace(/[^.\d]/g, "");
};

export default stripNonNumeric;

export const toRawPrice = (str: string): Nullable<number> => {
  const attempt = Number(stripNonNumeric(str));
  return isNaN(attempt) ? null : attempt;
};
