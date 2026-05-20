import { openapi } from "@elysia/openapi";
// import { staticPlugin } from "@elysia/static";
import { Elysia } from "elysia";
import { apiV1 } from "./api/v1.ts";
import { authOpenApiSchema, betterAuth } from "./auth.ts";
import { storage } from "./modules/storage/index.ts";

// Initializing the APP
export const app = new Elysia()
  .use(
    openapi({
      documentation: {
        components: await authOpenApiSchema.components,
        paths: await authOpenApiSchema.getPaths(),
      },
    })
  )
  .use(betterAuth)
  // .use(await staticPlugin({ prefix: "", indexHTML: true }))
  .use(apiV1)
  .use(storage);

export type App = typeof app;
