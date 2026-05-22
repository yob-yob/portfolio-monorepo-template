import { db } from "@asset-tracking/database/db";
import { users } from "@asset-tracking/database/schemas/auth";
import type { HealthModel } from "./model.ts";

export const HealthService = {
  healthCheck: async (): Promise<HealthModel["HealthSuccessReponse"]> => {
    // test db
    let can_connect_to_db = true;

    try {
      await db.select({ created_at: users.createdAt }).from(users).limit(1);
    } catch (err) {
      console.error(err);
      can_connect_to_db = false;
    }

    return {
      api_is_reachable: true, // if user has reached this route then API is reachable...
      db_is_reachable: can_connect_to_db,
    };
  },
};
