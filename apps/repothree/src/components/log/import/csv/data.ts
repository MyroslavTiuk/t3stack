import { Position, OptionType, OptionAction } from "trackgreeks-database";
import { mapValues } from "lodash";

export enum PROPERTIES {
  symbol = "symbol",
  transactionDate = "transactionDate",
  netPrice = "netPrice",
  quantity = "quantity",
  position = "position",
  fees = "fees",
  optionType = "optionType",
  expirationDate = "expirationDate",
  strikePrice = "strikePrice",
  expiry = "expiry",
  description = "description",
  sourceTransactionId = "sourceTransactionId",
}

export type Property = keyof typeof PROPERTIES;
export const propertyValues = Object.values(PROPERTIES);

export const NUMBER_PROPERTIES: Property[] = [
  PROPERTIES.netPrice,
  PROPERTIES.quantity,
  PROPERTIES.strikePrice,
  PROPERTIES.fees,
];

export const DATE_PROPERTIES: Property[] = [
  PROPERTIES.transactionDate,
  PROPERTIES.expirationDate,
];

export function parseCsvValue(property: Property, input: string | null) {
  if (input && NUMBER_PROPERTIES.includes(property)) {
    // eslint-disable-next-line no-useless-escape
    const value = Number(input.match(/\d\d*\.?\d*/)?.[0]);
    if (isNaN(value)) {
      return null;
    }
    if (input.includes("-")) {
      return -value;
    }
    return value;
  }
  if (input && DATE_PROPERTIES.includes(property)) {
    const parsedDate = new Date(input);
    return !isNaN(parsedDate.valueOf()) ? parsedDate : null;
  }
  return input || null;
}

export const PROPERTIES_DISPLAY_NAME: { [key in PROPERTIES]: string } = {
  [PROPERTIES.sourceTransactionId]: "Transaction ID",
  [PROPERTIES.symbol]: "Symbol",
  [PROPERTIES.transactionDate]: "Transaction Date",
  [PROPERTIES.netPrice]: "Net Price",
  [PROPERTIES.quantity]: "Quantity",
  [PROPERTIES.position]: "Position",
  [PROPERTIES.optionType]: "Option Type",
  [PROPERTIES.expirationDate]: "Expiration Date",
  [PROPERTIES.strikePrice]: "Strike Price",
  [PROPERTIES.expiry]: "Option Expiry",
  [PROPERTIES.fees]: "Fees",
  [PROPERTIES.description]: "Description",
};

export const REQUIRED_PROPERTIES: Property[] = [
  PROPERTIES.symbol,
  PROPERTIES.transactionDate,
  PROPERTIES.netPrice,
  PROPERTIES.quantity,
  PROPERTIES.position,
];

export const SAMPLE_DATA: { [key in PROPERTIES]: string[] } = {
  [PROPERTIES.sourceTransactionId]: [
    "Id in the source system, can be anything.",
  ],
  [PROPERTIES.symbol]: ["e.g. AAPL, TSLA"],
  [PROPERTIES.transactionDate]: [
    "valid formats are 03/20/2023, 2023-05-25,",
    "or 2023-05-24T21:00:00.000Z",
  ],
  [PROPERTIES.netPrice]: [
    "price of entire transaction in dollars",
    "e.g. 100 or 10.50",
  ],
  [PROPERTIES.quantity]: ["amount of shares/contracts, e.g. 2"],
  [PROPERTIES.position]: [
    `must be "${Position.Long}" or "${Position.Short}"`,
    "use translation tool if necessary.",
  ],
  [PROPERTIES.optionType]: [
    `must be "${OptionType.Call}" or "${OptionType.Put}"`,
    `use translation tool if necessary.`,
  ],
  [PROPERTIES.expirationDate]: [
    "valid formats are 03/20/2023, 2023-05-25,",
    "or 2023-05-24T21:00:00.000Z",
  ],
  [PROPERTIES.strikePrice]: ["strike price in dollars", "e.g. 100 or 10.50"],
  [PROPERTIES.expiry]: [
    "Notice about option expiry",
    `must be "${OptionAction.Expire}" or "${OptionAction.Assign}"`,
    "use translation tool if necessary.",
  ],
  [PROPERTIES.fees]: [
    "total fees in dollars e.g. 1.20 or 3",
    "use sum tool to sum up multiple fees.",
  ],
  [PROPERTIES.description]: ["text to describe the transaction"],
};

