import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { format, parseISO } from "date-fns";
import { uuid } from "short-uuid";
import { type Strategy } from "../../../../opc-types/lib/Strategy";
import { z } from "zod";
import { userInputSchema } from "~/server/auth";

export const calculations = createTRPCRouter({
  updateCalculations: protectedProcedure
    .input((val: unknown) => {
      if (val !== null && typeof val === "object") {
        if ("calculations" in val) {
          return val;
        }
      }
      throw new Error(`Error: value is not correct.`);
    })
    .mutation(async ({ ctx, input }) => {
      const calculations = input.calculations as Strategy;
      const result = { success: false };

      if (!!ctx.session.user && !!calculations) {
        const dateAdded = parseISO(format(new Date(), "yyyy-MM-dd HH:mm:ss"));
        const expiryDate = parseISO(format(new Date(), "yyyy-MM-dd HH:mm:ss"));
        const calculationIdNew = uuid();

        const userId = ctx.session.user.id;
        const parsedCalcs = JSON.stringify(calculations);

        if (calculations.id !== null) {
          await ctx.prisma.savedCalcs.upsert({
            where: { id: calculations.id },
            update: {
              calculations: parsedCalcs,
              dateAdded,
              expiryDate,
            },
            create: {
              id: calculationIdNew,
              dateAdded,
              expiryDate,
              calculations: parsedCalcs,
              userId,
            },
          });
        }
        result.success = true;
      }

      return result;
    }),
  getCalculations: protectedProcedure.query(async ({ ctx }) => {
    const calculations = await ctx.prisma.savedCalcs.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      orderBy: {
        dateAdded: "desc",
      },
    });

    return calculations;
  }),
  getCalculation: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const calculation = await ctx.prisma.savedCalcs.findUnique({
          where: {
            id: input.id,
          },
        });
        return calculation;
      } catch (error) {
        return {
          error,
        };
      }
    }),
  remove: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const calculationId = input.id;
      const existingRow = await ctx.prisma.savedCalcs.findUnique({
        where: {
          id: calculationId,
        },
      });
      if (existingRow) {
        await ctx.prisma.savedCalcs.delete({
          where: {
            id: calculationId,
          },
        });
      }

      return {
        success: true,
      };
    }),
  getViewSettings: protectedProcedure.query(async ({ ctx }) => {
    const result = {
      success: false,
      data: {
        screenLayout: "",
        optionLegStyle: "",
      },
      errorMessage: "",
    };
    if (ctx.session.user) {
      try {
        const userSettings = await ctx.prisma.user.findUnique({
          where: {
            id: ctx.session.user.id,
          },
        });
        if (userSettings) {
          result.data = {
            screenLayout: userSettings.screenLayout ?? "",
            optionLegStyle: userSettings.optionLegStyle ?? "",
          };
          result.success = true;
        }
      } catch (error) {
        if (error instanceof Error) {
          result.errorMessage = error.message ?? "";
        }
      }
    }
    return result;
  }),
  getCurrentUserSettings: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
    });

    return user;
  }),

  updateCurrentUserSettings: protectedProcedure
    .input(userInputSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          ...input,
        },
      });
    }),
  setViewSettings: protectedProcedure
    .input(
      z
        .object({
          screenLayout: z.string(),
          optionLegStyle: z.string(),
        })
        .partial({ screenLayout: true, optionLegStyle: true })
    )
    .mutation(async ({ ctx, input }) => {
      const result = {
        success: false,
        errorMessage: "",
      };
      if (ctx.session.user) {
        try {
          const data = {};

          if (input.screenLayout) {
            data["screenLayout"] = input.screenLayout;
          }

          if (input.optionLegStyle) {
            data["optionLegStyle"] = input.optionLegStyle;
          }

          const userSettings = await ctx.prisma.user.update({
            where: {
              id: ctx.session.user.id,
            },
            data,
          });
          if (userSettings) {
            result.success = true;
          }
        } catch (error) {
          if (error instanceof Error) {
            result.errorMessage = error.message ?? "";
          }
        }
      }
      return result;
    }),
});
