import staticPlugin from "@elysia/static";
import { Elysia } from "elysia";
import { apiV1 } from "./api/v1";
import { openapi } from '@elysia/openapi'

// Initializing the APP
export const app = (new Elysia())
  .use(openapi())
  .use(await staticPlugin({'prefix': ""}))
  .use(apiV1);

export type App = typeof app;