export enum Steps {
  selectCsv = "selectCsv",
  parse = "parse",
  previewCsv = "previewCsv",
}

export enum PATTERNS {
  useCsvValue = "useCsvValue",
  extractFromString = "extractFromString",
  sum = "sum",
  includes = "includes",
}

export const PATTERNS_DISPLAY_NAME = {
  [PATTERNS.useCsvValue]: "Use value from CSV",
  [PATTERNS.extractFromString]: "Extract from text",
  [PATTERNS.sum]: "Sum multiple columns",
  [PATTERNS.includes]: "Translate",
};

export const propertyPatterns: { [key in PROPERTIES]: PATTERNS[] } = {
  [PROPERTIES.sourceTransactionId]: [
    PATTERNS.useCsvValue,
    PATTERNS.extractFromString,
  ],
  [PROPERTIES.symbol]: [PATTERNS.useCsvValue, PATTERNS.extractFromString],
  [PROPERTIES.transactionDate]: [
    PATTERNS.useCsvValue,
    PATTERNS.extractFromString,
  ],
  [PROPERTIES.netPrice]: [
    PATTERNS.useCsvValue,
    PATTERNS.extractFromString,
    PATTERNS.sum,
  ],
  [PROPERTIES.quantity]: [
    PATTERNS.useCsvValue,
    PATTERNS.extractFromString,
    PATTERNS.sum,
  ],
  [PROPERTIES.position]: [PATTERNS.useCsvValue, PATTERNS.includes],
  [PROPERTIES.optionType]: [PATTERNS.useCsvValue, PATTERNS.includes],
  [PROPERTIES.expirationDate]: [
    PATTERNS.useCsvValue,
    PATTERNS.extractFromString,
  ],
  [PROPERTIES.strikePrice]: [PATTERNS.useCsvValue, PATTERNS.extractFromString],
  [PROPERTIES.expiry]: [PATTERNS.useCsvValue, PATTERNS.includes],
  [PROPERTIES.fees]: [PATTERNS.useCsvValue, PATTERNS.sum],
  [PROPERTIES.description]: [PATTERNS.useCsvValue, PATTERNS.extractFromString],
};

export type MappedProperties = {
  [prop in PROPERTIES]: {
    csvColName: string | null;
    pattern: keyof typeof PATTERNS;
    action: (
      input: string | null,
      row: { [key: string]: string | null }
    ) => string | null;
    parameters: {
      stringTemplate: string;
      selectedWordIndexes: number[];
      firstIncludePattern: string;
      secondIncludePattern: string;
      defaultBehavior: DefaultBehavior;
      sumColNames: string[];
    };
  };
};

export enum DefaultBehavior {
  ignore = "ignore",
  useFirst = "useFirst",
  useSecond = "useSecond",
}

export function buildDefaultMappedProperty() {
  return {
    csvColName: null,
    pattern: PATTERNS.useCsvValue,
    action: (input: string | null) => input,
    parameters: {
      stringTemplate: "",
      selectedWordIndexes: [],
      firstIncludePattern: "",
      secondIncludePattern: "",
      defaultBehavior: DefaultBehavior.ignore,
      sumColNames: [],
    },
  };
}

export const DEFAULT_MAPPED_PROPERTIES: MappedProperties = mapValues(
  PROPERTIES,
  (_property) => buildDefaultMappedProperty()
);

export const propertyToEnum = {
  position: [
    {
      enumValue: Position.Long,
      description:
        'If entry contains these values it translates to Long, use commas to enter multiple, e.g. "buy,bto,btc"',
    },
    {
      enumValue: Position.Short,
      description:
        'If entry contains these values it translates to Short, use commas to enter multiple, e.g. "sell,sto,stc"',
    },
  ],
  optionType: [
    {
      enumValue: OptionType.Call,
      description:
        'If entry contains these values it translates to Call, use commas to enter multiple, e.g. "c,call"',
    },
    {
      enumValue: OptionType.Put,
      description:
        'If entry contains these values it translates to Put, use commas to enter multiple, e.g. "p,put"',
    },
  ],
  expiry: [
    {
      enumValue: OptionAction.Assign,
      description:
        'If entry contains these values it translates to Assigned, use commas to enter multiple, e.g. "assigned,assignment"',
    },
    {
      enumValue: OptionAction.Expire,
      description:
        'If entry contains these values it translates to Expired worthless, use commas to enter multiple, e.g. "expired"',
    },
  ],
};
