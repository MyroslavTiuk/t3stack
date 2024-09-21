export const shouldUseRoiMargin = (strat: string) =>
  strat === 'short-put' || strat === 'short-call';
