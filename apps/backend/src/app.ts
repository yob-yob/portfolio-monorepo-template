import { openapi } from "@elysia/openapi";
import { Elysia } from "elysia";
import { apiV1 } from "./api/v1.ts";
import { authOpenApiSchema, betterAuth } from "./auth.ts";

// Initializing the APP
export const app = new Elysia()
  .onError(({ error }) => new Response(error.toString()))
  .use(
    openapi({
      documentation: {
        components: await authOpenApiSchema.components,
        paths: await authOpenApiSchema.getPaths(),
      },
    })
  )
  .use(betterAuth)
  // .use(await staticPlugin({ prefix: "" }))
  .use(apiV1);

export type App = typeof app;
