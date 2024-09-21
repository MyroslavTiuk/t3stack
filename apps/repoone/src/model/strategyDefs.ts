import { mergeDeepRight, omit } from "ramda";

import { type StrategiesDef } from "opc-types/lib/Strategies";
import { type StrategyDef } from "opc-types/lib/Strategy";
import createOptionLegDef from "./helpers/createOptionLegDef";
import { type StratName } from "opc-types/lib/StratName";
import { MENU_VISIBILITY } from "../types/enums/MENU_VISIBILITY";

const singleOptPurch: StrategyDef = {
  defaults: {
    underlyingElement: "underlying",
    linkExpiries: false,
  },
  legsById: {
    underlying: {
      defaults: {
        name: "Underlying stock",
      },
      settings: {
        allowPurchase: false,
      },
      type: "stock",
    },
    option: {
      defaults: {
        name: "Option",
        num: 1,
        underlying: "underlying",
        act: "buy",
      },
      type: "option",
    },
  },
  metadata: {
    category: {
      complexity: "single",
      naked: false,
    },
    stratKey: "purchase",
  },
  settings: {
    access: "public",
    inputOptions: ["downside", "initial", "manual"],
  },
  title: "Option Purchase",
};
const optionSpread: StrategyDef = {
  defaults: {
    underlyingElement: "underlying",
    linkOpTypes: true,
    linkExpiries: true,
    linkNum: true,
  },
  legsById: {
    underlying: {
      defaults: {
        name: "Underlying stock",
      },
      settings: {
        allowPurchase: false,
        suggestedNumEle: ["OPTIONS"],
        suggestedNum: [100],
      },
      type: "stock",
    },
    long: {
      defaults: {
        act: "buy",
        name: "Long Option",
        num: 1,
        underlying: "underlying",
      },
      settings: {
        suggestedNumEle: ["OPTIONS", "underlying"],
        suggestedNum: [1, 0.01],
      },
      type: "option",
    },
    short: {
      defaults: {
        act: "sell",
        name: "Short Option",
        num: 1,
        underlying: "underlying",
      },
      settings: {
        suggestedNumEle: ["OPTIONS", "underlying"],
        suggestedNum: [1, 0.01],
      },
      type: "option",
    },
  },
  metadata: {
    category: {
      complexity: "spread",
      naked: false,
    },
    stratKey: "vertical-spread",
  },
  settings: {
    access: "public",
    showLinkNum: true,
    showLinkExpiries: true,
  },
  title: "Vertical Spread",
};
const optionSpreadShortLong = {
  ...optionSpread,
  legsById: {
    underlying: optionSpread.legsById.underlying,
    short: optionSpread.legsById.short,
    long: optionSpread.legsById.long,
  },
};

const cust: StrategyDef = {
  defaults: {
    underlyingElement: "underlying",
    linkNum: true,
  },
  legsById: {
    underlying: {
      type: "stock",
    },
    "leg-1": createOptionLegDef("Leg 1"),
    "leg-2": createOptionLegDef("Leg 2"),
    "leg-3": createOptionLegDef("Leg 3"),
    "leg-4": createOptionLegDef("Leg 4"),
    "leg-5": createOptionLegDef("Leg 5"),
    "leg-6": createOptionLegDef("Leg 6"),
    "leg-7": createOptionLegDef("Leg 7"),
    "leg-8": createOptionLegDef("Leg 8"),
  },
  metadata: {
    menuVisibility: MENU_VISIBILITY.HIDE,
    category: {
      complexity: "custom",
    },
    stratKey: "custom",
  },
  settings: {
    access: "USER_MEMBER",
  },
  title: "Custom Strategy",
  titleShort: "Custom",
};

