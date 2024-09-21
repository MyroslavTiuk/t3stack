import React, { useMemo } from "react";

import { type TickerSymbol, getSortedSymbols } from "~/data/symbols";
import Autocomplete from "../atoms/Autocomplete";

function getOptionLabel(symbol: TickerSymbol) {
  return `${symbol.symbol} - ${symbol.name}`;
}

export const SymbolAutocomplete: React.FC<Props> = ({ onChange, value }) => {
  const options = useMemo(() => {
    const sortedSymbols = getSortedSymbols();

    return sortedSymbols.map((symbol) => ({
      id: symbol.symbol,
      label: getOptionLabel(symbol),
    }));
  }, []);

  return <Autocomplete options={options} onChange={onChange} value={value} />;
};

type Props = {
  onChange: (id: string) => void;
  value: string;
};
