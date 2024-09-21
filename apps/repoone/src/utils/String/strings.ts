// todo: remove monet
import { type t } from "opc-types/lib";
import { type Map } from "immutable";

function matchAll(str: string, regex: RegExp): string[][] {
  const res: string[][] = [];
  let m;
  if (regex.global) {
    m = regex.exec(str);
    while (m) {
      res.push(m.slice(1));
      m = regex.exec(str);
    }
  } else {
    m = regex.exec(str);
    if (m) {
      res.push(m.slice(1));
    }
  }
  return res;
}

export const extractSingleValue = (
  source: string,
  search: RegExp
): t.Optional<string[]> => {
  const results: string[][] = matchAll(source, search) || [];

  return results.length === 0 ? undefined : results[0];
};

export const extractSingleValues = (
  source: string,
  searches: Map<string, RegExp>
): t.Optional<Map<string, string[]>> => {
  const results: Map<string, string[][]> = searches.map(
    (rx: RegExp): string[][] => matchAll(source, rx) || []
  );
  return results
    .filter((values: string[][]): boolean => values.length !== 1)
    .count() > 0
    ? undefined
    : results.map((strs: string[][]): string[] => strs[0]);
};

export const extractRepeatingValue = (
  source: string,
  search: RegExp
): t.Optional<string[][]> => {
  const results: string[][] = matchAll(source, search) || [];

  return results.length === 0 ? undefined : results;
};

export const extractRepeatingValues = (
  source: string,
  searches: Map<string, RegExp>
): t.Optional<Map<string, string[][]>> => {
  const results: Map<string, string[][]> = searches.map(
    (rx: RegExp): string[][] => {
      return matchAll(source, rx) || [];
    }
  );
  return results
    .filter((values: string[][]): boolean => values.length < 1)
    .count() > 0
    ? undefined
    : results;
};

export function priceToNumber(s: string): number {
  return Number(s.replace(/[^0-9.-]+/g, ""));
}

export function cleanStr(s: string): string {
  return s.replace("&nbsp;", "").trim();
}
