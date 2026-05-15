import { db } from "@asset-tracking/database/db";
import { users } from "@asset-tracking/database/schemas/auth";
import { Elysia } from "elysia";

export const apiV1 = new Elysia({
  prefix: "/api/v1",
})
  .get("/", "Hello Elysia")
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
