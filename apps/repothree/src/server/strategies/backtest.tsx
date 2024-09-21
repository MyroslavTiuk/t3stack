import { z } from "zod";

// Common strategy schema for long/short options
export const optionStrategySchema = z.object({
  strategyName: z.string(),
  strategyType: z.string(),
  strategyMode: z.string(),
  strategyValue: z.number(),
  strategyQuantity: z.number(),
});
export type OptionStrategy = z.infer<typeof optionStrategySchema>;

export const optionBackTestInputSchema = z.object({
  symbol: z.string(),
  selectedTabMode: z.string(),
  selectedStrategy: z.string(),
  datesRange: z.string(),
  expirationDays: z.number(),
  strategies: z.array(optionStrategySchema), // Array of option strategies
  backtesterMode: z.string(),
  closeOutCriteria: z.any(),
  closeOutCriteriaValue: z.any(),
});

export type OptionBackTestInput = z.infer<typeof optionBackTestInputSchema>;

export const equityBackTestInputSchema = z.object({
  underlyingSymbol: z.string(),
  strategySelections: z.string(),
  transactionDate: z.date(),
  expirationDate: z.date(),
  expirationDays: z.number(),
  strategies: z.array(optionStrategySchema), // Array of option strategies
  expireOrClose: z.string(),
  closeCriteria: z.string(),
  closeValue: z.number(),
});

export type EquityBackTestInput = z.infer<typeof equityBackTestInputSchema>;
