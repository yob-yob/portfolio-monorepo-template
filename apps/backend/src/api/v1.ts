import { db } from "@asset-tracking/database/db";
import { users } from "@asset-tracking/database/schemas/auth";
import Elysia from "elysia";
import { onboarding } from "@/backend/modules/onboarding/index.ts";
import { Upload } from "../modules/upload/index.ts";

export const apiV1 = new Elysia({
  prefix: "/api/v1",
  tags: ["API v1"],
})
  .use(onboarding)
  .use(Upload)
  .get("/health", async ({ status }) => {
    // test db
    const usersData = await db
      .select({ created_at: users.createdAt })
      .from(users)
      .limit(1);

    return status(200, {
      ok: true,
      usersData,
    });
  });
