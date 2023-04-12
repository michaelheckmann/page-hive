import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { protectedApiProcedure } from "./../trpc";

export const categoryRouter = createTRPCRouter({
  getAll: protectedApiProcedure.query(({ ctx }) => {
    return ctx.prisma.category.findMany({
      where: {
        archived: false,
      },
    });
  }),
  getBySlug: protectedProcedure
    .input(z.object({ slug: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.category.findUnique({
        where: {
          slug: input.slug,
        },
      });
    }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        slug: z.string(),
        icon: z.string().optional(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.category.create({
        data: {
          name: input.name,
          slug: input.slug,
          icon: input.icon,
        },
      });
    }),
});
