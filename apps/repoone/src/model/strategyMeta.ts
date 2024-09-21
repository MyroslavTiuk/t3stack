import { type StratName } from "opc-types/lib/StratName";

export const keyWordsPrefix =
  "Options calculator, profit calculator, stock options, stock options calculator, options tool, share options, roi";
// @ts-ignore
export const STRAT_META_ITEMS_MAPPING: Record<
  StratName,
  { description: string; title: string }
> = {
  custom: {
    description:
      "Custom option strategy calculator. Add and remove option legs to build your strategy",
    title: "Custom strategy",
  },
  "2-legs": {
    description:
      "2 Legs Calculator shows projected profit and loss over time. Customised strategy with 2 legs",
    title: "2 legged custom strategy",
  },
  "3-legs": {
    description:
      "3 Legs Calculator shows projected profit and loss over time. Customised strategy with 3 legs",
    title: "3 legged custom strategy",
  },
  "4-legs": {
    description:
      "4 Legs Calculator shows projected profit and loss over time. Customised strategy with 4 legs",
    title: "4 legged custom strategy",
  },
  "5-legs": {
    description:
      "5 Legs Calculator shows projected profit and loss over time. Customised strategy with 5 legs",
    title: "5 legged custom strategy",
  },
  "6-legs": {
    description:
      "6 Legs Calculator shows projected profit and loss over time. Customised strategy with 6 legs",
    title: "6 legged custom strategy",
  },
  "7-legs": {
    description:
      "7 Legs Calculator shows projected profit and loss over time. Customised strategy with 7 legs",
    title: "7 legged custom strategy",
  },
  "8-legs": {
    description:
      "8 Legs Calculator shows projected profit and loss over time. Customised strategy with 8 legs",
    title: "8 legged custom strategy",
  },
  "bearish-call-credit-spread": {
    description:
      "Bearish call spread / credit spread calculator.  A bullish call spread is opened at an initial cost to the trader (debit), and has limited risk and limited return.",
    title: "Bearish call spread / credit spread calculator",
  },
  "bullish-put-credit-spread": {
    description:
      "Bullish put spread / credit spread calculator.  A bullish put spread is opened for an initial credit to the trader, and has limited risk and limited return.",
    title: "Bullish put spread / credit spread calculator",
  },
  "bearish-put-debit-spread": {
    description:
      "Bearish put spread / debit spread calculator. A bearish put spread is opened at an initial cost to the trader (debit), and has limited risk and limited return.",
    title: "Bearish put spread / debit spread calculator",
  },
  "bullish-call-debit-spread": {
    description:
      "Bullish call spread / debit spread calculator. A bearish call spread is opened for an initial credit to the trader, and has limited risk and limited return.",
    title: "Bullish call spread / debit spread calculator",
  },
  butterfly: {
    description:
      "Butterfly Spread Calculator shows projected profit and loss over time. A butterfly spread provides potentially high returns at a specific strike price (the body, or middle leg of the butterfly).  Maximum risk is limited.",
    title: "Butterfly spread: suited to a neutral market",
  },
  "calendar-spread": {
    description:
      "Calendar Spread Calculator shows projected profit and loss over time. A calendar spread involves buying long term call options and writing call options at the same strike price that expire sooner.  It is a strongly neutral strategy.",
    title:
      "Calendar spread calculator: Buy and write options of the same strike price for two expiration dates.",
  },
  "ratio-backspread": {
    description:
      "Ratio Backspread Calculator shows projected profit and loss over time. A calendar spread involves buying long term call options and writing call options at the same strike price that expire sooner.  It is a strongly neutral strategy.",
    title:
      "Calendar spread calculator: Buy and write options of the same strike price for two expiration dates.",
  },
  collar: {
    description:
      "Collar Calculator shows projected profit and loss over time. A collar is an alternative strategy that provides similar profit outcomes to a call or put spread.  It varies in that it also involves holding (or purchasing) the underlying commodity.",
    title: "call-debit-put-credit-spread-bullish-collar",
  },
  "covered-call": {
    description:
      "Covered Call Calculator shows projected profit and loss over time. The covered call involves writing a call option contract while holding an equivalent number of shares of the underlying stock. It is also commonly referred to as a buy-write  if  the stock and options  are purchased at same time.",
    title:
      "Covered call calculator (buy-write): Purchase stocks, write calls against them",
  },
  "covered-strangle": {
    description:
      "Covered Strangle Calculator shows projected profit and loss over time. A covered strangle traditionally involves buying stock, selling and a call and put, with the call's strike price higher than that of the put's.  A strategy suited to a rising market.",
    title: "Covered Strangle strategy: suit bullish market",
  },
  "diagonal-spread": {
    description:
      "Diagonal spread Calculator shows projected profit and loss over time. A diagonal spread involves entering a long and a short position on two options, usually at different strikes price and in different months.",
    title: "Diagonal spread strategy: varied applications",
  },
  "double-diagonal-spread": {
    description:
      "Double Diagonal Calculator shows projected profit and loss over time. A double diagonal spread combines a diagonal put spread and diagonal call spread, meaning buying back-month put and call options and writing a front-month put and call options.",
    title: "Double diagonal spread strategy: suited to a neutral market",
  },
  "iron-condor": {
    description:
      "Iron Condor Calculator shows projected profit and loss over time. An iron condor is a four-legged strategy that provides a profit plateau between the two inner legs.  Maximum risk is limited.",
    title: "Iron Condor strategy: suits a neutral market",
  },
  "long-call": {
    description:
      "Call option profit calculator.  Visualize the projected P&L of a call option at possible stock prices over time until expiry.",
    title: "Long call calculator: Purchase call options",
  },
  "long-put": {
    description:
      "Put option profit calculator.  Visualize the projected P&L of a put option at possible stock prices over time until expiry.",
    title: "Long put calculator: Purchase put options",
  },
  purchase: {
    description:
      "Stock option calculator. Visualize the projected P&L of an option at possible underlying stock prices over time until expiry",
    title: "Stock option calculator: Buy an option",
  },
  "short-call": {
    description:
      "Naked call (bearish) Calculator shows projected profit and loss over time. Writing or selling a call option - or a naked call - often requires additional requirements from your broker because it leaves you open to unlimited exposure as the underlying commodity rises in value.",
    title: "Naked call calculator: Short/write call options",
  },
  "short-put": {
    description:
      "Naked put (bullish) Calculator shows projected profit and loss over time. Writing or selling a put option - or a naked put - has a limited but immediate return but exposes the trader to a large amount of downside risk.  It is suited to a neutral to bullish market.",
    title: "Naked put calculator: Short/write put options",
  },
  straddle: {
    description:
      "Straddle Calculator shows projected profit and loss over time. A straddle involves buying a call and put of the same strike price.  It is a strategy suited to a volatile market.  The maximum risk is at the strike price and profit increases either side, as the price gets further from the chosen strike.",
    title: "Straddle strategy: suits a volatile market",
  },
  strangle: {
    description:
      "Strangle Calculator shows projected profit and loss over time. A strangle involves buying a call and put of different strike prices.  It is a strategy suited to a volatile market.  The maximum risk is between the two the strike price and profit increases either side, as the price gets further away.",
    title: "Long strangle strategy: suited to a volatile market",
  },
  "vertical-spread": {
    description:
      "Buy and write an options for a directional play with limited risk and limited return",
    title: "Option spread calculator",
  },
  "cash-secured-put": {
    description:
      "Write a put option, putting down enough cash as collateral to cover the purchase of stock at option's strike price. Often compared to a Covered Call for its similar risk profile, it can be more profitable depending on put-call skew.",
    title: "Cash secured put calculator",
  },
  "pmcc-poor-mans-covered-call": {
    description:
      "A Poor Man's Covered Call (PMCC), or Synthetic Covered Call, is used to generate regular income as per the standard Covered Call, but instead of purchasing 100 shares of stock, a Deep ITM Call (which is often a long-dated LEAP) is bought.\n\nPurchase a deep ITM long-dated Call, and " +
      "write/sell a nearer-dated near-the-money Call",
    title: "Poor man's covered call",
  },
};
