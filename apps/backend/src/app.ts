import { openapi } from "@elysia/openapi";
import staticPlugin from "@elysia/static";
import { Elysia } from "elysia";

import { apiV1 } from "./api/v1.ts";
import { betterAuth } from "./auth.ts";

// Initializing the APP
export const app = new Elysia()
  .mount(betterAuth)
  .onError(({ error }) => new Response(error.toString()))
  .use(openapi())
  .use(await staticPlugin({ prefix: "" }))
  .use(apiV1);

export type App = typeof app;
