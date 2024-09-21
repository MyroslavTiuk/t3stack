import { createTRPCRouter, protectedProcedure } from "../trpc";
import z from "zod";
import * as bcrypt from "bcryptjs";

export const apiKeys = createTRPCRouter({
  generate: protectedProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const apiKeyName = input.name;
      const result = { success: false, data: {}, error: [] };
      try {
        if (ctx.session.user) {
          const saltRounds = 10;
          const dataToHash = `${ctx.session.user.name}_${ctx.session.user.email}_${apiKeyName}`;
          const salt = bcrypt.genSaltSync(saltRounds);
          const hashedData = bcrypt.hashSync(dataToHash, salt);
          const newKey = `opsc_${hashedData}`;

          const isExisted = await ctx.prisma.apiKeys.findFirst({
            where: {
              name: apiKeyName,
            },
          });

          if (isExisted) {
            throw new Error(
              "The API key with the same name is already created."
            );
          }

          const generatedKey = await ctx.prisma.apiKeys.create({
            data: {
              userId: ctx.session.user.id,
              name: apiKeyName,
              key: newKey,
            },
          });
          result.success = true;
          result.data["key"] = generatedKey.key;
          result.data["name"] = generatedKey.name;
          result.data["id"] = generatedKey.id;
        }
      } catch (e) {
        result.error.push(e.message);
      }

      return result;
    }),
  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const idKey = input.id;
      const result = { success: false, data: {}, error: [] };

      try {
        if (ctx.session.user) {
          const keyDeleted = await ctx.prisma.apiKeys.delete({
            where: {
              id: idKey,
            },
          });

          result.success = true;
          result.data["key"] = keyDeleted.key;
        }
      } catch (e) {
        result.error.push(e.message);
      }

      return result;
    }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const result = { success: false, data: {}, error: [] };

    if (ctx.session.user) {
      try {
        result.data = await ctx.prisma.apiKeys.findMany({
          where: {
            userId: ctx.session.user.id,
          },
        });
        result.success = true;
      } catch (e) {
        result.error.push(e.message);
      }
    }

    return result;
  }),
});
