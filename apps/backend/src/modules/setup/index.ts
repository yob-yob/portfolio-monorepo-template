import { Elysia } from "elysia";
import { SetupModel } from "./model.ts";
import { SetupService } from "./service.ts";

export const setup = new Elysia()
  .get("/setup", async () => SetupService.shouldSetup())
  .post("/setup", async ({ body }) => await SetupService.setupComplete(body), {
    body: SetupModel.setupCompleteBody,
  });
