import React from "react";
import TextField from "@mui/material/TextField";
import MuiAutocomplete from "@mui/material/Autocomplete";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { useColorMode } from "@chakra-ui/react";

export const Autocomplete: React.FC<Props> = ({
  options,
  onChange,
  getOptionLabel,
  dataCy,
  label = "Search...",
  defaultValue,
}) => {
  const { colorMode } = useColorMode();
  const isDarkMode = colorMode === "dark";

  const darkModeTextFieldStyles = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: "var(--chakra-colors-gray-800)",
      color: "#fff",
    },
    "& .MuiFormLabel-root, .MuiSvgIcon-root": {
      color: "#fff !important",
    },
    "& .MuiOutlinedInput-notchedOutline, .MuiAutocomplete-inputFocused": {
      borderColor: "rgb(255 255 255) !important",
    },
  };

  // for now we use Material UI's Autocomplete component as it is the only one that
  // is fast enough with this many options, react-select, and @choc-ui/chakra-autocomplete
  // are not fast enough for our purposes.

  const theme = createTheme({});
  return (
    <ThemeProvider theme={theme}>
      <MuiAutocomplete
        disableListWrap
        options={options}
        getOptionLabel={getOptionLabel}
        defaultValue={defaultValue}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            sx={isDarkMode ? darkModeTextFieldStyles : {}}
            size="small"
            data-cy={dataCy}
          />
        )}
        onChange={onChange}
        sx={colorMode === "dark" ? { color: "white" } : {}}
      />
    </ThemeProvider>
  );
};

export type AutocompleteOption = {
  id: string;
  label: string;
};

export type DefaultValue = {
  id: string;
  label: string;
};

type Props = {
  options: AutocompleteOption[];
  onChange: (
    event: React.SyntheticEvent<Element, Event>,
    value: AutocompleteOption | null
  ) => void;
  getOptionLabel?:
    | ((option: { id: string; label: string }) => string)
    | undefined;
  dataCy?: string;
  label?: string;
  defaultValue?: DefaultValue;
};
