import React, { useMemo } from "react";

import { type TickerSymbol, getSymbols } from "~/data/symbols";
import Autocomplete from "../atoms/Autocomplete";

function getOptionLabel(symbol: TickerSymbol) {
  return `${symbol.symbol} - ${symbol.name}`;
}

export const SymbolAutocomplete: React.FC<Props> = ({ onChange }) => {
  const options = useMemo(() => {
    const symbols = getSymbols();
    return symbols.map((symbol) => ({
      id: symbol.symbol,
      label: getOptionLabel(symbol),
    }));
  }, []);

  return <Autocomplete options={options} onChange={onChange} />;
};

type Props = {
  onChange: (id: string) => void;
};
