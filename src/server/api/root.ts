import { categoryRouter } from "./routers/category";
import { linkRouter } from "./routers/link";
import { tagRouter } from "./routers/tag";
import { createTRPCRouter } from "./trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  category: categoryRouter,
  tag: tagRouter,
  link: linkRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
