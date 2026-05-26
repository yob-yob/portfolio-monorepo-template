import auth from "@city-os/auth/server";
import { db } from "@city-os/database/db";
import { users } from "@city-os/database/schemas/auth";
import { status } from "elysia";
import type { SetupModel } from "./model.ts";

export abstract class SetupService {
  static async shouldSetup() {
    const user = await db.select().from(users).limit(1);

    return status(200, {
      shouldSetup: user.length === 0,
    });
  }
  static async setupComplete(body: SetupModel["setupCompleteBody"]) {
    try {
      const data = await auth.api.signUpEmail({
        body: {
          name: body.name,
          email: body.email,
          password: body.password,
          callbackURL: "/setup/complete",
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
