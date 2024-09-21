import symbols from "./symbols.json";

export type Symbol = {
  symbol: string;
  name: string;
};

// TODO: rename type from Symbol to something else to avoid conflict with Symbol type from JS
// eslint-disable-next-line @typescript-eslint/ban-types
export function getSymbols(): Symbol[] {
  return symbols;
}
