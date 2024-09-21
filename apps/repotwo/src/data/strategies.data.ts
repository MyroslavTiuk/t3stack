import { OptionType, Position } from "optionscout-database";
import {
  calculateCashSecuredPut,
  type CalculateCollateral,
  calculateCoveredStrangle,
  calculateIronCondor,
  calculateNakedCall,
  calculateNakedPut,
  calculateShortCallButterfly,
  calculateShortCallSpread,
  calculateShortPutButterfly,
  calculateShortPutSpread,
  calculateShortStraddle,
  calculateShortStrangle,
} from "@utils/calculateProfitEstimates/calculateCollateral";

type Description = {
  [strategy in Strategy]: string;
};

export const strategyDescriptions: Description = {
  ["covered-call"]: `The covered call strategy has a setup of buying (or already owning) 100 shares of stock and sell 1 call option, typically out of the money. This is a slightly bullish strategy that allows the investor collect income from holding a position. The further out of the money for the write call, is a more bullish sentiment, but collecting less income. It’s popular to sell covered calls with a 1 week to 45 days until expiration`,
  ["long-call"]: `The long call options strategy has a setup of buying 1 call option, further out of the money the option, will have more extrinsic value and typically a higher risk. The setup can be in the money or out the money. The breakeven is the strike price + the stock price. This strategy is riskier than just buying stock, but also leverage, thus may have a higher possible return. This is a very bullish strategy.`,
  ["cash-secured-put"]: `The cash secured put strategy has a setup of selling 1 put contract, typically out of the money. Investors can utilize this strategy as an alternative to buying the stock, transition to dollar cost averaging, or just collecting income. The further out of the money is a more bearish sentiment. This has a higher probability of profit, than just owning stock.`,
  ["long-call-spread"]: `The long call spread strategy has a setup of buying 1 call option, and selling one call option. Typically the long call is at the money or slightly in the money, while the write call is out the money If this strategy is conducted with a net debit, then it is a true long call spread, if it is a net credit, then it is actually a short call spread. This strategy is a bullish strategy, and also is in the category of a vertical spread. The maximum profit is the difference between the two strike prices.`,
  ["poor-mans-covered-call"]: ` The poor mans covered call is a leveraged covered call play. The only difference (and thus why it’s called poor mans) is because instead of buying stock, which may be expensive, you just buy a cheaper in the money call option.
  Poor mans covered call may have a higher ROI due to the leverage, but also has added risks. 
  The setup is simple, buy 1 in the money call option, and sell 1 out of the money call option. The long call will be a longer dated expiration, this could be a few weeks, up to being a LEAP.`,
  ["synthetic-call"]: `A synthetic call strategy setup is owning equity, while buying an at the money put. This simulates an unlimited upside and a limited downside, just like a call option.`,
  ["short-put-spread"]: `The short put spread has a setup of selling a naked put and buying one long put. This can be seen as massively reducing your maximum risk on a cash secured put strategy. The difference between a CSP and a short put spread is, your risk is limited to the difference in the strikes and your max profit is reduced by the price you pay for the long put option. This is a slightly bullish strategy that uses risk management.`,
  ["call-ratio-back-spread"]: `The call ratio back spread options strategy has a setup of buying two call options otm with the same strike price, and selling one at the money or in the money call option. This is an advanced strategy that has a low chance of profit, typically an investor will execute this strategy on a high iv stock and is also very bullish`,
  ["long-call-butterfly"]: `The long call butterfly strategy has a setup purchasing 2 call options, 1 in the money and 1 out the money, while selling 2 at the money call options with the same strike price. 
  This strategy has limited upside and also limited risk, the max profit is the difference between the short strike and the itm long strike, plus the cost of the trade.`,
  ["short-put-butterfly"]: `The short put butterfly strategy has a setup selling 2 put options, 1 in the money and 1 out the money, while purchasing 2 at the money put options with the same strike price. 
  This strategy is just like the short call butterfly, but with puts. 
  This strategy has limited upside and also limited risk, this strategy is unique has it can profit while the stock goes up or down, but max risk is if stock stays at the strike of the 2 long put options.
  The max profit is the net credit received.`,
  ["naked-put"]: `The naked put strategy has a setup of selling 1 put option, typically out of the money. The only difference between a cash secured put and a naked put, is a NP you are using collateral. A NP will always have a higher ROI than a CSP due to the collateral calculation (unless the stock cannot use margin).`,
  ["long-put-spread"]: `A long put spread has a setup of purchasing one put option and selling a further out of the money put option. This is a bearish trade and cheaper to execute than a long put due to the short put sold. For this strategy to be true long put spread, then it needs to be executed with a net debit, if it is a net credit than it is a short put spread instead..`,
  ["reverse-covered-call"]: `A reversed covered call, also known as a covered put. Has a setup of shorting a stock and selling an out the money put. This is a slightly bearish strategy, that has unlimited loss and less max profit than just shorting the stock.`,
  ["short-call-spread"]: `A short call spread has a setup of selling 1 call option, generally out the money and buying 1 call option further out the money. For this to be a true short call spread, it is executed with a net credit. If it is a net debit, then it's a long call spread.
  A trader will implement this strategy if they are bearish on the stock, but want to limit their max risk because if they were to not buy the call option, then this would be a naked call, that has max risk to be unlimited.`,
  ["short-call-butterfly"]: ` The short call butterfly strategy has a setup selling 2 call options, 1 in the money and 1 out the money, while purchasing 2 at the money call options with the same strike price. 
  This strategy has limited upside and also limited risk, this strategy is unique has it can profit while the stock goes up or down, but max risk is if stock stays at the strike of the 2 long call options.
  The max profit is the net credit received.`,
  ["long-put-butterfly"]: `The long put butterfly strategy has a setup purchasing 2 put options, 1 in the money and 1 out the money, while selling 2 at the money put options with the same strike price. 
  This strategy is just like the long call butterfly, but with puts. 
  This strategy has limited upside and also limited risk, the max profit is the difference between the short strike and the itm long strike, plus the cost of the trade.`,
  ["long-put"]: `A long put has a setup of purchasing 1 put. This is a simple trade and has a bearish sentiment. The breakeven is the strike price minus the option price.`,
  ["long-put-calendar-spread"]: `Options strategies labeled as calendar spreads, simply mean you are execute a spread, but with contracts at the same strike price but with different expirations. For this example, a long put calendar spread is purchasing 1 long put with a further expiration date and selling 1 short put.`,
  ["naked-call"]: `A naked call strategy has a setup of selling 1 call, typically out of the money. This strategy has a higher probability the further out the money. This can be an alternative to shorting a stock, especially on stocks that cannot be shorted. This a very bearish strategy with limited gain and maximum risk, so use with caution (just like any strategy).`,
  ["synthetic-put"]: `A synthetic put has a setup of shorting a stock and buying an at the money call option. Generally an investor will do this with a long term bearish out look, but a short term bullish outlook. This is an alternative to a long put because it has capped risk and similar maximum profit as a long put.`,
  ["long-put-diagonal-spread"]: `Option strategies labeled as diagonal spreads, are similar to a calendar spread, but instead of having the same strike they have difference strike prices. A Long Put Diagonal spread has a setup of purchasing 1 put with a further out expiration date and selling a put with a different strike price`,
  ["long-call-diagonal-spread"]: `Option strategies labeled as diagonal spreads, are similar to a calendar spread, but instead of having the same strike they have difference strike prices. A poor man covered call is a type of long call diagonal spread. However the general setup for this strategy is purchasing 1 call at the money and selling a 1 short term call option `,
  ["long-call-calendar-spread"]: ` Options strategies labeled as calendar spreads, simply mean you are execute a spread, but with contracts at the same strike price but with different expirations. For this example, a long call calendar spread is purchasing 1 long call with a further expiration date and selling 1 short call.`,
  ["short-straddle"]: `A short straddle options strategy is the same as a short strangle, but the options have the same strike price. This setup involves selling both a call and a put.`,
  ["long-straddle"]: `A long straddle options strategy is the same as a long strangle, but the options have the same strike price. This setup involves buying both a call and put.`,
  ["covered-strangle"]: `A covered strangle is simply a covered call plus a cash secured put. The setup involves buying stock, selling a call, and selling a put. This strategy is a leveraged bullish bet, that an investors would implement with a stock that they believe will stay in a certain range, and want to collect income from that.`,
  ["short-strangle"]: `A short strangle options strategy is loved by traders looking to collect income. The setup involves selling a call and a put, out of the money. Generally the options will be out of the money at the same difference, but does not have to be. The max profit is achieve when both options expire worthless. This strategy has two break even points, and once the stock goes passed the break even points, then serious losses can occur.`,
  ["long-strangle"]: `A long strangle, is the inverse of a short strangle, the setup involves buying a call and a put, both out of the money. The out of the money value is generally the same for both options, and this strategy is best suited for investors who believe a large move in the stock either up or down. This strategy has two break even points, put strike minus the premium paid and the call strike plus the premium paid.`,
  ["married-put"]: `A married put, also referred to as insurance for options, is when you are buying a put at the current price of the stock or at your buy cost. This reduces risk and investors will use this strategy in times of short term bearish sentiment but long term bullish outlook.`,
  ["collar"]: `A collar strategy setup is similar to a covered strangle, but instead of selling a put, you are purchasing a put. The setup involves a owning stock, a protective put, and selling a call. It is simply a covered call, with purchasing a put. This is generally a neutral strategy. This strategy can be implemented with zero cost, if you sell the call for the same price you purchase the put. This strategy can be good with you are bullish, but feel like it could be good time to sell and also cap your downside loss.`,
  ["iron-condor"]: `An iron condor strategy has a setup of 1 of everything! 1 long call, 1 write call, 1 long put, and 1 write put. Generally the difference between the calls are the same as the difference between the puts, and also have the same difference between the current stock price. 
  For example, say AAPL is trading at 150, an iron condor could be 1 long call at 170, 1 write call at 160, 1 long put at 130 and 1 write put at 140.`,
  ["iron-butterfly"]: `The difference between  Iron Condor and the Iron Butterfly strategy is the short options are at the same strike price and generally at the money.
An Iron Butterfly involves the same strategy as an iron condor  consisting of two puts (one long and one short) and two calls (one long and one short), but with 3 strike price, and all with the same expiry. Investors will utilize this strategy in times of low volatile.`,
  ["long-combo"]: `Long combo is a bullish strategy that involves a bull naked or cash secured put and long call option. The act of selling a put can be seen as lower your cost on the trade, but also increasing risk as your max loss is increased. The write put and long call are generally at the same strike price, but you can make the trade more bullish by buying further OTM or more bearish by selling further otm put. `,
  ["short-combo"]: `Short combo is a bearish strategy that involves a writing bear naked call a long put option. If the stock goes down, you'll be making more than just by selling a naked call or just buying a put. By choosing ATM strike prices for both contracts you'll be simulating a short stock position`,
  ["strip"]: `The strips options trading strategy is a bearish to somewhat neutral strategy that is betting on a uptick in Volatility. A trader can profit from a large drop in the stock and losses can be covered or potential made with a large increase.
The strategy involves 1 long call ATM and 2 long puts ATM`,
  ["strap"]: `The Strap Options strategy is the reverse of the strip strategy. It is a bullish to neutral strategy that, just like the strip, is betting on an uptick in volatility.
The The strategy involves 2 long call and 1 long puts, all atm.`,
  ["guts"]: `A guts strategy involves a long or short ITM call and put. A long guts strategy setup is long 1 itm put and 1 long itm call. Similar to a strangle, guts are an advanced strategy where investors are certain the stock will move significantly either up or down.`,
  ["call-ratio-spread"]: `This strategy involves buying 1 OTM or at-the-money call option, while also selling two further OTM call options.`,
  ["put-ratio-spread"]: `This strategy involves buying 1 OTM or at-the-money put option, while also selling two further OTM put options.`,
  ["1x2-ratio-volatility-spread-with-calls"]: `This strategy involves selling 1 itm or at-the-money call option, while also buying two OTM call options.`,
  ["1x2-ratio-volatility-spread-with-puts"]: `This strategy involves selling 1 itm or at-the-money put option, while also buying two OTM put options.`,
  ["jade-lizard"]: `Jade Lizard has a trading setup of selling 1 otm put, buying 1 long call otm and also selling 1 further otm call. The idea of a jaded lizard is to have no upside risk by selecting the write otm call and put.`,
  ["reverse-jade-lizard"]: `Reverse Jade Lizard has a trading setup of selling 1 otm call, buying 1 long put otm and also selling 1 further put call.`,
  ["long-put-ladder"]: `The long put ladder is a 3 legged strategy has a setup of buying 1 in the money put, selling 1 at the money put and selling 1 out the money put.`,
  ["short-put-ladder"]: `The short put ladder is a 3 legged strategy has a setup of selling 1 in the money put, buying 1 at the money put and buying 1 out the money put.`,
  ["long-call-ladder"]: `The long call ladder is a 3 legged strategy has a setup of buying 1 in the money call, selling 1 at the money call and selling 1 out the money call.`,
  ["short-call-ladder"]: `The short call ladder is a 3 legged strategy has a setup of selling 1 in the money call, buying 1 at the money call and buying 1 out the money call.`,
  ["reverse-iron-butterfly"]: `
The reverse iron butterfly has a setup of selling 1 otm put and 1 otm call, while buying 1 atm put and 1 atm call.
This trade will be a net debit, which is where the reverse comes from, as an iron condor is typically a net credit.  `,
  ["reverse-iron-condor"]: `A reverse iron condor has 4 legs in the setup, 1 long call otm and 1 short call further otm (long call spread) and 1 long put otm and 1 short put further otm (long put spread).`,
  ["long-call-condor-spread"]: `The long call condor spread has a trading setup of buying 1 itm call, selling 1 atm or lesser itm call, selling 1 atm or slightly otm call, and buying 1 otm call. This is a net debit and essentially two long call spreads stacked vertically to each other.`,
  ["long-put-condor-spread"]: `The long put condor spread has a trading setup of buying 1 itm put, selling 1 atm or lesser itm put, selling 1 atm or slightly otm put, and buying 1 otm put. This is a net debit and essentially two long put spreads stacked vertically to each other.`,
  ["skip-strike-call-butterfly"]: `A skip strike butterfly sounds complicated, but it really is just stretching out the contracts for different strikes. The skip strike call butterfly has a setup of buying 1 long call, selling 2 otm calls, and buying another call, but far out of the money.`,
  ["skip-strike-put-butterfly"]: `The basis of skipping a strike just refers to one of your strikes being unequal in distance for the skip strike put butterfly the trade has a setup of buying 1 otm put, selling two otm puts (but less otm than the first long put), then 1 closer to at the money long put.`,
  ["reverse-skip-strike-call-butterfly"]: `A skip strike butterfly sounds complicated, but it really is just stretching out the contracts for different strikes. An inverse, sounds complicated as well, but in this case the only difference between this and the regular is you are swapping the strikes where you would write and buy.
So the reverse skip strike call butterfly has a setup of selling 1 call, buying 2 otm calls, and selling another call, but far out of the money.`,
  ["reverse-skip-strike-put-butterfly"]: `The basis of skipping a strike just refers to one of your strikes being unequal in distance. The idea of inverse (or reverse) is referring to swapping the long & write strategy for the contracts. So for the reverse skip strike put butterfly the trade has a setup of  selling 1 otm put, buying two otm puts (but less otm than the first long put), then 1 closer to at the money sell (write) put.`,
  ["christmas-tree-call-butterfly"]: `The Christmas tree strategies include a whopping 6 legs! For The Christmas Tree Call Butterfly the setup has 1 long call, roughly at the money, then sell 3 calls out of the money, and buy two more calls very far out of the money.`,
  ["christmas-tree-put-butterfly"]: `The Christmas tree strategies include a whopping 6 legs! For The Christmas Tree Call Butterfly the setup has 1 long puts, roughly at the money, then sell 3 puts out of the money, and buy two more puts very far out of the money.`,
  ["front-call-spread"]: `The front call spread has a slightly bullish sentiment, this strategy sometimes is known as the ratio vertical spread, but includes buying a call at roughly at the money and selling two calls out of the money. You are hoping the stock increases in price, but not too much because the short calls gives unlimited risk, while you are most likely profitable on the down side as long as the trade is a net credit. .`,
  ["front-put-spread"]: `The front put spread has an inverse payoff direction at the front call spread counterpart, if the trade is set with a net credit, then if the stock moons you are looking at a slight profit, if the stock tanks you are looking at a big loss, and your max profit will be at wherever you choose to sell the two puts. Here is the setup, sell 2 out of the money puts, and buy 1 roughly at the money put. .`,
  ["call-zebra"]: `The ZEBRA options trading strategy stands for Zero Extrinsic Value Back Ratio (typically the 'value' is left out because that won't make the cute zebra short name), if you are unfamiliar with extrinsic value, with options there is intrinsic and extrinsic value. Intrinsic value represents the value from exercising in the money. and the extrinsic is all the other value! The call zebra strategy has the following setup long 2 in the money calls and sell 1 atm calls. `,
  ["put-zebra"]: `The ZEBRA options trading strategy stands for Zero Extrinsic Value Back Ratio (typically the 'value' is left out because that won't make the cute zebra short name), if you are unfamiliar with extrinsic value, with options there is intrinsic and extrinsic value. Intrinsic value represents the value from exercising in the money. and the extrinsic is all the other value! The put zebra strategy has the following setup long 2 in the money puts and sell 1 atm puts.`,
  ["short-guts"]: `A short guts strategy has a setup of selling 1 in the money call and selling 1 in the money put, an investor certain about low volatile would make this trade, as this is a high probability play, but can have high max losses if the stock goes aggressive in either direction.`,
  ["short-call-condor"]: `The short call condor strategy has a setup of selling two calls, one with a low strike and 1 with a high, then buying 2 calls in between. Generally both the calls are the same difference between it's high and low write calls.`,
  ["short-put-condor"]: `The short put condor strategy has a setup of selling two puts, one with a low strike and 1 with a high, then buying 2 puts in between. Generally both the puts are the same difference between it's high and low write puts.`,
  ["double-diagonal"]: `The double in double diagonal refers to trading both calls and puts and the diagonal is to two expiration dates. Think of this as both a diagonal call spread and a diagonal put spread, or you can place this as a calendar as well. The setup follows as buying 1 out of the money call and put with a longer dated expiry and selling  1 out of the money call and strike with a shorted dated expiry.`,
  ["custom"]: "Build your own strategy",
};

