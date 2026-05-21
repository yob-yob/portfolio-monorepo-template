import { openapi } from "@elysia/openapi";
import { Elysia } from "elysia";
import { apiV1 } from "@/backend/api/v1.ts";
import { authOpenApiSchema, betterAuth } from "@/backend/auth.ts";
import { storage } from "@/backend/modules/storage/index.ts";

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
  .use(apiV1)
  .use(storage);

export type App = typeof app;
