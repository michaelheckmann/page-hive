import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

/* ZOD SCHEMA DEFINITIONS */
const baseLinkShape = z.object({
  url: z.string().url(),
  image: z.string().url(),
  title: z.string(),
  description: z.string(),
  comment: z.string(),
});

const createCategoryShape = z.object({
  transaction: z.literal("create"),
  name: z.string(),
  slug: z.string(),
  icon: z.string().optional(),
});
const connectCategoryShape = z.object({
  transaction: z.literal("connect"),
  id: z.string(),
});
const categoryShape = z.discriminatedUnion("transaction", [
  createCategoryShape,
  connectCategoryShape,
]);

const createTagShape = z.object({
  transaction: z.literal("create"),
  name: z.string(),
});
const connectTagShape = z.object({
  transaction: z.literal("connect"),
  id: z.string(),
});
const tagShape = z.array(
  z.discriminatedUnion("transaction", [createTagShape, connectTagShape])
);

export const linkRouter = createTRPCRouter({
  getByCategorySlug: protectedProcedure
    .input(z.object({ slug: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.link.findMany({
        where: {
          archived: false,
          category: {
            slug: input.slug,
          },
        },
        include: {
          TagsOnLinks: {
            include: {
              tag: true,
            },
          },
        },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        link: baseLinkShape,
        category: categoryShape,
        tag: tagShape,
      })
    )
    .mutation(({ ctx, input }) => {
      const { link, category, tag } = input;

      return ctx.prisma.link.create({
        data: {
          url: link.url,
          image: link.image,
          title: link.title,
          description: link.description,
          comment: link.comment,
          category: {
            create:
              category.transaction === "create"
                ? {
                    name: category.name,
                    slug: category.slug,
                    icon: category.icon,
                  }
                : undefined,
            connect:
              category.transaction === "connect"
                ? {
                    id: category.id,
                  }
                : undefined,
          },
          TagsOnLinks: {
            create: tag.map((tag) => ({
              tag: {
                create:
                  tag.transaction === "create"
                    ? {
                        name: tag.name,
                      }
                    : undefined,
                connect:
                  tag.transaction === "connect"
                    ? {
                        id: tag.id,
                      }
                    : undefined,
              },
            })),
          },
        },
      });
    }),

  update: protectedProcedure
    .input(
      z
        .object({
          id: z.string(),
          link: baseLinkShape,
          category: categoryShape,
          tag: tagShape,
        })
        .deepPartial()
    )
    .mutation(({ ctx, input }) => {
      const { id, link, category, tag } = input;
      return ctx.prisma.link.update({
        where: {
          id,
        },
        data: {
          url: link?.url,
          image: link?.image,
          title: link?.title,
          description: link?.description,
          comment: link?.comment,
          category: {
            create:
              category?.transaction === "create"
                ? {
                    name: category.name,
                    slug: category.slug,
                    icon: category.icon,
                  }
                : undefined,
            connect:
              category?.transaction === "connect"
                ? {
                    id: category.id,
                  }
                : undefined,
          },
          TagsOnLinks: {
            create: tag?.map((tag) => ({
              tag: {
                create:
                  tag.transaction === "create"
                    ? {
                        name: tag.name,
                      }
                    : undefined,
                connect:
                  tag.transaction === "connect"
                    ? {
                        id: tag.id,
                      }
                    : undefined,
              },
            })),
          },
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.link.update({
        where: {
          id: input.id,
        },
        data: {
          archived: true,
        },
      });
    }),
});
