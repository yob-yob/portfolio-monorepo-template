import { Elysia } from "elysia";
import { HealthModel } from "./model.ts";
import { HealthService } from "./service.ts";

export const health = new Elysia().get(
  "/health",
  async () => HealthService.healthCheck(),
  {
    response: {
      200: HealthModel.HealthSuccessReponse,
    },
  }
);