export enum strategyNames {
  "covered-call" = "Covered Call",
  "long-call" = "Long Call",
  "cash-secured-put" = "Cash Secured Put",
  "long-call-spread" = "Long Call Spread",
  "poor-mans-covered-call" = "Poor Man's Covered Call",
  "synthetic-call" = "Synthetic Call",
  "short-put-spread" = "Short Put Spread",
  "call-ratio-back-spread" = "Call Ratio Back Spread",
  "long-call-butterfly" = "Long Call Butterfly",
  "short-put-butterfly" = "Short Put Butterfly",
  "naked-put" = "Naked Put",
  "long-put-spread" = "Long Put Spread",
  "reverse-covered-call" = "Reverse Covered Call",
  "short-call-spread" = "Short Call Spread",
  "short-call-butterfly" = "Short Call Butterfly",
  "long-put-butterfly" = "Long Put Butterfly",
  "long-put" = "Long Put",
  "long-put-calendar-spread" = "Long Put Calendar Spread",
  "naked-call" = "Naked Call",
  "synthetic-put" = "Synthetic Put",
  "long-put-diagonal-spread" = "Long Put Diagonal Spread",
  "long-call-diagonal-spread" = "Long Call Diagonal Spread",
  "long-call-calendar-spread" = "Long Call Calendar Spread",
  "short-straddle" = "Short Straddle",
  "long-straddle" = "Long Straddle",
  "covered-strangle" = "Covered Strangle",
  "short-strangle" = "Short Strangle",
  "long-strangle" = "Long Strangle",
  "married-put" = "Married Put",
  "collar" = "Collar",
  "iron-condor" = "Iron Condor",
  "iron-butterfly" = "Iron Butterfly",
  "long-combo" = "Long Combo",
  "short-combo" = "Short Combo",
  "strip" = "Strip",
  "strap" = "Strap",
  "guts" = "Guts",
  "call-ratio-spread" = "Call Ratio Spread",
  "put-ratio-spread" = "Put Ratio Spread",
  "1x2-ratio-volatility-spread-with-calls" = "1x2 Ratio Volatility Spread With Calls",
  "1x2-ratio-volatility-spread-with-puts" = "1x2 Ratio Volatility Spread With Puts",
  "jade-lizard" = "Jade Lizard",
  "reverse-jade-lizard" = "Reverse Jade Lizard",
  "long-put-ladder" = "Long Put Ladder",
  "short-put-ladder" = "Short Put Ladder",
  "long-call-ladder" = "Long Call Ladder",
  "short-call-ladder" = "Short Call Ladder",
  "reverse-iron-condor" = "Reverse Iron Condor",
  "reverse-iron-butterfly" = "Reverse Iron Butterfly",
  "long-call-condor-spread" = "Long Call Condor Spread",
  "long-put-condor-spread" = "Long Put Condor Spread",
  "skip-strike-call-butterfly" = "Skip Strike Call Butterfly",
  "skip-strike-put-butterfly" = "Skip Strike Put Butterfly",
  "reverse-skip-strike-call-butterfly" = "Reverse Skip Strike Call Butterfly",
  "reverse-skip-strike-put-butterfly" = "Reverse Skip Strike Put Butterfly",
  "christmas-tree-call-butterfly" = "Christmas Tree Call Butterfly",
  "christmas-tree-put-butterfly" = "Christmas Tree Put Butterfly",
  "front-call-spread" = "Front Call Spread",
  "front-put-spread" = "Front put Spread",
  "call-zebra" = "Call Zebra",
  "put-zebra" = "Put Zebra",
  "short-guts" = "Short Guts",
  "short-call-condor" = "Short Call Condor",
  "short-put-condor" = "Short Put Condor",
  "double-diagonal" = "Double Diagonal",
  "custom" = "Custom",
}

