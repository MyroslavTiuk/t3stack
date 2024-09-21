import { OpenClose, OptionAction, OptionType, Position } from "opcalc-database";
import { z } from "zod";

export const optionTransactionInputSchema = z.object({
  underlyingSymbol: z.string(),
  transactionDate: z.date(),
  optionPrice: z.number().gte(0.01).nullish(),
  quantity: z.number().gte(1).nullish(),
  action: z.nativeEnum(OptionAction),
  openClose: z.nativeEnum(OpenClose).optional(),
  optionType: z.nativeEnum(OptionType),
  expirationDate: z.date(),
  strikePrice: z
    .number()
    .nullish()
    .refine((val) => val !== null),
  fees: z.number().nullish(),
  description: z.string().optional(),
});

export type OptionTransactionInput = z.infer<
  typeof optionTransactionInputSchema
>;

export const optionTransactionInputSchemaDetails = z.object({
  transactionDate: z.date(),
  optionPrice: z
    .number()
    .gte(0.01)
    .nullish()
    .refine((val) => val !== null),
  quantity: z.number().gte(1).nullish(),
  action: z.nativeEnum(OptionAction),
  openClose: z.nativeEnum(OpenClose).optional(),
  optionType: z.nativeEnum(OptionType),
  expirationDate: z.date().nullish(),
  strikePrice: z
    .number()
    .nullish()
    .refine((val) => val !== null),
  fees: z.number().nullish(),
  isClosingPosition: z.boolean(),
});

export const optionTransactionInputSchemaClosing = z.object({
  transactionDate: z.date(),
  optionPrice: z
    .number()
    .gte(0.01)
    .refine((val) => val !== null),
  quantity: z.number().gte(1),
  action: z.nativeEnum(OptionAction),
  openClose: z.nativeEnum(OpenClose).optional(),
  optionType: z.nativeEnum(OptionType),
  expirationDate: z.date().nullish(),
  strikePrice: z.number(),
  fees: z.number(),
});

export const optionsTransactionInputSchema = z.object({
  underlyingSymbol: z.string(),
  details: z.array(optionTransactionInputSchemaDetails),
  closing: z.array(
    z
      .object({
        transactionDate: z.date(),
        optionPrice: z.number().gte(0.01).nullable(),
        quantity: z.number().gte(1).nullable(),
        action: z.nativeEnum(OptionAction),
        openClose: z.nativeEnum(OpenClose).optional(),
        optionType: z.nativeEnum(OptionType),
        expirationDate: z.date().nullish(),
        strikePrice: z.number().nullable(),
        fees: z.number().nullable(),
      })
      .optional()
  ),
});

export type OptionsTransactionInput = z.infer<
  typeof optionsTransactionInputSchema
>;

export type OptionTransactionDetailsInput = z.infer<
  typeof optionTransactionInputSchemaDetails
>;

export const equityTransactionInputSchema = z.object({
  symbol: z.string(),
  transactionDate: z.date(),
  sharePrice: z
    .number()
    .gte(0.01)
    .nullish()
    .refine((val) => val !== null),
  quantity: z.number().gte(1).nullish(),
  position: z.nativeEnum(Position),
  openClose: z.nativeEnum(OpenClose).optional(),
  strikePrice: z.number().optional().nullish(),
  fees: z.number().nullish(),
  description: z.string().optional(),
});
export type EquityTransactionInput = z.infer<
  typeof equityTransactionInputSchema
>;

export const csvTransactionsInputSchema = z.object({
  optionTransactions: z
    .object({
      sourceTransactionId: z.string().nullable(),
      underlyingSymbol: z.string(),
      transactionDate: z.date(),
      netPrice: z.number(),
      quantity: z.number(),
      action: z.nativeEnum(OptionAction),
      optionType: z.nativeEnum(OptionType),
      expirationDate: z.date(),
      strikePrice: z.number(),
      fees: z.number(),
      description: z.string().nullable(),
    })
    .array(),
  equityTransactions: z
    .object({
      sourceTransactionId: z.string().nullable(),
      symbol: z.string(),
      transactionDate: z.date(),
      netPrice: z.number(),
      quantity: z.number(),
      position: z.nativeEnum(Position),
      fees: z.number(),
      description: z.string().nullable(),
    })
    .array(),
});

export type CsvTransactionInput = z.infer<typeof csvTransactionsInputSchema>;

export const tradePageSize = 10;
