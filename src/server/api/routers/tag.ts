import { z } from "zod";
import {
  createTRPCRouter,
  protectedApiProcedure,
  protectedProcedure,
} from "../trpc";

export const tagRouter = createTRPCRouter({
  getAll: protectedApiProcedure.query(({ ctx }) => {
    return ctx.prisma.tag.findMany({
      where: {
        archived: false,
      },
    });
  }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.tag.create({
        data: {
          name: input.name,
        },
      });
    }),
});