export type Strategy = keyof typeof strategyNames;

export const scannerStrategies: Strategy[] = [
  "covered-call",
  "long-call",
  "cash-secured-put",
  "long-put",
  "naked-put",
  "naked-call",
  "long-call-spread",
  "short-call-spread",
  "long-put-spread",
  "short-put-spread",
  "iron-condor",
  "long-call-butterfly",
  "short-put-butterfly",
  "short-call-butterfly",
  "long-put-butterfly",
  "short-strangle",
  "long-strangle",
  "short-straddle",
  "long-straddle",
  "covered-strangle",
];

export type StrategyConfig = {
  legs: StrategyLeg[]; // Should be the same order as in data-loader/load_options/flow/strategies/trades.py
  equity?: Position;
  calendar?: boolean;
  calculateCollateral?: (input: CalculateCollateral) => number;
};

export type StrategyLeg = {
  optionType: OptionType;
  position: Position;
  multiplier: number;
};

export const strategyConfigs: { [strategy in Strategy]: StrategyConfig } = {
  "covered-call": {
    legs: [
      { optionType: OptionType.Call, position: Position.Short, multiplier: 1 },
    ],
    equity: Position.Long,
  },
  "long-call": {
    legs: [
      { optionType: OptionType.Call, position: Position.Long, multiplier: 1 },
    ],
  },
  "cash-secured-put": {
    legs: [
      { optionType: OptionType.Put, position: Position.Short, multiplier: 1 },
    ],
    calculateCollateral: calculateCashSecuredPut,
  },
  "long-call-spread": {
    legs: [
      { optionType: OptionType.Call, position: Position.Long, multiplier: 1 },
      { optionType: OptionType.Call, position: Position.Short, multiplier: 1 },
    ],
  },
  "poor-mans-covered-call": {
    legs: [
      { optionType: OptionType.Call, position: Position.Short, multiplier: 1 },
    ],
  },
  "synthetic-call": {
    legs: [
      { optionType: OptionType.Put, position: Position.Long, multiplier: 1 },
    ],
    equity: Position.Long,
  },
  "short-put-spread": {
    legs: [
      { optionType: OptionType.Put, position: Position.Short, multiplier: 1 },
      { optionType: OptionType.Put, position: Position.Long, multiplier: 1 },
    ],
    calculateCollateral: calculateShortPutSpread,
  },
  "call-ratio-back-spread": {
    legs: [
      { optionType: OptionType.Call, position: Position.Short, multiplier: 1 },
      { optionType: OptionType.Call, position: Position.Long, multiplier: 2 },
    ],
  },
  "long-call-butterfly": {
    legs: [
      { optionType: OptionType.Call, position: Position.Long, multiplier: 1 },
      { optionType: OptionType.Call, position: Position.Short, multiplier: 2 },
      { optionType: OptionType.Call, position: Position.Long, multiplier: 1 },
    ],
  },
  "short-put-butterfly": {
    legs: [
      { optionType: OptionType.Put, position: Position.Short, multiplier: 1 },
      { optionType: OptionType.Put, position: Position.Long, multiplier: 2 },
      { optionType: OptionType.Put, position: Position.Short, multiplier: 1 },
    ],
    calculateCollateral: calculateShortPutButterfly,
  },
  "naked-put": {
    legs: [
      { optionType: OptionType.Put, position: Position.Short, multiplier: 1 },
    ],
    calculateCollateral: calculateNakedPut,
  },
  "long-put-spread": {
    legs: [
      { optionType: OptionType.Put, position: Position.Long, multiplier: 1 },
      { optionType: OptionType.Put, position: Position.Short, multiplier: 1 },
    ],
  },
  "reverse-covered-call": {
    legs: [
      { optionType: OptionType.Put, position: Position.Short, multiplier: 1 },
    ],
    equity: Position.Short,
  },
  "short-call-spread": {
    legs: [
      { optionType: OptionType.Call, position: Position.Short, multiplier: 1 },
      { optionType: OptionType.Call, position: Position.Long, multiplier: 1 },
    ],
    calculateCollateral: calculateShortCallSpread,
  },
  "short-call-butterfly": {
    legs: [
      { optionType: OptionType.Call, position: Position.Short, multiplier: 1 },
      { optionType: OptionType.Call, position: Position.Long, multiplier: 2 },
      { optionType: OptionType.Call, position: Position.Short, multiplier: 1 },
    ],
    calculateCollateral: calculateShortCallButterfly,
  },
  "long-put-butterfly": {
    legs: [
      { optionType: OptionType.Put, position: Position.Long, multiplier: 1 },
      { optionType: OptionType.Put, position: Position.Short, multiplier: 2 },
      { optionType: OptionType.Put, position: Position.Long, multiplier: 1 },
    ],
  },
  "long-put": {
    legs: [
      { optionType: OptionType.Put, position: Position.Long, multiplier: 1 },
    ],
  },
  "long-put-calendar-spread": {
    legs: [
      { optionType: OptionType.Put, position: Position.Long, multiplier: 1 },
      { optionType: OptionType.Put, position: Position.Short, multiplier: 1 },
    ],
    calendar: true,
  },
  "naked-call": {
    legs: [
      { optionType: OptionType.Call, position: Position.Short, multiplier: 1 },
    ],
    calculateCollateral: calculateNakedCall,
  },
  "synthetic-put": {
    legs: [
      { optionType: OptionType.Call, position: Position.Long, multiplier: 1 },
    ],
    equity: Position.Short,
  },
  "long-put-diagonal-spread": {
    legs: [
      { optionType: OptionType.Put, position: Position.Long, multiplier: 1 },
      { optionType: OptionType.Put, position: Position.Short, multiplier: 1 },
    ],
    calendar: true,
  },
  "long-call-diagonal-spread": {
    legs: [
      { optionType: OptionType.Call, position: Position.Long, multiplier: 1 },
      { optionType: OptionType.Call, position: Position.Short, multiplier: 1 },
    ],
    calendar: true,
  },
  "long-call-calendar-spread": {
    legs: [
      { optionType: OptionType.Call, position: Position.Long, multiplier: 1 },
      { optionType: OptionType.Call, position: Position.Short, multiplier: 1 },
    ],
    calendar: true,
  },
  "short-straddle": {
    legs: [
      { optionType: OptionType.Call, position: Position.Short, multiplier: 1 },
      { optionType: OptionType.Put, position: Position.Short, multiplier: 1 },
    ],
    calculateCollateral: calculateShortStraddle,
  },
  "long-straddle": {
    legs: [
      { optionType: OptionType.Call, position: Position.Long, multiplier: 1 },
      { optionType: OptionType.Put, position: Position.Long, multiplier: 1 },
    ],
  },
  "covered-strangle": {
    legs: [
      { optionType: OptionType.Call, position: Position.Short, multiplier: 1 },
      { optionType: OptionType.Put, position: Position.Short, multiplier: 1 },
    ],
    equity: Position.Long,
    calculateCollateral: calculateCoveredStrangle,
  },
  "short-strangle": {
    legs: [
      { optionType: OptionType.Call, position: Position.Short, multiplier: 1 },
      { optionType: OptionType.Put, position: Position.Short, multiplier: 1 },
    ],
    calculateCollateral: calculateShortStrangle,
  },
  "long-strangle": {
    legs: [
      { optionType: OptionType.Call, position: Position.Long, multiplier: 1 },
      { optionType: OptionType.Put, position: Position.Long, multiplier: 1 },
    ],
  },
  "married-put": {
    legs: [
      { optionType: OptionType.Put, position: Position.Long, multiplier: 1 },
    ],
    equity: Position.Long,
  },
  collar: {
    legs: [
      { optionType: OptionType.Call, position: Position.Short, multiplier: 1 },
      { optionType: OptionType.Put, position: Position.Long, multiplier: 1 },
    ],
    equity: Position.Long,
  },
  "iron-condor": {
    legs: [
      { optionType: OptionType.Put, position: Position.Long, multiplier: 1 },
      { optionType: OptionType.Put, position: Position.Short, multiplier: 1 },
      { optionType: OptionType.Call, position: Position.Short, multiplier: 1 },
      { optionType: OptionType.Call, position: Position.Long, multiplier: 1 },
    ],
    calculateCollateral: calculateIronCondor,
  },
  "iron-butterfly": {
    legs: [
      { optionType: OptionType.Put, position: Position.Long, multiplier: 1 },
      { optionType: OptionType.Put, position: Position.Short, multiplier: 1 },
      { optionType: OptionType.Call, position: Position.Short, multiplier: 1 },
      { optionType: OptionType.Call, position: Position.Long, multiplier: 1 },
    ],
    calculateCollateral: calculateIronCondor,
  },
  "long-combo": {
    legs: [
      { optionType: OptionType.Call, position: Position.Long, multiplier: 1 },
      { optionType: OptionType.Put, position: Position.Short, multiplier: 1 },
    ],
  },
  "short-combo": {
    legs: [
      { optionType: OptionType.Call, position: Position.Short, multiplier: 1 },
      { optionType: OptionType.Put, position: Position.Long, multiplier: 1 },
    ],
  },
  strip: {
    legs: [
      { optionType: OptionType.Call, position: Position.Long, multiplier: 1 },
      { optionType: OptionType.Put, position: Position.Long, multiplier: 2 },
    ],
  },
  strap: {
    legs: [
      { optionType: OptionType.Call, position: Position.Long, multiplier: 2 },
      { optionType: OptionType.Put, position: Position.Long, multiplier: 1 },
    ],
  },
  guts: {
    legs: [
      { optionType: OptionType.Call, position: Position.Long, multiplier: 2 },
      { optionType: OptionType.Put, position: Position.Long, multiplier: 1 },
    ],
  },
  "call-ratio-spread": {
    legs: [
      { optionType: OptionType.Call, position: Position.Short, multiplier: 2 },
      { optionType: OptionType.Call, position: Position.Long, multiplier: 1 },
    ],
  },
  "put-ratio-spread": {
    legs: [
      { optionType: OptionType.Put, position: Position.Long, multiplier: 1 },
      { optionType: OptionType.Put, position: Position.Short, multiplier: 2 },
    ],
  },
  "1x2-ratio-volatility-spread-with-calls": {
    legs: [
      { optionType: OptionType.Call, position: Position.Short, multiplier: 1 },
      { optionType: OptionType.Call, position: Position.Long, multiplier: 2 },
    ],
  },
  "1x2-ratio-volatility-spread-with-puts": {
    legs: [
      { optionType: OptionType.Put, position: Position.Short, multiplier: 1 },
      { optionType: OptionType.Put, position: Position.Long, multiplier: 2 },
    ],
  },
  "jade-lizard": {
    legs: [
      { optionType: OptionType.Call, position: Position.Short, multiplier: 1 },
      { optionType: OptionType.Call, position: Position.Long, multiplier: 1 },
      { optionType: OptionType.Put, position: Position.Short, multiplier: 1 },
    ],
  },
  "long-put-ladder": {
    legs: [
      { optionType: OptionType.Put, position: Position.Long, multiplier: 1 },
      { optionType: OptionType.Put, position: Position.Short, multiplier: 1 },
      { optionType: OptionType.Put, position: Position.Short, multiplier: 1 },
    ],
  },
  "short-put-ladder": {
    legs: [
      { optionType: OptionType.Put, position: Position.Short, multiplier: 1 },
      { optionType: OptionType.Put, position: Position.Long, multiplier: 1 },
      { optionType: OptionType.Put, position: Position.Long, multiplier: 1 },
    ],
  },
  "long-call-ladder": {
    legs: [
      { optionType: OptionType.Call, position: Position.Long, multiplier: 1 },
      { optionType: OptionType.Call, position: Position.Short, multiplier: 1 },
      { optionType: OptionType.Call, position: Position.Short, multiplier: 1 },
    ],
  },
  "short-call-ladder": {
    legs: [
      { optionType: OptionType.Call, position: Position.Short, multiplier: 1 },
      { optionType: OptionType.Call, position: Position.Long, multiplier: 1 },
      { optionType: OptionType.Call, position: Position.Long, multiplier: 1 },
    ],
  },
  "reverse-jade-lizard": {
    legs: [
      { optionType: OptionType.Call, position: Position.Short, multiplier: 1 },
      { optionType: OptionType.Put, position: Position.Long, multiplier: 1 },
      { optionType: OptionType.Put, position: Position.Short, multiplier: 1 },
    ],
  },
  "reverse-iron-butterfly": {
    legs: [
      { optionType: OptionType.Put, position: Position.Short, multiplier: 1 },
      { optionType: OptionType.Put, position: Position.Long, multiplier: 1 },
      { optionType: OptionType.Call, position: Position.Long, multiplier: 1 },
      { optionType: OptionType.Call, position: Position.Short, multiplier: 1 },
    ],
  },
  "reverse-iron-condor": {
    legs: [
      { optionType: OptionType.Put, position: Position.Short, multiplier: 1 },
      { optionType: OptionType.Put, position: Position.Long, multiplier: 1 },
      { optionType: OptionType.Call, position: Position.Long, multiplier: 1 },
      { optionType: OptionType.Call, position: Position.Short, multiplier: 1 },
    ],
  },
  "long-call-condor-spread": {
    legs: [
      { optionType: OptionType.Call, position: Position.Long, multiplier: 1 },
      { optionType: OptionType.Call, position: Position.Short, multiplier: 1 },
      { optionType: OptionType.Call, position: Position.Short, multiplier: 1 },
      { optionType: OptionType.Call, position: Position.Long, multiplier: 1 },
    ],
  },
  "long-put-condor-spread": {
    legs: [
      { optionType: OptionType.Put, position: Position.Long, multiplier: 1 },
      { optionType: OptionType.Put, position: Position.Short, multiplier: 1 },
      { optionType: OptionType.Put, position: Position.Short, multiplier: 1 },
      { optionType: OptionType.Put, position: Position.Long, multiplier: 1 },
    ],
  },
  "skip-strike-call-butterfly": {
    legs: [
      { optionType: OptionType.Call, position: Position.Long, multiplier: 1 },
      { optionType: OptionType.Call, position: Position.Short, multiplier: 2 },
      { optionType: OptionType.Call, position: Position.Long, multiplier: 1 },
    ],
  },
  "skip-strike-put-butterfly": {
    legs: [
      { optionType: OptionType.Put, position: Position.Long, multiplier: 1 },
      { optionType: OptionType.Put, position: Position.Short, multiplier: 2 },
      { optionType: OptionType.Put, position: Position.Long, multiplier: 1 },
    ],
  },
  "reverse-skip-strike-call-butterfly": {
    legs: [
      { optionType: OptionType.Call, position: Position.Short, multiplier: 1 },
      { optionType: OptionType.Call, position: Position.Long, multiplier: 2 },
      { optionType: OptionType.Call, position: Position.Short, multiplier: 1 },
    ],
  },
  "reverse-skip-strike-put-butterfly": {
    legs: [
      { optionType: OptionType.Put, position: Position.Short, multiplier: 1 },
      { optionType: OptionType.Put, position: Position.Long, multiplier: 2 },
      { optionType: OptionType.Put, position: Position.Short, multiplier: 1 },
    ],
  },
  "christmas-tree-call-butterfly": {
    legs: [
      { optionType: OptionType.Call, position: Position.Long, multiplier: 1 },
      { optionType: OptionType.Call, position: Position.Short, multiplier: 3 },
      { optionType: OptionType.Call, position: Position.Long, multiplier: 1 },
      { optionType: OptionType.Call, position: Position.Long, multiplier: 1 },
    ],
  },
  "christmas-tree-put-butterfly": {
    legs: [
      { optionType: OptionType.Put, position: Position.Long, multiplier: 1 },
      { optionType: OptionType.Put, position: Position.Short, multiplier: 3 },
      { optionType: OptionType.Put, position: Position.Long, multiplier: 1 },
      { optionType: OptionType.Put, position: Position.Long, multiplier: 1 },
    ],
  },
  "front-call-spread": {
    legs: [
      { optionType: OptionType.Call, position: Position.Long, multiplier: 1 },
      { optionType: OptionType.Call, position: Position.Short, multiplier: 2 },
    ],
  },
  "front-put-spread": {
    legs: [
      { optionType: OptionType.Put, position: Position.Long, multiplier: 1 },
      { optionType: OptionType.Put, position: Position.Short, multiplier: 2 },
    ],
  },
  "call-zebra": {
    legs: [
      { optionType: OptionType.Call, position: Position.Long, multiplier: 2 },
      { optionType: OptionType.Call, position: Position.Short, multiplier: 1 },
    ],
  },
  "put-zebra": {
    legs: [
      { optionType: OptionType.Put, position: Position.Long, multiplier: 2 },
      { optionType: OptionType.Put, position: Position.Short, multiplier: 1 },
    ],
  },

  "short-guts": {
    legs: [
      { optionType: OptionType.Call, position: Position.Short, multiplier: 1 },
      { optionType: OptionType.Put, position: Position.Short, multiplier: 1 },
    ],
  },
  "short-call-condor": {
    legs: [
      { optionType: OptionType.Call, position: Position.Short, multiplier: 1 },
      { optionType: OptionType.Call, position: Position.Long, multiplier: 1 },
      { optionType: OptionType.Call, position: Position.Long, multiplier: 1 },
      { optionType: OptionType.Call, position: Position.Short, multiplier: 1 },
    ],
  },
  "short-put-condor": {
    legs: [
      { optionType: OptionType.Put, position: Position.Short, multiplier: 1 },
      { optionType: OptionType.Put, position: Position.Long, multiplier: 1 },
      { optionType: OptionType.Put, position: Position.Long, multiplier: 1 },
      { optionType: OptionType.Put, position: Position.Short, multiplier: 1 },
    ],
  },
  "double-diagonal": {
    legs: [
      { optionType: OptionType.Call, position: Position.Long, multiplier: 1 },
      { optionType: OptionType.Put, position: Position.Long, multiplier: 1 },
      { optionType: OptionType.Call, position: Position.Short, multiplier: 1 },
      { optionType: OptionType.Put, position: Position.Short, multiplier: 1 },
    ],
    calendar: true,
  },
  custom: {
    legs: [],
  },
};
