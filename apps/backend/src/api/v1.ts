import { Elysia } from "elysia";

export const apiV1 = new Elysia({
    prefix: '/api/v1',
  })
  .get("/", () => "Hello Elysia");
