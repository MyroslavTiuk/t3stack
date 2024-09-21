import React, { useMemo } from "react";
import { Autocomplete, type AutocompleteOption } from "@atoms/Autocomplete";
import { getSymbols } from "@data/symbols";

export const SymbolAutocomplete: React.FC<Props> = ({ onChange }) => {
  const getOptionLabel = (stock: AutocompleteOption) =>
    `${stock.label} (${stock.id})`;

  const options = useMemo(() => {
    const symbols = getSymbols();
    return symbols.map((symbol) => ({
      id: symbol.symbol,
      label: symbol.name,
    }));
  }, []);

  return (
    <Autocomplete
      onChange={onChange}
      options={options}
      getOptionLabel={getOptionLabel}
      dataCy="stock-autocomplete-input"
      label="Select Underlying Stock Symbol..."
    />
  );
};

type Props = {
  onChange: (
    event: React.SyntheticEvent<Element, Event>,
    value: AutocompleteOption | null
  ) => void;
};
