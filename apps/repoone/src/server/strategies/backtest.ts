import { z } from "zod";

// Common strategy schema for long/short options
const optionStrategySchema = z.object({
  strategyName: z.string(),
  strategyType: z.string(),
  strategyMode: z.string(),
  strategyValue: z.number(),
  strategyQuantity: z.number(),
});
export type OptionStrategy = z.infer<typeof optionStrategySchema>;

export const optionBackTestInputSchema = z.object({
  symbols: z.array(z.string()),
  selectedTabMode: z.string(),
  selectedStrategy: z.string(),
  datesRange: z.string(),
  expirationDays: z.number(),
  strategies: z.array(optionStrategySchema),
  backtesterMode: z.string(),
  closeOutCriteria: z.any(),
  closeOutCriteriaValue: z.any(),
});

export type OptionBackTestInput = z.infer<typeof optionBackTestInputSchema>;

export const equityBackTestInputSchema = z.object({
  symbols: z.array(z.string()),
  selectedTabMode: z.string(),
  selectedStrategy: z.string(),
  datesRange: z.string(),
  entryPositionSize: z.string(),
  entryPositionSizeValue: z.number(),
  entryCriteria: z.array(
    z.object({
      positionCriteria: z.string(),
      positionValue: z.number(),
    })
  ),
  resetStockPrice: z.string().optional(),
  exitPositionSize: z.string().optional(),
  exitPositionSizeValue: z.number().optional(),
  exitAndCriteria: z
    .array(
      z.object({
        positionCriteria: z.string(),
        positionValue: z.number(),
      })
    )
    .optional(),
  exitOrCriteria: z
    .array(
      z.object({
        positionCriteria: z.string(),
        positionValue: z.number(),
      })
    )
    .optional(),
});

export type EquityBackTestInput = z.infer<typeof equityBackTestInputSchema>;

export const optionsEquityBackTestInputSchema = z.object({
  symbols: z.array(z.string()),
  selectedTabMode: z.string(),
  selectedStrategy: z.string(),
  datesRange: z.string(),
  entryPositionSize: z.string(),
  entryPositionSizeValue: z.number(),
  entryCriteria: z.array(
    z.object({
      positionCriteria: z.string(),
      positionValue: z.number(),
    })
  ),
  exitPositionSize: z.string().optional(),
  exitPositionSizeValue: z.number().optional(),
  exitAndCriteria: z
    .array(
      z.object({
        positionCriteria: z.string(),
        positionValue: z.number(),
      })
    )
    .optional(),
  exitOrCriteria: z
    .array(
      z.object({
        positionCriteria: z.string(),
        positionValue: z.number(),
      })
    )
    .optional(),
  strategy: z.object({
    strategyName: z.string(),
    strategyType: z.string(),
    strategyMode: z.string(),
    strategyValue: z.number(),
    strategyQuantity: z.number(),
  }),
  expirationDays: z.number(),
  resetStockPrice: z.string().optional(),
  backtesterMode: z.string(),
  closeOutCriteria: z.string().optional(),
  closeOutCriteriaValue: z.number().optional(),
});

export type OptionsEquityBackTestInput = z.infer<
  typeof optionsEquityBackTestInputSchema
>;
