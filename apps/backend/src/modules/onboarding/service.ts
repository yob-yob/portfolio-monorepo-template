import auth from "@city-os/auth/server";
import { db } from "@city-os/database/db";
import { users } from "@city-os/database/schemas/auth";
import { status } from "elysia";
import type { OnboardingModel } from "./model.ts";

export const OnboardingService = {
  async shouldOnBoard() {
    // Check if user belongs to an organization
    const user = await db.select().from(users).limit(1);

    return status(200, {
      shouldOnBoard: user.length === 0,
    });
  },
  async onboardingComplete(body: OnboardingModel["onboardingCompleteBody"]) {
    try {
      const data = await auth.api.signUpEmail({
        body: {
          name: body.name,
          email: body.email,
          password: body.password,
          callbackURL: "/onboarding/organization",
        },
      });

      return status(200, data);
    } catch (error) {
      return status(500, {
        message: (error as Error).message,
      });
    }
  },
};
