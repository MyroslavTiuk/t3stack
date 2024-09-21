import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import axios from "axios";
import { z } from "zod";
import { Prisma } from "opcalc-database";
import { env } from "~/env.mjs";

export const backtesterRoute = createTRPCRouter({
  calculateEnquityOptions: protectedProcedure
    .input(
      z
        .object({
          symbols: z.array(z.string()),
          selectedTabMode: z.enum(["equity-options"]),
          selectedStrategy: z.enum(["Covered Call", "Married Put"]),
          datesRange: z
            .string()
            .refine(
              (value) =>
                /^(\d{2}\/\d{2}\/\d{4}) - (\d{2}\/\d{2}\/\d{4})$/.test(value),
              {
                message:
                  'Invalid date range format. Should be "mm/dd/yyyy - mm/dd/yyyy"',
              }
            ),
          entryPositionSize: z.enum(["Shares amount", "Dollar amount"]),
          entryPositionSizeValue: z.number(),
          entryCriteria: z.array(
            z.object({
              positionCriteria: z.enum([
                "Stock Increases",
                "Stock Decreases",
                "VIX Increases",
                "VIX Decreases",
                "Every x amount of days",
              ]),
              positionValue: z.number(),
            })
          ),
          exitPositionSize: z.enum(["Shares amount", "Dollar amount"]),
          exitPositionSizeValue: z.number(),
          exitAndCriteria: z.array(
            z.object({
              positionCriteria: z.enum([
                "Stock Increases",
                "Stock Decreases",
                "VIX Increases",
                "VIX Decreases",
                "Every x amount of days",
              ]),
              positionValue: z.number(),
            })
          ),
          exitOrCriteria: z.array(
            z.object({
              positionCriteria: z.enum([
                "Stock Increases",
                "Stock Decreases",
                "VIX Increases",
                "VIX Decreases",
                "Every x amount of days",
              ]),
              positionValue: z.number(),
            })
          ),
          strategy: z.object({
            strategyName: z.enum(["short-call", "long-put"]),
            strategyType: z.enum(["put", "call"]),
            strategyMode: z.enum(["Delta", "OTM %", "Strike Price"]),
            strategyValue: z.number(),
            strategyQuantity: z.number(),
          }),
          resetStockPrice: z.enum([
            "Resets every entry or exit",
            "From start",
            "Day over day",
            "Month over month",
            "Year over year",
          ]),
          expirationDays: z.number(),
          backtesterMode: z.enum(["let_options_expire", "close_out_options"]),
          closeOutCriteria: z.enum(["DTE", "VIX Increases", "Stock Increases"]),
          closeOutCriteriaValue: z.number(),
          fromHistory: z.boolean(),
        })
        .partial({
          closeOutCriteria: true,
          closeOutCriteriaValue: true,
          exitPositionSize: true,
          exitPositionSizeValue: true,
          exitAndCriteria: true,
          exitOrCriteria: true,
          resetStockPrice: true,
          fromHistory: true,
        })
    )
    .query(async ({ ctx, input }) => {
      const result = { data: {}, success: true, errorMessage: "" };

      const requestBody = {};

      requestBody["symbols"] = input.symbols;
      requestBody["selected_tab_mode"] = input.selectedTabMode;
      requestBody["selected_strategy"] = input.selectedStrategy;
      requestBody["dates_range"] = input.datesRange;
      requestBody["entry_position_size"] = input.entryPositionSize;
      requestBody["entry_position_size_value"] = input.entryPositionSizeValue;

      if (input.resetStockPrice) {
        requestBody["reset_stock_price"] = input.resetStockPrice;
      } else {
        requestBody["reset_stock_price"] = "Resets every entry or exit";
      }

      if (input.entryCriteria.length > 0) {
        const entryCriteries = input.entryCriteria.map((item) => {
          return {
            position_criteria: item.positionCriteria,
            position_value: item.positionValue,
          };
        });
        requestBody["entry_criteria"] = entryCriteries;
      }

      if (input.exitPositionSize && input.exitPositionSizeValue) {
        requestBody["exit_position_size"] = input.exitPositionSize;
        requestBody["exit_position_size_value"] = input.exitPositionSizeValue;
      }

      if (input.exitAndCriteria) {
        if (input.exitAndCriteria.length > 0) {
          const exitAndCriterias = input.exitAndCriteria.map((item) => {
            return {
              position_criteria: item.positionCriteria,
              position_value: item.positionValue,
            };
          });
          requestBody["exit_and_criteria"] = exitAndCriterias;
        }
      }

      if (input.exitOrCriteria) {
        if (input.exitOrCriteria.length > 0) {
          const exitOrCriterias = input.exitOrCriteria.map((item) => {
            return {
              position_criteria: item.positionCriteria,
              position_value: item.positionValue,
            };
          });
          requestBody["exit_or_criteria"] = exitOrCriterias;
        }
      }

      requestBody["strategies"] = [
        {
          strategy_name: input.strategy.strategyName,
          strategy_type: input.strategy.strategyType,
          strategy_mode: input.strategy.strategyMode,
          strategy_value: input.strategy.strategyValue,
          strategy_quantity: input.strategy.strategyQuantity,
        },
      ];

      requestBody["backtester_mode"] = input.backtesterMode;
      requestBody["close_out_criteria"] =
        input.closeOutCriteria !== undefined ? input.closeOutCriteria : "";
      requestBody["close_out_criteria_value"] =
        input.closeOutCriteriaValue !== undefined
          ? input.closeOutCriteriaValue
          : "";
      requestBody["expiration_days"] = input.expirationDays;

      try {
        const { data } = await axios.post(
          env.BACKTESTER_SOURCE_API_ROUTE,
          requestBody,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const user = ctx.session.user;

        if ("labels" in data.graph_items) {
          data.graph_items.datasets = data.graph_items.datasets.map(
            (item: { cubicInterpolationMode: any }) => {
              delete item.cubicInterpolationMode;
              return item;
            }
          );

          const mainSymbolsKeys = Object.keys(data.under_charts);

          const realItems = mainSymbolsKeys.filter((item) => {
            return !item.includes("SPY");
          });

          if (realItems.length > 0 && !input.fromHistory) {
            await ctx.prisma.savedBacktests.create({
              data: {
                userId: user.id,
                dataMain: data.under_charts,
                dataFields: input,
              },
            });
          }

          if (
            data.status === "success" &&
            typeof data.list_items === "string" &&
            data.graph_items.length === 0
          ) {
            result.errorMessage = data.list_items.replace(
              `<span><i class='fa-solid fa-filter'></i></span>`,
              ""
            );
          }
        } else if (typeof data === "string") {
          result.errorMessage = data;
        }

        result.data = data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          result.success = false;
          result.errorMessage = error.message;
        }
      }

      return result;
    }),
  calculateEnquity: protectedProcedure
    .input(
      z
        .object({
          symbols: z.array(z.string()),
          selectedTabMode: z.enum(["options", "equity", "options&equity"]),
          selectedStrategy: z.string(),
          datesRange: z
            .string()
            .refine(
              (value) =>
                /^(\d{2}\/\d{2}\/\d{4}) - (\d{2}\/\d{2}\/\d{4})$/.test(value),
              {
                message:
                  'Invalid date range format. Should be "mm/dd/yyyy - mm/dd/yyyy"',
              }
            ),
          entryPositionSize: z.enum(["Shares amount", "Dollar amount"]),
          entryPositionSizeValue: z.number(),
          entryCriteria: z.array(
            z.object({
              positionCriteria: z.enum([
                "Stock Increases",
                "Stock Decreases",
                "VIX Increases",
                "VIX Decreases",
                "Every x amount of days",
              ]),
              positionValue: z.number(),
            })
          ),
          exitPositionSize: z.enum(["Shares amount", "Dollar amount"]),
          exitPositionSizeValue: z.number(),
          exitAndCriteria: z.array(
            z.object({
              positionCriteria: z.enum([
                "Stock Increases",
                "Stock Decreases",
                "VIX Increases",
                "VIX Decreases",
                "Every x amount of days",
              ]),
              positionValue: z.number(),
            })
          ),
          exitOrCriteria: z.array(
            z.object({
              positionCriteria: z.enum([
                "Stock Increases",
                "Stock Decreases",
                "VIX Increases",
                "VIX Decreases",
                "Every x amount of days",
              ]),
              positionValue: z.number(),
            })
          ),
          resetStockPrice: z.enum([
            "Resets every entry or exit",
            "From start",
            "Day over day",
            "Month over month",
            "Year over year",
          ]),
          fromHistory: z.boolean(),
        })
        .partial({
          exitOrCriteria: true,
          exitAndCriteria: true,
          exitPositionSize: true,
          exitPositionSizeValue: true,
          resetStockPrice: true,
          fromHistory: true,
        })
    )
    .query(async ({ ctx, input }) => {
      const result = { data: {}, success: true, errorMessage: "" };

      const requestBody = {};

      requestBody["symbols"] = input.symbols;
      requestBody["selected_tab_mode"] = input.selectedTabMode;
      requestBody["selected_strategy"] = input.selectedStrategy;
      requestBody["dates_range"] = input.datesRange;
      requestBody["entry_position_size"] = input.entryPositionSize;
      requestBody["entry_position_size_value"] = input.entryPositionSizeValue;

      if (input.resetStockPrice) {
        requestBody["reset_stock_price"] = input.resetStockPrice;
      }

      if (input.entryCriteria.length > 0) {
        const entryCriteries = input.entryCriteria.map((item) => {
          return {
            position_criteria: item.positionCriteria,
            position_value: item.positionValue,
          };
        });
        requestBody["entry_criteria"] = entryCriteries;
      }

      if (input.exitPositionSize && input.exitPositionSizeValue) {
        requestBody["exit_position_size"] = input.exitPositionSize;
        requestBody["exit_position_size_value"] = input.exitPositionSizeValue;
      }

      if (input.exitAndCriteria) {
        if (input.exitAndCriteria.length > 0) {
          const exitAndCriterias = input.exitAndCriteria.map((item) => {
            return {
              position_criteria: item.positionCriteria,
              position_value: item.positionValue,
            };
          });
          requestBody["exit_and_criteria"] = exitAndCriterias;
        }
      }

      if (input.exitOrCriteria) {
        if (input.exitOrCriteria.length > 0) {
          const exitOrCriterias = input.exitOrCriteria.map((item) => {
            return {
              position_criteria: item.positionCriteria,
              position_value: item.positionValue,
            };
          });
          requestBody["exit_or_criteria"] = exitOrCriterias;
        }
      }

      try {
        const { data } = await axios.post(
          env.BACKTESTER_SOURCE_API_ROUTE,
          requestBody,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const user = ctx.session.user;

        if ("labels" in data.graph_items) {
          data.graph_items.datasets = data.graph_items.datasets.map(
            (item: { cubicInterpolationMode: any }) => {
              delete item.cubicInterpolationMode;
              return item;
            }
          );

          const mainSymbolsKeys = Object.keys(data.under_charts);

          const realItems = mainSymbolsKeys.filter((item) => {
            return !item.includes("SPY");
          });

          if (realItems.length > 0 && !input.fromHistory) {
            await ctx.prisma.savedBacktests.create({
              data: {
                userId: user.id,
                dataMain: data.under_charts,
                dataFields: input,
              },
            });
          }

          if (
            data.status === "success" &&
            typeof data.list_items === "string" &&
            data.graph_items.length === 0
          ) {
            result.errorMessage = data.list_items.replace(
              `<span><i class='fa-solid fa-filter'></i></span>`,
              ""
            );
          }
        } else if (typeof data === "string") {
          result.errorMessage = data;
        }

        result.data = data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          result.success = false;
          result.errorMessage = error.message;
        }
      }

      return result;
    }),
  calculate: protectedProcedure
    .input(
      z
        .object({
          symbols: z.array(z.string()),
          selectedTabMode: z.enum(["options", "equity", "options&equity"]),
          selectedStrategy: z.string(),
          datesRange: z
            .string()
            .refine(
              (value) =>
                /^(\d{2}\/\d{2}\/\d{4}) - (\d{2}\/\d{2}\/\d{4})$/.test(value),
              {
                message:
                  'Invalid date range format. Should be "mm/dd/yyyy - mm/dd/yyyy"',
              }
            ),
          expirationDays: z.number(),
          strategies: z.array(
            z.object({
              strategyName: z.string(),
              strategyType: z.string(),
              strategyMode: z.enum(["Delta", "OTM %", "Strike Price"]),
              strategyValue: z.number(),
              strategyQuantity: z.number(),
            })
          ),
          backtesterMode: z.enum(["let_options_expire", "close_out_options"]),
          closeOutCriteria: z.enum(["DTE", "VIX Increases", "Stock Increases"]),
          closeOutCriteriaValue: z.number(),
          fromHistory: z.boolean(),
        })
        .partial({
          closeOutCriteria: true,
          closeOutCriteriaValue: true,
          fromHistory: true,
        })
    )
    .query(async ({ ctx, input }) => {
      const result = { data: {}, success: true, errorMessage: "" };

      const requestBody = {};

      requestBody["symbols"] = input.symbols;
      requestBody["selected_tab_mode"] = input.selectedTabMode;
      requestBody["selected_strategy"] = input.selectedStrategy;
      requestBody["dates_range"] = input.datesRange;
      requestBody["expiration_days"] = input.expirationDays;

      if (input.strategies.length > 0) {
        const strategiesAll = input.strategies.map((item) => {
          return {
            strategy_name: item.strategyName,
            strategy_type: item.strategyType,
            strategy_mode: item.strategyMode,
            strategy_value: item.strategyValue,
            strategy_quantity: item.strategyQuantity,
          };
        });

        requestBody["strategies"] = strategiesAll;
      }

      requestBody["backtester_mode"] = input.backtesterMode;
      requestBody["close_out_criteria"] =
        input.closeOutCriteria !== undefined ? input.closeOutCriteria : "";
      requestBody["close_out_criteria_value"] =
        input.closeOutCriteriaValue !== undefined
          ? input.closeOutCriteriaValue
          : "";

      try {
        const { data } = await axios.post(
          env.BACKTESTER_SOURCE_API_ROUTE,
          requestBody,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const user = ctx.session.user;

        if ("labels" in data.graph_items) {
          data.graph_items.datasets = data.graph_items.datasets.map(
            (item: { cubicInterpolationMode: any }) => {
              delete item.cubicInterpolationMode;
              return item;
            }
          );

          const mainSymbolsKeys = Object.keys(data.under_charts);

          const realItems = mainSymbolsKeys.filter((item) => {
            return !item.includes("SPY");
          });

          if (realItems.length > 0 && !input.fromHistory) {
            await ctx.prisma.savedBacktests.create({
              data: {
                userId: user.id,
                dataMain: data.under_charts,
                dataFields: input,
              },
            });
          }

          if (
            data.status === "success" &&
            typeof data.list_items === "string" &&
            data.graph_items.length === 0
          ) {
            result.errorMessage = data.list_items.replace(
              `<span><i class='fa-solid fa-filter'></i></span>`,
              ""
            );
          }
        } else if (typeof data === "string") {
          result.errorMessage = data;
        }

        result.data = data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          result.success = false;
          result.errorMessage = error.message;
        }
      }

      return result;
    }),
  symbols: protectedProcedure.query(async () => {
    const result = { data: {}, success: true, errorMessage: "" };
    try {
      const { data } = await axios.get<{ data: string[] }>(
        "https://optionscout.test-domain-wp.com/app/control/ajax/symbols.php"
      );

      result.data = data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        result.success = false;
        result.errorMessage = error.message;
      }
    }

    return result;
  }),
  getSavedBacktests: protectedProcedure
    .input(z.object({ page: z.number(), limit: z.number() }))
    .query(async ({ ctx, input }) => {
      const page = input.page;
      const limit = input.limit;

      const user = ctx.session.user;

      try {
        let query = {
          where: {
            userId: user.id,
          },
          take: limit,
          orderBy: {
            dateAdded: Prisma.SortOrder.desc,
          },
        };

        if (input.page > 1) {
          query["skip"] = limit * (page - 1);
        }

        const backtests = await ctx.prisma.savedBacktests.findMany(query);
        const count = await ctx.prisma.savedBacktests.count({
          where: {
            userId: user.id,
          },
        });
        return {
          data: backtests,
          count,
        };
      } catch (err) {
        if (err.message) {
          return {
            error: err.message,
          };
        }
      }
    }),
  removeSavedBacktest: protectedProcedure
    .input(
      z.object({
        id: z.bigint(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const removeBacktest = await ctx.prisma.savedBacktests.delete({
          where: {
            id: input.id,
          },
        });

        return removeBacktest;
      } catch (err) {
        return {
          error: err.message,
        };
      }
    }),
  getBacktest: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const id = Number(input.id);

      const res = await ctx.prisma.savedBacktests.findFirst({
        where: {
          id: BigInt(id),
        },
      });

      return res;
    }),
});
