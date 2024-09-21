import React, { useMemo } from "react";

import { type TickerSymbol, getSortedSymbols } from "~/data/symbols";
import AutoCompleteNew from "../atoms/AutoCompleteNew";

function getOptionLabel(symbol: TickerSymbol) {
  return `${symbol.symbol} - ${symbol.name}`;
}

export const SymbolAutocompleteNew: React.FC<Props> = ({ onChange, value }) => {
  const options = useMemo(() => {
    const sortedSymbols = getSortedSymbols();

    return sortedSymbols.map((symbol) => ({
      id: symbol.symbol,
      label: getOptionLabel(symbol),
    }));
  }, []);

  return (
    <AutoCompleteNew options={options} onChange={onChange} value={value} />
  );
};

type Props = {
  onChange: (id: string) => void;
  value: string;
};
