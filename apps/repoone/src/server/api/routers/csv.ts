import { S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { env } from "~/env.mjs";

export const csvRouter = createTRPCRouter({
  uploadCsv: protectedProcedure
    .input(
      z.object({
        fileName: z.string(),
        fileType: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const {
        user: { id },
      } = ctx.session;
      try {
        const client = new S3Client({
          region: "us-east-1",
        });
        const post = await createPresignedPost(client, {
          Bucket: env.CSV_IMPORT_S3_BUCKET,
          Key: `${id}/${input.fileName}`,
          Fields: {
            "Content-Type": input.fileType,
          },
          Expires: 60, // seconds
        });

        return post;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Error creating s3 Presigned Post (${error})`,
        });
      }
    }),

  saveUploadedCsvName: protectedProcedure
    .input(
      z.object({
        fileName: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.csvFile.create({
        data: {
          fileName: input.fileName,
          userId: ctx.session.user.id,
        },
      });
    }),
});
