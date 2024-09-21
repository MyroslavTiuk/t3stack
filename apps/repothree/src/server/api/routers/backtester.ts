import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import axios from "axios";
import { z } from "zod";

interface BacktesterDataset {
  label: string;
  data: number[];
  borderColor: string;
  fill: boolean;
  cubicInterpolationMode: string;
  tension: number;
}

interface BacktesterResponse {
  final: any;
  calculator: any;
  graph_items: {
    labels: number[];
    datasets: BacktesterDataset[];
  };
  list_items: string;
  status: boolean;
}

export const backtesterRoute = createTRPCRouter({
  calculate: protectedProcedure
    .input(
      z
        .object({
          symbol: z.string(),
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
        })
        .partial({ closeOutCriteria: true, closeOutCriteriaValue: true })
    )
    .query(async ({ input }) => {
      const result = { data: {}, success: true, errorMessage: "" };

      const formData = new FormData();
      formData.append("symbols[]", input.symbol);
      formData.append("selected_tab_mode", input.selectedTabMode);
      formData.append("selected_strategy", input.selectedStrategy);
      formData.append("dates_range", input.datesRange);
      formData.append("expiration_days", input.expirationDays.toString());

      if (input.strategies.length > 0) {
        input.strategies.forEach((item, index) => {
          formData.append(
            `strategies[${index}][strategy_name]`,
            item.strategyName
          );
          formData.append(
            `strategies[${index}][strategy_type]`,
            item.strategyType
          );
          formData.append(
            `strategies[${index}][strategy_mode]`,
            item.strategyMode
          );
          formData.append(
            `strategies[${index}][strategy_value]`,
            item.strategyValue.toString()
          );
          formData.append(
            `strategies[${index}][strategy_quantity]`,
            item.strategyValue.toString()
          );
        });
      }

      formData.append("backtester_mode", input.backtesterMode);
      formData.append(
        "close_out_criteria",
        input.closeOutCriteria !== undefined ? input.closeOutCriteria : ""
      );
      formData.append(
        "close_out_criteria_value",
        input.closeOutCriteriaValue !== undefined
          ? input.closeOutCriteriaValue.toString()
          : ""
      );

      try {
        const { data } = await axios.post<BacktesterResponse>(
          "https://optionscout.test-domain-wp.com/app/control/ajax/backtester.php",
          formData
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
});
