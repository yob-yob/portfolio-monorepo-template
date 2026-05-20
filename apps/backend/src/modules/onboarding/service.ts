import auth from "@asset-tracking/auth/server";
import { db } from "@asset-tracking/database/db";
import { users } from "@asset-tracking/database/schemas/auth";
import { status } from "elysia";
import type { OnboardingModel } from "./model.ts";

export abstract class OnboardingService {
  static async shouldOnBoard() {
    const user = await db.select().from(users).limit(1);

    return status(200, {
      shouldOnBoard: user.length === 0,
    });
  }
  static async onboardingComplete(
    body: OnboardingModel["onboardingCompleteBody"]
  ) {
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
  }
}
