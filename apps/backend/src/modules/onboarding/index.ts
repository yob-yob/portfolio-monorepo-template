import { Elysia } from "elysia";
import { same } from "@/backend/utils/validation.ts";
import { OnboardingModel } from "./model.ts";
import { OnboardingService } from "./service.ts";

export const onboarding = new Elysia()
  .get("/onboarding", async () => OnboardingService.shouldOnBoard())
  .post(
    "/onboarding",
    async ({ body }) => await OnboardingService.onboardingComplete(body),
    {
      body: OnboardingModel.onboardingCompleteBody,
      beforeHandle({ body }) {
        same(body.password, body.confirmPassword);
      },
    }
  );
