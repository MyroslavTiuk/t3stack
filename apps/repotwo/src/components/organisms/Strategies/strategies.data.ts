import { strategyNames, strategyDescriptions } from "@data/strategies.data";

export const popularStrategies = [
  {
    strategyName: strategyNames["long-call"],
    description: strategyDescriptions["long-call"],
    srcDark: "/pictures/StrategiesDarkMode/LongCall.svg",
    srcLight: "/pictures/StrategiesLightMode/LongCall.svg",
    href: "/option-calculator/long-call",
  },
  {
    strategyName: strategyNames["long-put"],
    description: strategyDescriptions["long-put"],
    srcDark: "/pictures/StrategiesDarkMode/LongPut.svg",
    srcLight: "/pictures/StrategiesLightMode/LongPut.svg",
    href: "/option-calculator/long-put",
  },
  {
    strategyName: strategyNames["covered-call"],
    description: strategyDescriptions["covered-call"],
    srcDark: "/pictures/StrategiesDarkMode/CoveredCall.svg",
    srcLight: "/pictures/StrategiesLightMode/CoveredCall.svg",
    href: "/option-calculator/covered-call",
  },
  {
    strategyName: strategyNames["long-call-spread"],
    description: strategyDescriptions["long-call-spread"],
    srcDark: "/pictures/StrategiesDarkMode/LongCallSpread.svg",
    srcLight: "/pictures/StrategiesLightMode/LongCallSpread.svg",
    href: "/option-calculator/long-call-spread",
  },

  {
    strategyName: strategyNames["short-call-spread"],
    description: strategyDescriptions["short-call-spread"],
    srcDark: "/pictures/StrategiesDarkMode/ShortCallSpread.svg",
    srcLight: "/pictures/StrategiesLightMode/ShortCallSpread.svg",
    href: "/option-calculator/short-call-spread",
  },
  {
    strategyName: strategyNames["short-put-spread"],
    description: strategyDescriptions["short-put-spread"],
    srcDark: "/pictures/StrategiesDarkMode/ShortPutSpread.svg",
    srcLight: "/pictures/StrategiesLightMode/ShortPutSpread.svg",
    href: "/option-calculator/short-put-spread",
  },
  {
    strategyName: strategyNames["long-put-spread"],
    description: strategyDescriptions["long-put-spread"],
    srcDark: "/pictures/StrategiesDarkMode/LongPutSpread.svg",
    srcLight: "/pictures/StrategiesLightMode/LongPutSpread.svg",
    href: "/option-calculator/long-put-spread",
  },
  {
    strategyName: strategyNames["cash-secured-put"],
    description: strategyDescriptions["cash-secured-put"],
    srcDark: "/pictures/StrategiesDarkMode/CashSecuredPut.svg",
    srcLight: "/pictures/StrategiesLightMode/CashSecuredPut.svg",
    href: "/option-calculator/cash-secured-put",
  },
  {
    strategyName: strategyNames["naked-put"],
    description: strategyDescriptions["naked-put"],
    srcDark: "/pictures/StrategiesDarkMode/NakedPut.svg",
    srcLight: "/pictures/StrategiesLightMode/NakedPut.svg",
    href: "/option-calculator/naked-put",
  },
  {
    strategyName: strategyNames["naked-call"],
    description: strategyDescriptions["naked-call"],
    srcDark: "/pictures/StrategiesDarkMode/NakedCall.svg",
    srcLight: "/pictures/StrategiesLightMode/NakedCall.svg",
    href: "/option-calculator/naked-call",
  },
  {
    strategyName: strategyNames["iron-condor"],
    description: strategyDescriptions["iron-condor"],
    srcDark: "/pictures/StrategiesDarkMode/IronCondor.svg",
    srcLight: "/pictures/StrategiesLightMode/IronCondor.svg",
    href: "/option-calculator/iron-condor",
  },

  {
    strategyName: strategyNames["long-straddle"],
    description: strategyDescriptions["long-straddle"],
    srcDark: "/pictures/StrategiesDarkMode/LongStraddle.svg",
    srcLight: "/pictures/StrategiesLightMode/LongStraddle.svg",
    href: "/option-calculator/long-straddle",
  },
  {
    strategyName: strategyNames["long-strangle"],
    description: strategyDescriptions["long-strangle"],
    srcDark: "/pictures/StrategiesDarkMode/LongStrangle.svg",
    srcLight: "/pictures/StrategiesLightMode/LongStrangle.svg",
    href: "/option-calculator/long-strangle",
  },
  {
    strategyName: strategyNames["short-straddle"],
    description: strategyDescriptions["short-straddle"],
    srcDark: "/pictures/StrategiesDarkMode/ShortStraddle.svg",
    srcLight: "/pictures/StrategiesLightMode/ShortStraddle.svg",
    href: "/option-calculator/short-straddle",
  },
  {
    strategyName: strategyNames["short-strangle"],
    description: strategyDescriptions["short-strangle"],
    srcDark: "/pictures/StrategiesDarkMode/ShortStrangle.svg",
    srcLight: "/pictures/StrategiesLightMode/ShortStrangle.svg",
    href: "/option-calculator/short-strangle",
  },
  {
    strategyName: strategyNames["poor-mans-covered-call"],
    description: strategyDescriptions["poor-mans-covered-call"],
    srcDark: "/pictures/StrategiesDarkMode/PoorMansCoveredCall.svg",
    srcLight: "/pictures/StrategiesLightMode/PoorMansCoveredCall.svg",
    href: "/option-calculator/poor-mans-covered-call",
  },
  {
    strategyName: strategyNames.collar,
    description: strategyDescriptions.collar,
    srcDark: "/pictures/StrategiesDarkMode/Collar.svg",
    srcLight: "/pictures/StrategiesLightMode/Collar.svg",
    href: "/option-calculator/collar",
  },

  {
    strategyName: strategyNames["long-call-calendar-spread"],
    description: strategyDescriptions["long-call-calendar-spread"],
    srcDark: "/pictures/StrategiesDarkMode/LongCallCalendarSpread.svg",
    srcLight: "/pictures/StrategiesLightMode/LongCallCalendarSpread.svg",
    href: "/option-calculator/long-call-calendar-spread",
  },
  {
    strategyName: strategyNames["long-put-calendar-spread"],
    description: strategyDescriptions["long-put-calendar-spread"],
    srcDark: "/pictures/StrategiesDarkMode/LongPutCalendarSpread.svg",
    srcLight: "/pictures/StrategiesLightMode/LongPutCalendarSpread.svg",
    href: "/option-calculator/long-put-calendar-spread",
  },
  {
    strategyName: strategyNames["long-call-diagonal-spread"],
    description: strategyDescriptions["long-call-diagonal-spread"],
    srcDark: "/pictures/StrategiesDarkMode/LongCallDiagonalSpread.svg",
    srcLight: "/pictures/StrategiesLightMode/LongCallDiagonalSpread.svg",
    href: "/option-calculator/long-call-diagonal-spread",
  },
  {
    strategyName: strategyNames["long-put-diagonal-spread"],
    description: strategyDescriptions["long-put-diagonal-spread"],
    srcDark: "/pictures/StrategiesDarkMode/LongPutDiagonalSpread.svg",
    srcLight: "/pictures/StrategiesLightMode/LongPutDiagonalSpread.svg",
    href: "/option-calculator/long-put-diagonal-spread",
  },
  {
    strategyName: strategyNames["double-diagonal"],
    description: strategyDescriptions["double-diagonal"],
    srcDark: "/pictures/StrategiesDarkMode/double-diagonal.svg",
    srcLight: "/pictures/StrategiesLightMode/double-diagonal.svg",
    href: "/option-calculator/double-diagonal",
  },

  {
    strategyName: strategyNames["covered-strangle"],
    description: strategyDescriptions["covered-strangle"],
    srcDark: "/pictures/StrategiesDarkMode/CoveredStrangle.svg",
    srcLight: "/pictures/StrategiesLightMode/CoveredStrangle.svg",
    href: "/option-calculator/covered-strangle",
  },

  {
    strategyName: strategyNames["call-ratio-back-spread"],
    description: strategyDescriptions["call-ratio-back-spread"],
    srcDark: "/pictures/StrategiesDarkMode/CallRatioBackSpread.svg",
    srcLight: "/pictures/StrategiesLightMode/CallRatioBackSpread.svg",
    href: "/option-calculator/call-ratio-back-spread",
  },
  {
    strategyName: strategyNames["married-put"],
    description: strategyDescriptions["married-put"],
    srcDark: "/pictures/StrategiesDarkMode/MarriedPut.svg",
    srcLight: "/pictures/StrategiesLightMode/MarriedPut.svg",
    href: "/option-calculator/married-put",
  },
  {
    strategyName: strategyNames["synthetic-call"],
    description: strategyDescriptions["synthetic-call"],
    srcDark: "/pictures/StrategiesDarkMode/SyntheticCall.svg",
    srcLight: "/pictures/StrategiesLightMode/SyntheticCall.svg",
    href: "/option-calculator/synthetic-call",
  },
  {
    strategyName: strategyNames["synthetic-put"],
    description: strategyDescriptions["synthetic-put"],
    srcDark: "/pictures/StrategiesDarkMode/SyntheticPut.svg",
    srcLight: "/pictures/StrategiesLightMode/SyntheticPut.svg",
    href: "/option-calculator/synthetic-put",
  },
];

