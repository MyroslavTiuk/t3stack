import React, { useMemo } from "react";

import { type TickerSymbol, getSortedSymbols } from "~/data/symbols";
import AutoCompleteBacktester from "../atoms/AutoCompleteBacktester";

function getOptionLabel(symbol: TickerSymbol) {
  return `${symbol.symbol} - ${symbol.name}`;
}

export const SymbolAutocompleteBacktester: React.FC<Props> = ({
  onChange,
  value,
}) => {
  const options = useMemo(() => {
    const sortedSymbols = getSortedSymbols();

    return sortedSymbols.map((symbol) => ({
      id: symbol.symbol,
      label: getOptionLabel(symbol),
    }));
  }, []);

  return (
    <AutoCompleteBacktester
      options={options}
      onChange={onChange}
      value={value}
    />
  );
};

type Props = {
  onChange: (id: string) => void;
  value: string;
};