const bullishCallDebitSpread = mergeDeepRight(optionSpread, {
  legsById: {
    long: {
      defaults: {
        name: "Long Call",
        opType: "call",
      },
    },
    short: {
      defaults: {
        name: "Short Call",
        opType: "call",
      },
    },
  },
  metadata: {
    category: {
      sentiment: "bullish",
    },
    stratKey: "bullish-call-debit-spread",
    helpDescription:
      "<p>A bullish call spread is opened at an initial cost to the trader (debit), " +
      "and has limited risk and limited return. " +
      "For the call spread to have a bullish outlook, the bought leg's strike must be lower than the sold leg's strike. " +
      "If the stock price is near or above the sold leg's strike approaching expiration, consider closing the leg or the whole spread to avoid assignment.</p>",
    helpMoreLink:
      "http://www.optionseducation.org/strategy/bull_call_spread.jsp",
  },
  title: "Call debit spread (bullish)",
}) as StrategyDef;
const strategyDefs: StrategiesDef = {
  "long-call": mergeDeepRight(singleOptPurch, {
    legsById: {
      option: {
        defaults: {
          name: "Call option",
          act: "buy",
          opType: "call",
        },
      },
    },
    settings: {
      category: {
        sentiment: "bullish",
      },
    },
    metadata: {
      stratKey: "long-call",
      helpDescription:
        "<p>Purchasing a call is one of the most basic options trading strategies and is suitable when sentiment is strongly bullish." +
        "  It can be used as a leveraging tool as an alternative to margin trading.</p>",
      helpMoreLink: "http://www.888options.com/strategy/long_call.jsp",
    },
    title: "Long Call",
  }) as StrategyDef,
  "long-put": mergeDeepRight(singleOptPurch, {
    legsById: {
      option: {
        defaults: {
          name: "Put option",
          act: "buy",
          opType: "put",
        },
      },
    },
    metadata: {
      category: {
        sentiment: "bearish",
      },
      stratKey: "long-put",
      helpDescription:
        "<p>Purchasing a put option is a strongly bearish strategy and an excellent way to profit in a falling market." +
        "  It can be used as a leveraging tool as an alternative to margin trading.</p>",
      helpMoreLink: "http://www.888options.com/strategy/long_put.jsp",
    },
    title: "Long Put",
  }) as StrategyDef,
  "covered-call": {
    defaults: {
      underlyingElement: "underlying",
      linkNum: true,
    },
    legsById: {
      underlying: {
        defaults: {
          act: "buy",
          name: "Underlying stock",
          num: 100,
        },
        settings: {
          changeAct: false,
          allowPurchase: true,
          suggestedNum: [100],
          suggestedNumEle: ["option"],
        },
        type: "stock",
      },
      option: {
        defaults: {
          act: "sell",
          name: "Option",
          num: 1,
          opType: "call",
          underlying: "underlying",
        },
        settings: {
          suggestedNum: [0.01],
          suggestedNumEle: ["underlying"],
        },
        type: "option",
      },
    },
    settings: {
      access: "public",
      inputOptions: ["downside", "initial", "manual"],
    },
    metadata: {
      category: {
        complexity: "single",
        sentiment: "bullish",
        married: true,
      },
      stratKey: "covered-call",
      helpDescription:
        "<p>The covered call involves writing a call option contract while holding an equivalent number of shares of the underlying stock. " +
        'It is also known as a "buy-write" if the stock and options are purchased at the same time.</p>',
      helpMoreLink: "http://www.888options.com/strategy/covered_call.jsp",
    },
    title: "Covered Call",
  },
  "cash-secured-put": mergeDeepRight(singleOptPurch, {
    legsById: {
      option: {
        defaults: {
          name: "Put option",
          act: "sell",
          opType: "put",
        },
        settings: {
          collateralPerc: 100,
        },
      },
    },
    settings: {
      access: "public",
      inputOptions: ["downside", "initial", "manual"] as (
        | "downside"
        | "initial"
        | "manual"
      )[],
    },
    metadata: {
      category: {
        complexity: "single",
        sentiment: "bullish",
      },
      stratKey: "cash-secured-put",
      helpDescription: "<p></p>",
    },
    title: "Cash Secured Put",
  }) as unknown as StrategyDef,
  "short-call": mergeDeepRight(singleOptPurch, {
    legsById: {
      option: {
        defaults: {
          name: "Call option",
          act: "sell",
          opType: "call",
        },
      },
    },
    metadata: {
      category: {
        naked: true,
        sentiment: "bearish",
      },
      stratKey: "short-call",
      helpDescription:
        "<p>Writing or selling a call option - or a naked call - pays you an initial premium which is the maximum profit " +
        " should the stock price stays flat or falls.  Short calls often requires additional access from your broker " +
        "as it leaves you exposed to unlimited risk as the underlying commodity rises in value.</p>",
      helpMoreLink:
        "http://www.optiontradingtips.com/strategies/short-call-option.html",
    },
    settings: {},
    title: "Short/naked Call",
  }) as StrategyDef,
  "short-put": mergeDeepRight(singleOptPurch, {
    legsById: {
      option: {
        defaults: {
          name: "Put option",
          act: "sell",
          opType: "put",
        },
      },
    },
    metadata: {
      category: {
        naked: true,
        sentiment: "bullish",
      },
      stratKey: "short-put",
      helpDescription:
        "<p>Writing or selling a put option - or a naked put - pays you an initial premium which is the maximum profit " +
        " should the stock price stays flat or increase.  Short puts often require additional access from your broker " +
        " as it leaves you exposed to extreme downside risk.</p>",
      helpMoreLink:
        "http://www.optiontradingtips.com/strategies/short-put-option.html",
    },
    title: "Short/naked Put",
  }) as StrategyDef,
  "vertical-spread": mergeDeepRight(optionSpread, {
    settings: {
      showLinkOpTypes: true,
    },
    metadata: {
      helpDescription:
        "<p>Buy an option at one strike and sell another option of the same type and expiry at another strike.  " +
        "Maximum returns and maximum risk are both limited</p>",
    },
  }),
  "bullish-call-debit-spread": bullishCallDebitSpread,
  "bullish-put-credit-spread": mergeDeepRight(optionSpread, {
    legsById: {
      long: {
        defaults: {
          name: "Long Put",
          opType: "put",
        },
      },
      short: {
        defaults: {
          name: "Short Put",
          opType: "put",
        },
      },
    },
    metadata: {
      category: {
        sentiment: "bullish",
      },
      stratKey: "bullish-put-credit-spread",
      helpDescription:
        "<p>A bullish put spread is opened for an initial credit to the trader, " +
        "and has limited risk and limited return. " +
        "For the put spread to have a bullish outlook, the bought leg's strike must be lower than the sold leg's strike. " +
        "If the stock price is near or below the sold leg's strike approaching expiration, consider closing the leg or the whole spread to avoid assignment.</p>",
      helpMoreLink:
        "http://www.optionseducation.org/strategy/bear_put_spread.jsp",
    },
    title: "Put credit spread (bullish)",
  }) as StrategyDef,
  "bearish-call-credit-spread": mergeDeepRight(optionSpreadShortLong, {
    legsById: {
      long: {
        defaults: {
          name: "Long Call",
          opType: "call",
        },
      },
      short: {
        defaults: {
          name: "Short Call",
          opType: "call",
        },
      },
    },
    metadata: {
      category: {
        sentiment: "bearish",
      },
      stratKey: "bearish-call-credit-spread",
      helpDescription:
        "<p>A bearish call spread is opened for an initial credit to the trader, " +
        "and has limited risk and limited return. " +
        "For the put spread to have a bearish outlook, the bought leg's strike must be higher than the sold leg's strike. " +
        "If the stock price is near or below the sold leg's strike approaching expiration, consider closing the leg or the whole spread to avoid assignment.</p>",
      helpMoreLink:
        "http://www.optionseducation.org/strategy/bull_call_spread.jsp",
    },
    title: "Call credit spread (bearish)",
  }) as StrategyDef,
  "bearish-put-debit-spread": mergeDeepRight(optionSpreadShortLong, {
    legsById: {
      short: {
        defaults: {
          name: "Short Put",
          opType: "put",
        },
      },
      long: {
        defaults: {
          name: "Long Put",
          opType: "put",
        },
      },
    },
    metadata: {
      category: {
        sentiment: "bearish",
      },
      stratKey: "bearish-put-debit-spread",
      helpDescription:
        "<p>A bearish put spread is opened at an initial cost to the trader (debit), " +
        "and has limited risk and limited return. " +
        "For the call spread to have a bearish outlook, the bought leg's strike must be higher than the sold leg's strike. " +
        "If the stock price is near or above the sold leg's strike approaching expiration, consider closing the leg or the whole spread to avoid assignment.</p>",
      helpMoreLink:
        "http://www.optionseducation.org/strategy/bear_put_spread.jsp",
    },
    title: "Put debit spread (bearish)",
  }) as StrategyDef,
  "pmcc-poor-mans-covered-call": mergeDeepRight(bullishCallDebitSpread, {
    metadata: {
      stratKey: "pmcc-poor-mans-covered-call",
      helpDescription:
        "<p>A Poor Man's Covered Call (PMCC), or Synthetic Covered Call, is used to generate regular income as per the standard " +
        "Covered Call, but instead of purchasing 100 shares of stock, a Deep ITM Call (which is often a long-dated LEAP) is bought." +
        "<ul>" +
        "<li>Purchase a deep ITM long-dated Call</li>" +
        "<li>Write/sell a nearer-dated near-the-money Call</li>" +
        "</ul>",
    },
    title: "Poor Man's Covered Call",
  }) as StrategyDef,
  "calendar-spread": mergeDeepRight(optionSpread, {
    defaults: {
      linkExpiries: false,
      linkStrikes: true,
      changeOpType: true,
    },
    legsById: {
      long: {
        defaults: {
          name: "Back month",
          linkExpiry: false,
          linkStrike: true,
        },
        settings: {
          changeOpType: true,
        },
      },
      short: {
        defaults: {
          name: "Front month",
          linkExpiry: false,
          linkStrike: true,
        },
        settings: {
          changeOpType: true,
        },
      },
    },
    legs: ["underlying", "long", "short"],
    metadata: {
      category: {
        sentiment: "targetted",
      },
      stratKey: "calendar-spread",
      helpDescription:
        "<p>A calendar spread involves buying a long term option and writing another option at the same strike price that expire sooner.  It is a strongly neutral/targetted strategy.</p>",
      /* , and benefits from ____ volatility */
      helpMoreLink:
        "http://www.theoptionsguide.com/neutral-calendar-spread.aspx",
    },
    title: "Calendar Spread",
    settings: {
      showLinkExpiries: false,
      showLinkStrikes: true,
      showLinkOpTypes: true,
    },
  }) as unknown as StrategyDef,
  "diagonal-spread": mergeDeepRight(optionSpread, {
    defaults: {
      linkExpiries: false,
    },
    legsById: {
      long: {
        defaults: {
          name: "Back month",
        },
      },
      short: {
        defaults: {
          name: "Front month",
        },
      },
    },
    legs: ["underlying", "long", "short"],
    metadata: {
      category: {
        sentiment: ["bullish", "bearish"],
      },
      stratKey: "diagonal-spread",
      helpDescription:
        "<p> A diagonal spread involves entering a long and a short position on two options, usually at different strikes price and expiring in different months.</p>",
      helpMoreLink: "http://www.theoptionsguide.com/diagonal-spread.aspx",
    },
    title: "Diagonal Spread",
    settings: {
      showLinkExpiries: false,
      showLinkOpTypes: true,
    },
  }) as unknown as StrategyDef,
  "ratio-backspread": mergeDeepRight(optionSpread, {
    defaults: {
      linkOpTypes: true,
    },
    legsById: {
      long: {
        defaults: {
          name: "Long (×2)",
          num: 2,
        },
        settings: {
          suggestedNum: [2],
          suggestedNumEle: ["short"],
        },
      },
      short: {
        defaults: {
          name: "Short",
        },
        settings: {
          suggestedNum: [0.5],
          suggestedNumEle: ["long"],
        },
      },
    },
    metadata: {
      category: {
        sentiment: ["bullish", "bearish"],
      },
      stratKey: "ratio-backspread",
      helpDescription:
        "<p>A ratio backspread involves selling one lot of in-the-money options, and buying two or more" +
        "times as many at- or out-of-the-money options (of the same type and expiry), to open the trade for a credit.</p>",
    },
    settings: {
      showLinkOpTypes: true,
    },
    title: "Ratio Backspread",
  }) as StrategyDef,
  "iron-condor": {
    defaults: {
      underlyingElement: "underlying",
      linkExpiries: true,
      linkNum: true,
    },
    legsById: {
      underlying: {
        defaults: {
          name: "Underlying stock",
        },
        settings: {
          allowPurchase: false,
        },
        type: "stock",
      },
      "long-put": {
        defaults: {
          act: "buy",
          name: "Long put",
          num: 1,
          opType: "put",
          underlying: "underlying",
        },
        settings: {
          suggestedNumEle: ["long-call", "short-call", "short-put"],
        },
        type: "option",
      },
      "short-put": {
        defaults: {
          act: "sell",
          name: "Short put",
          num: 1,
          opType: "put",
          underlying: "underlying",
        },
        settings: {
          suggestedNumEle: ["long-call", "short-call", "long-put"],
        },
        type: "option",
      },
      "short-call": {
        defaults: {
          act: "sell",
          name: "Short call",
          num: 1,
          opType: "call",
          underlying: "underlying",
        },
        settings: {
          suggestedNumEle: ["long-call", "short-put", "long-put"],
        },
        type: "option",
      },
      "long-call": {
        defaults: {
          act: "buy",
          name: "Long call",
          num: 1,
          opType: "call",
          underlying: "underlying",
        },
        settings: {
          suggestedNumEle: ["short-call", "short-put", "long-put"],
        },
        type: "option",
      },
    },
    metadata: {
      category: {
        complexity: "advanced/multileg",
        sentiment: "targetted",
      },
      stratKey: "iron-condor",
      helpDescription:
        "<p>An iron condor is a four-legged strategy that provides maximum profit at any price between the two inner legs' strike prices.  Maximum risk is limited.</p>",
      helpMoreLink: "http://www.theoptionsguide.com/iron-condor.aspx",
    },
    settings: {
      access: "USER_MEMBER",
      showLinkExpiries: true,
    },
    title: "Iron Condor",
  },
  butterfly: {
    defaults: {
      underlyingElement: "underlying",
      linkExpiries: true,
      linkOpTypes: true,
      linkNum: true,
    },
    legsById: {
      underlying: {
        defaults: {
          name: "Underlying stock",
        },
        settings: {
          allowPurchase: false,
        },
        type: "stock",
      },
      lower: {
        defaults: {
          act: "buy",
          name: "Lower wing",
          num: 1,
          opType: "call",
          underlying: "underlying",
        },
        settings: {
          suggestedNum: [0.5, 1],
          suggestedNumEle: ["middle", "upper"],
        },
        type: "option",
      },
      middle: {
        defaults: {
          act: "sell",
          name: "Middle",
          num: 2,
          opType: "call",
          underlying: "underlying",
        },
        settings: {
          suggestedNum: [2, 2],
          suggestedNumEle: ["lower", "upper"],
        },
        type: "option",
      },
      upper: {
        defaults: {
          act: "buy",
          name: "Upper wing",
          num: 1,
          opType: "call",
          underlying: "underlying",
        },
        settings: {
          suggestedNum: [0.5, 1],
          suggestedNumEle: ["middle", "lower"],
        },
        type: "option",
      },
    },
    metadata: {
      category: {
        complexity: "advanced/multileg",
        sentiment: "targetted",
      },
      stratKey: "butterfly",
      helpDescription:
        "<p>A butterfly spread provides potentially high returns at a specific strike price (the body, or    middle leg of the butterfly).  Maximum risk is limited.</p>",
      helpMoreLink: "http://www.theoptionsguide.com/butterfly-spread.aspx",
    },
    settings: {
      access: "USER_MEMBER",
      showLinkExpiries: true,
      showLinkOpTypes: true,
    },
    title: "Butterfly",
  },
  straddle: {
    defaults: {
      underlyingElement: "underlying",
      linkNum: true,
      linkStrikes: true,
      linkExpiries: true,
    },
    legsById: {
      underlying: {
        defaults: {
          name: "Underlying stock",
        },
        settings: {
          allowPurchase: false,
        },
        type: "stock",
      },
      "call-option": {
        defaults: {
          act: "buy",
          name: "Call option",
          num: 1,
          opType: "call",
          underlying: "underlying",
        },
        settings: {
          suggestedNumEle: ["put-option"],
        },
        type: "option",
      },
      "put-option": {
        defaults: {
          act: "buy",
          name: "Put option",
          num: 1,
          opType: "put",
          underlying: "underlying",
        },
        settings: {
          suggestedNumEle: ["call-option"],
        },
        type: "option",
      },
    },
    metadata: {
      category: {
        complexity: "advanced/multileg",
        sentiment: "volatile",
      },
      stratKey: "straddle",
      helpDescription:
        "<p>A straddle involves buying a call and put of the same strike price.  It is    a strategy suited to a volatile market.  The maximum risk is at the strike price and profit increases    either side, as the price gets further from the chosen strike.</p>",
      helpMoreLink: "http://www.theoptionsguide.com/long-straddle.aspx",
    },
    settings: {
      access: "USER_MEMBER",
      showLinkStrikes: true,
      showLinkExpiries: true,
    },
    title: "Straddle",
  },
  strangle: {
    defaults: {
      underlyingElement: "underlying",
      linkNum: true,
      linkExpiries: true,
    },
    legsById: {
      underlying: {
        defaults: {
          name: "Underlying stock",
        },
        settings: {
          allowPurchase: false,
        },
        type: "stock",
      },
      "call-option": {
        defaults: {
          act: "buy",
          name: "Call",
          num: 1,
          opType: "call",
          underlying: "underlying",
        },
        settings: {
          suggestedNumEle: ["put-option"],
        },
        type: "option",
      },
      "put-option": {
        defaults: {
          act: "buy",
          name: "Put",
          num: 1,
          opType: "put",
          underlying: "underlying",
        },
        settings: {
          suggestedNumEle: ["call-option"],
        },
        type: "option",
      },
    },
    metadata: {
      category: {
        complexity: "advanced/multileg",
        sentiment: "volatile",
      },
      stratKey: "strangle",
      helpDescription:
        "<p>A strangle involves buying a call and put of different strike prices.  It is    a strategy suited to a volatile market.  The maximum risk is between the two the strike price and profit increases    either side, as the price gets further away.</p>",
      helpMoreLink: "http://www.theoptionsguide.com/long-strangle.aspx",
    },
    settings: {
      access: "USER_MEMBER",
      showLinkExpiries: true,
    },
    title: "Strangle",
  },
  collar: {
    defaults: {
      underlyingElement: "underlying",
      linkExpiries: true,
      linkNum: true,
    },
    legsById: {
      underlying: {
        defaults: {
          act: "buy",
          name: "Underlying stock",
          num: 100,
        },
        settings: {
          allowPurchase: true,
          suggestedNumEle: ["ALL"],
          suggestedNum: [100],
        },
        type: "stock",
      },
      cap: {
        defaults: {
          act: "sell",
          name: "Cap (call)",
          num: 1,
          opType: "call",
          underlying: "underlying",
        },
        settings: {
          suggestedNumEle: ["underlying", "floor"],
          suggestedNum: [0.01, 1],
        },
        type: "option",
      },
      floor: {
        defaults: {
          act: "buy",
          name: "Floor (put)",
          num: 1,
          opType: "put",
          underlying: "underlying",
        },
        settings: {
          suggestedNumEle: ["underlying", "cap"],
          suggestedNum: [0.01, 1],
        },
        type: "option",
      },
    },
    metadata: {
      category: {
        complexity: "advanced/multileg",
      },
      stratKey: "collar",
      helpDescription:
        "<p>A collar is an alternative strategy that provides similar profit/loss profile to    a call or put spread.  It varies in that it also involves holding (or purchasing) the underlying commodity.</p>",
      helpMoreLink: "http://www.theoptionsguide.com/the-collar-strategy.aspx",
    },
    settings: {
      access: "USER_MEMBER",
      showLinkExpiries: true,
    },
    title: "Collar",
  },
  "covered-strangle": {
    defaults: {
      underlyingElement: "underlying",
      linkExpiries: true,
      linkNum: true,
    },
    legsById: {
      underlying: {
        defaults: {
          act: "buy",
          name: "Underlying stock",
          num: 100,
        },
        settings: {
          changeAct: false,
          allowPurchase: true,
          suggestedNum: [100],
          suggestedNumEle: ["ALL"],
        },
        type: "stock",
      },
      "call-option": {
        defaults: {
          act: "sell",
          name: "Call option",
          num: 1,
          opType: "call",
          underlying: "underlying",
        },
        settings: {
          suggestedNum: [1, 0.01],
          suggestedNumEle: ["put-option", "underlying"],
        },
        type: "option",
      },
      "put-option": {
        defaults: {
          act: "sell",
          name: "Put option",
          num: 1,
          opType: "put",
          underlying: "underlying",
        },
        settings: {
          suggestedNum: [1, 0.01],
          suggestedNumEle: ["call-option", "underlying"],
        },
        type: "option",
      },
    },
    metadata: {
      category: {
        complexity: "advanced/multileg",
        sentiment: "bullish",
      },
      stratKey: "covered-strangle",
      helpDescription:
        "<p>A covered strangle traditionally involves buying stock, selling and a call and put, with the call's    strike price higher than that of the put's.  A strategy suited to a rising market.</p>",
      helpMoreLink:
        "http://www.optionseducation.org/strategies_advanced_concepts/strategies/covered_strangle.html",
    },
    settings: {
      access: "USER_MEMBER",
      showLinkExpiries: true,
    },
    title: "Covered Strangle",
  },
  "double-diagonal-spread": {
    defaults: {
      underlyingElement: "underlying",
      linkNum: true,
    },
    legsById: {
      underlying: {
        defaults: {
          name: "Underlying stock",
        },
        settings: {
          allowPurchase: false,
        },
        type: "stock",
      },
      "long-call": {
        defaults: {
          act: "buy",
          name: "Long call",
          num: 1,
          opType: "call",
          underlying: "underlying",
        },
        settings: {
          suggestedNumEle: ["ALL"],
        },
        type: "option",
      },
      "long-put": {
        defaults: {
          act: "buy",
          name: "Long put",
          num: 1,
          opType: "put",
          underlying: "underlying",
        },
        settings: {
          suggestedNumEle: ["ALL"],
        },
        type: "option",
      },
      "short-call": {
        defaults: {
          act: "sell",
          name: "Short call",
          num: 1,
          opType: "call",
          underlying: "underlying",
        },
        settings: {
          suggestedNumEle: ["ALL"],
        },
        type: "option",
      },
      "short-put": {
        defaults: {
          act: "sell",
          name: "Short put",
          num: 1,
          opType: "put",
          underlying: "underlying",
        },
        settings: {
          suggestedNumEle: ["ALL"],
        },
        type: "option",
      },
    },
    metadata: {
      category: {
        complexity: "advanced/multileg",
      },
      stratKey: "double-diagonal-spread",
      helpDescription:
        "<p>A double diagonal spread combines a diagonal put spread and diagonal call spread, meaning buying back-month put and call options and writing a front-month put and call options.</p>",
      helpMoreLink:
        "http://www.optionsplaybook.com/option-strategies/double-diagonal-spread/",
    },
    settings: {
      access: "USER_MEMBER",
    },
    titleShort: "Double Diagonal",
    title: "Double Diagonal Spread",
  },
  custom: mergeDeepRight(omit(["legsById"], cust) as unknown as StrategyDef, {
    legsById: omit(
      ["leg-2", "leg-3", "leg-4", "leg-5", "leg-6", "leg-7", "leg-8"],
      cust.legsById
    ),
    metadata: {
      menuVisibility: MENU_VISIBILITY.SHOW,
      helpDescription:
        "<p>Add/remove option legs and purchase of shares to build your strategy</p>",
    },
  }) as unknown as StrategyDef,
  "2-legs": mergeDeepRight(omit(["legsById"], cust) as unknown as StrategyDef, {
    legsById: omit(
      ["leg-3", "leg-4", "leg-5", "leg-6", "leg-7", "leg-8"],
      cust.legsById
    ),
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - the missing property is present in the merged object
    metadata: {
      stratKey: "2-legs" as StratName,
    },
    title: "Custom 2 Legs",
    titleShort: "2 Legs",
  }) as unknown as StrategyDef,
  "3-legs": mergeDeepRight(omit(["legsById"], cust) as unknown as StrategyDef, {
    legsById: omit(
      ["leg-4", "leg-5", "leg-6", "leg-7", "leg-8"],
      cust.legsById
    ),
    metadata: { stratKey: "3-legs" as StratName },
    title: "Custom 3 Legs",
    titleShort: "3 Legs",
  }) as unknown as StrategyDef,
  "4-legs": mergeDeepRight(omit(["legsById"], cust) as unknown as StrategyDef, {
    legsById: omit(["leg-5", "leg-6", "leg-7", "leg-8"], cust.legsById),
    metadata: { stratKey: "4-legs" as StratName },
    title: "Custom 4 Legs",
    titleShort: "4 Legs",
  }) as unknown as StrategyDef,
  "5-legs": mergeDeepRight(omit(["legsById"], cust) as unknown as StrategyDef, {
    legsById: omit(["leg-6", "leg-7", "leg-8"], cust.legsById),
    metadata: { stratKey: "5-legs" as StratName },
    title: "Custom 5 Legs",
    titleShort: "5 Legs",
  }) as unknown as StrategyDef,
  "6-legs": mergeDeepRight(omit(["legsById"], cust) as unknown as StrategyDef, {
    legsById: omit(["leg-7", "leg-8"], cust.legsById),
    metadata: { stratKey: "6-legs" as StratName },
    title: "Custom 6 Legs",
    titleShort: "6 Legs",
  }) as unknown as StrategyDef,
  "7-legs": mergeDeepRight(omit(["legsById"], cust) as unknown as StrategyDef, {
    legsById: omit(["leg-8"], cust.legsById),
    metadata: { stratKey: "7-legs" as StratName },
    title: "Custom 7 Legs",
    titleShort: "7 Legs",
  }) as unknown as StrategyDef,
  "8-legs": mergeDeepRight(cust, {
    metadata: { stratKey: "8-legs" as StratName },
    title: "Custom 8 Legs",
    titleShort: "8 Legs",
  }),
  "quick-view": mergeDeepRight(singleOptPurch, {
    settings: {
      changeOpType: true,
    },
    metadata: {
      category: {
        complexity: "custom",
      },
      stratKey: "quick-view",
      helpDescription:
        "<p>Purchasing a call is one of the most basic options trading strategies and is suitable when sentiment is strongly bullish." +
        "  It can be used as a leveraging tool as an alternative to margin trading.</p>",
      helpMoreLink: "http://www.888options.com/strategy/long_call.jsp",
    },
    title: "Quick View",
  }) as unknown as StrategyDef,
  purchase: mergeDeepRight(singleOptPurch, {
    settings: {
      changeOpType: true,
    },
    metadata: {
      menuVisibility: MENU_VISIBILITY.HIDE,
    },
  }) as unknown as StrategyDef,
};

export default strategyDefs;
