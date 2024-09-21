interface CheckboxItem {
  title: string;
  checked: boolean;
}
const stockData: CheckboxItem[] = [
  { title: "ask", checked: false },
  { title: "bid", checked: true },
  { title: "mark", checked: false },
  { title: "bid/ask size", checked: true },
  { title: "last", checked: false },
  { title: "52week high", checked: true },
  { title: "52week low", checked: false },
  { title: "bid ask spread", checked: false },
  { title: "Volume", checked: false },
  { title: "1 year return", checked: false },
];

const optionsData: CheckboxItem[] = [
  { title: "IV", checked: false },
  { title: "Probability of profit", checked: true },
  { title: "Open interest", checked: false },
  { title: "Volume", checked: false },
  { title: "delta", checked: false },
  { title: "theta", checked: false },
  { title: "strike range", checked: false },
  { title: "has weekly options", checked: false },
  { title: "OTM %", checked: false },
];

const profitAndRisk: CheckboxItem[] = [
  { title: "PoP/Chance of Profit", checked: false },
  { title: "ROI", checked: true },
  { title: "ROI annualized", checked: false },
];

const fundamentals: CheckboxItem[] = [
  { title: "market cap", checked: false },
  { title: "pe ratio", checked: true },
  { title: "beta", checked: false },
  { title: "debt", checked: false },
  { title: "revenue", checked: false },
  { title: "net income", checked: false },
  { title: "eps", checked: false },
  { title: "operating income", checked: false },
  { title: "cash on hand", checked: false },
  { title: "cost of revenue", checked: false },
  { title: "ebitda", checked: false },
];

const technicals: CheckboxItem[] = [
  { title: "ATR", checked: false },
  { title: "Stock position", checked: true },
  { title: "Stock Power Volume", checked: false },
  { title: "RSI", checked: false },
  { title: "SMA", checked: false },
  { title: "MACD", checked: false },
  { title: "Stochastic", checked: false },
  { title: "SMA Crossover", checked: false },
  { title: "SMA Rank", checked: false },
  { title: "Bollinger Bands", checked: false },
];

export const initialAllData: {
  [key: string]: CheckboxItem[];
} = {
  stockData,
  optionsData,
  profitAndRisk,
  fundamentals,
  technicals,
};
