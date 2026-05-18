import { openapi } from "@elysia/openapi";
// import { staticPlugin } from "@elysia/static";
// biome-ignore lint/correctness/noUnresolvedImports: false positive
import { s3 } from "bun";
import { Elysia, status, t } from "elysia";
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
  // .use(await staticPlugin({ prefix: "", indexHTML: true }))
  .use(apiV1)
  .get(
    "/storage",
    async ({ query }) => {
      const fileData = s3.file(query.path);

      if (!(await fileData.exists())) {
        return status(404, { message: "File not found" });
      }

      return new Response(fileData);
    },
    {
      query: t.Object({
        path: t.String(),
      }),
    }
  );

export type App = typeof app;
