import symbols from "./symbols.json";

export type TickerSymbol = {
  symbol: string;
  name: string;
  priority?: number | undefined;
};

export function getSymbols(): TickerSymbol[] {
  return symbols;
}

export function getSortedSymbols() {
  return symbols.toSorted((a: TickerSymbol, b: TickerSymbol): number => {
    if (a.priority && b.priority) {
      return a.priority > b.priority ? -1 : 1;
    }
    if (!a.priority && b.priority) {
      return 1;
    }
    if (!b.priority && a.priority) {
      return -1;
    }
    return 0;
  });
}
