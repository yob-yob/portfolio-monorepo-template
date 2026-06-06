import Elysia from "elysia";
import { onboarding } from "@/backend/modules/onboarding/index.ts";
import { health } from "../modules/health/index.ts";
import { setup } from "../modules/setup/index.ts";

export const apiV1 = new Elysia({
  prefix: "/api/v1",
  tags: ["API v1"],
})
  .use(onboarding)
  .use(setup)
  .use(health);