export const otherStrategies = [
  {
    strategyName: strategyNames["long-call-butterfly"],
    description: strategyDescriptions["long-call-butterfly"],
    srcDark: "/pictures/StrategiesDarkMode/LongCallButterfly.svg",
    srcLight: "/pictures/StrategiesLightMode/LongCallButterfly.svg",
    href: "/option-calculator/long-call-butterfly",
  },
  {
    strategyName: strategyNames["long-put-butterfly"],
    description: strategyDescriptions["long-put-butterfly"],
    srcDark: "/pictures/StrategiesDarkMode/LongPutButterfly.svg",
    srcLight: "/pictures/StrategiesLightMode/LongPutButterfly.svg",
    href: "/option-calculator/long-put-butterfly",
  },
  {
    strategyName: strategyNames["short-put-butterfly"],
    description: strategyDescriptions["short-put-butterfly"],
    srcDark: "/pictures/StrategiesDarkMode/ShortPutButterfly.svg",
    srcLight: "/pictures/StrategiesLightMode/ShortPutButterfly.svg",
    href: "/option-calculator/short-put-butterfly",
  },
  {
    strategyName: strategyNames["reverse-covered-call"],
    description: strategyDescriptions["reverse-covered-call"],
    srcDark: "/pictures/StrategiesDarkMode/ReversedCoveredCall.svg",
    srcLight: "/pictures/StrategiesLightMode/ReversedCoveredCall.svg",
    href: "/option-calculator/reverse-covered-call",
  },
  {
    strategyName: strategyNames["short-call-butterfly"],
    description: strategyDescriptions["short-call-butterfly"],
    srcDark: "/pictures/StrategiesDarkMode/ShortCallButterfly.svg",
    srcLight: "/pictures/StrategiesLightMode/ShortCallButterfly.svg",
    href: "/option-calculator/short-call-butterfly",
  },
  {
    strategyName: strategyNames["long-combo"],
    description: strategyDescriptions["long-combo"],
    srcDark: "/pictures/StrategiesDarkMode/long-combo.svg",
    srcLight: "/pictures/StrategiesLightMode/long-combo.svg",
    href: "/option-calculator/long-combo",
  },
  {
    strategyName: strategyNames["short-combo"],
    description: strategyDescriptions["short-combo"],
    srcDark: "/pictures/StrategiesDarkMode/short-combo.svg",
    srcLight: "/pictures/StrategiesLightMode/short-combo.svg",
    href: "/option-calculator/short-combo",
  },
  {
    strategyName: strategyNames["strip"],
    description: strategyDescriptions["strip"],
    srcDark: "/pictures/StrategiesDarkMode/Strip.svg",
    srcLight: "/pictures/StrategiesLightMode/Strip.svg",
    href: "/option-calculator/strip",
  },
  {
    strategyName: strategyNames["strap"],
    description: strategyDescriptions["strap"],
    srcDark: "/pictures/StrategiesDarkMode/Strap.svg",
    srcLight: "/pictures/StrategiesLightMode/Strap.svg",
    href: "/option-calculator/strap",
  },
  {
    strategyName: strategyNames["guts"],
    description: strategyDescriptions["guts"],
    srcDark: "/pictures/StrategiesDarkMode/guts.svg",
    srcLight: "/pictures/StrategiesLightMode/guts.svg",
    href: "/option-calculator/guts",
  },
  {
    strategyName: strategyNames["call-ratio-spread"],
    description: strategyDescriptions["call-ratio-spread"],
    srcDark: "/pictures/StrategiesDarkMode/call-ratio-spread.svg",
    srcLight: "/pictures/StrategiesLightMode/call-ratio-spread.svg",
    href: "/option-calculator/call-ratio-spread",
  },
  {
    strategyName: strategyNames["put-ratio-spread"],
    description: strategyDescriptions["put-ratio-spread"],
    srcDark: "/pictures/StrategiesDarkMode/put-ratio-spread.svg",
    srcLight: "/pictures/StrategiesLightMode/put-ratio-spread.svg",
    href: "/option-calculator/put-ratio-spread",
  },
  {
    strategyName: strategyNames["1x2-ratio-volatility-spread-with-calls"],
    description: strategyDescriptions["1x2-ratio-volatility-spread-with-calls"],
    srcDark:
      "/pictures/StrategiesDarkMode/1x2-ratio-volatility-spread-with-calls.svg",
    srcLight:
      "/pictures/StrategiesLightMode/1x2-ratio-volatility-spread-with-calls.svg",
    href: "/option-calculator/1x2-ratio-volatility-spread-with-calls",
  },
  {
    strategyName: strategyNames["1x2-ratio-volatility-spread-with-puts"],
    description: strategyDescriptions["1x2-ratio-volatility-spread-with-puts"],
    srcDark:
      "/pictures/StrategiesDarkMode/1x2-ratio-volatility-spread-with-puts.svg",
    srcLight:
      "/pictures/StrategiesLightMode/1x2-ratio-volatility-spread-with-puts.svg",
    href: "/option-calculator/1x2-ratio-volatility-spread-with-puts",
  },
  {
    strategyName: strategyNames["jade-lizard"],
    description: strategyDescriptions["jade-lizard"],
    srcDark: "/pictures/StrategiesDarkMode/jade-lizard.svg",
    srcLight: "/pictures/StrategiesLightMode/jade-lizard.svg",
    href: "/option-calculator/jade-lizard",
  },
  {
    strategyName: strategyNames["reverse-jade-lizard"],
    description: strategyDescriptions["reverse-jade-lizard"],
    srcDark: "/pictures/StrategiesDarkMode/reverse-jade-lizard.svg",
    srcLight: "/pictures/StrategiesLightMode/reverse-jade-lizard.svg",
    href: "/option-calculator/reverse-jade-lizard",
  },
  {
    strategyName: strategyNames["long-put-ladder"],
    description: strategyDescriptions["long-put-ladder"],
    srcDark: "/pictures/StrategiesDarkMode/long-put-ladder.svg",
    srcLight: "/pictures/StrategiesLightMode/long-put-ladder.svg",
    href: "/option-calculator/long-put-ladder",
  },
  {
    strategyName: strategyNames["short-put-ladder"],
    description: strategyDescriptions["short-put-ladder"],
    srcDark: "/pictures/StrategiesDarkMode/short-put-ladder.svg",
    srcLight: "/pictures/StrategiesLightMode/short-put-ladder.svg",
    href: "/option-calculator/short-put-ladder",
  },
  {
    strategyName: strategyNames["short-call-ladder"],
    description: strategyDescriptions["short-call-ladder"],
    srcDark: "/pictures/StrategiesDarkMode/short-call-ladder.svg",
    srcLight: "/pictures/StrategiesLightMode/short-call-ladder.svg",
    href: "/option-calculator/short-call-ladder",
  },
  {
    strategyName: strategyNames["long-call-ladder"],
    description: strategyDescriptions["long-call-ladder"],
    srcDark: "/pictures/StrategiesDarkMode/long-call-ladder.svg",
    srcLight: "/pictures/StrategiesLightMode/long-call-ladder.svg",
    href: "/option-calculator/long-call-ladder",
  },
  {
    strategyName: strategyNames["reverse-iron-condor"],
    description: strategyDescriptions["reverse-iron-condor"],
    srcDark: "/pictures/StrategiesDarkMode/reverse-iron-condor.svg",
    srcLight: "/pictures/StrategiesLightMode/reverse-iron-condor.svg",
    href: "/option-calculator/reverse-iron-condor",
  },
  {
    strategyName: strategyNames["iron-butterfly"],
    description: strategyDescriptions["iron-butterfly"],
    srcDark: "/pictures/StrategiesDarkMode/LongCallButterfly.svg",
    srcLight: "/pictures/StrategiesLightMode/LongCallButterfly.svg",
    href: "/option-calculator/iron-butterfly",
  },
  {
    strategyName: strategyNames["reverse-iron-butterfly"],
    description: strategyDescriptions["reverse-iron-butterfly"],
    srcDark: "/pictures/StrategiesDarkMode/reverse-iron-butterfly.svg",
    srcLight: "/pictures/StrategiesLightMode/reverse-iron-butterfly.svg",
    href: "/option-calculator/reverse-iron-butterfly",
  },
  {
    strategyName: strategyNames["long-call-condor-spread"],
    description: strategyDescriptions["long-call-condor-spread"],
    srcDark: "/pictures/StrategiesDarkMode/long-call-condor-spread.svg",
    srcLight: "/pictures/StrategiesLightMode/long-call-condor-spread.svg",
    href: "/option-calculator/long-call-condor-spread",
  },
  {
    strategyName: strategyNames["long-put-condor-spread"],
    description: strategyDescriptions["long-put-condor-spread"],
    srcDark: "/pictures/StrategiesDarkMode/long-put-condor-spread.svg",
    srcLight: "/pictures/StrategiesLightMode/long-put-condor-spread.svg",
    href: "/option-calculator/long-put-condor-spread",
  },
  {
    strategyName: strategyNames["skip-strike-call-butterfly"],
    description: strategyDescriptions["skip-strike-call-butterfly"],
    srcDark: "/pictures/StrategiesDarkMode/skip-strike-call-butterfly.svg",
    srcLight: "/pictures/StrategiesLightMode/skip-strike-call-butterfly.svg",
    href: "/option-calculator/skip-strike-call-butterfly",
  },
  {
    strategyName: strategyNames["skip-strike-put-butterfly"],
    description: strategyDescriptions["skip-strike-put-butterfly"],
    srcDark: "/pictures/StrategiesDarkMode/skip-strike-put-butterfly.svg",
    srcLight: "/pictures/StrategiesLightMode/skip-strike-put-butterfly.svg",
    href: "/option-calculator/skip-strike-put-butterfly",
  },
  {
    strategyName: strategyNames["reverse-skip-strike-call-butterfly"],
    description: strategyDescriptions["reverse-skip-strike-call-butterfly"],
    srcDark:
      "/pictures/StrategiesDarkMode/reverse-skip-strike-call-butterfly.svg",
    srcLight:
      "/pictures/StrategiesLightMode/reverse-skip-strike-call-butterfly.svg",
    href: "/option-calculator/reverse-skip-strike-call-butterfly",
  },
  {
    strategyName: strategyNames["reverse-skip-strike-put-butterfly"],
    description: strategyDescriptions["reverse-skip-strike-put-butterfly"],
    srcDark:
      "/pictures/StrategiesDarkMode/reverse-skip-strike-put-butterfly.svg",
    srcLight:
      "/pictures/StrategiesLightMode/reverse-skip-strike-put-butterfly.svg",
    href: "/option-calculator/reverse-skip-strike-put-butterfly",
  },
  {
    strategyName: strategyNames["christmas-tree-call-butterfly"],
    description: strategyDescriptions["christmas-tree-call-butterfly"],
    srcDark: "/pictures/StrategiesDarkMode/christmas-tree-call-butterfly.svg",
    srcLight: "/pictures/StrategiesLightMode/christmas-tree-call-butterfly.svg",
    href: "/option-calculator/christmas-tree-call-butterfly",
  },
  {
    strategyName: strategyNames["christmas-tree-put-butterfly"],
    description: strategyDescriptions["christmas-tree-put-butterfly"],
    srcDark: "/pictures/StrategiesDarkMode/christmas-tree-put-butterfly.svg",
    srcLight: "/pictures/StrategiesLightMode/christmas-tree-put-butterfly.svg",
    href: "/option-calculator/christmas-tree-put-butterfly",
  },
  {
    strategyName: strategyNames["front-call-spread"],
    description: strategyDescriptions["front-call-spread"],
    srcDark: "/pictures/StrategiesDarkMode/front-call-spread.svg",
    srcLight: "/pictures/StrategiesLightMode/front-call-spread.svg",
    href: "/option-calculator/front-call-spread",
  },
  {
    strategyName: strategyNames["front-put-spread"],
    description: strategyDescriptions["front-put-spread"],
    srcDark: "/pictures/StrategiesDarkMode/front-put-spread.svg",
    srcLight: "/pictures/StrategiesLightMode/front-put-spread.svg",
    href: "/option-calculator/front-put-spread",
  },
  {
    strategyName: strategyNames["call-zebra"],
    description: strategyDescriptions["call-zebra"],
    srcDark: "/pictures/StrategiesDarkMode/call-zebra.svg",
    srcLight: "/pictures/StrategiesLightMode/call-zebra.svg",
    href: "/option-calculator/call-zebra",
  },
  {
    strategyName: strategyNames["put-zebra"],
    description: strategyDescriptions["put-zebra"],
    srcDark: "/pictures/StrategiesDarkMode/put-zebra.svg",
    srcLight: "/pictures/StrategiesLightMode/put-zebra.svg",
    href: "/option-calculator/put-zebra",
  },
  {
    strategyName: strategyNames["short-guts"],
    description: strategyDescriptions["short-guts"],
    srcDark: "/pictures/StrategiesDarkMode/short-guts.svg",
    srcLight: "/pictures/StrategiesLightMode/short-guts.svg",
    href: "/option-calculator/short-guts",
  },
  {
    strategyName: strategyNames["short-call-condor"],
    description: strategyDescriptions["short-call-condor"],
    srcDark: "/pictures/StrategiesDarkMode/short-call-condor.svg",
    srcLight: "/pictures/StrategiesLightMode/short-call-condor.svg",
    href: "/option-calculator/short-call-condor",
  },
  {
    strategyName: strategyNames["short-put-condor"],
    description: strategyDescriptions["short-put-condor"],
    srcDark: "/pictures/StrategiesDarkMode/short-put-condor.svg",
    srcLight: "/pictures/StrategiesLightMode/short-put-condor.svg",
    href: "/option-calculator/short-put-condor",
  },
];
