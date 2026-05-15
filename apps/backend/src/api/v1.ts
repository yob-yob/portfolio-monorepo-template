import { db } from "@asset-tracking/database/db";
import { auth } from "@asset-tracking/database/schemas";
import { Elysia } from "elysia";

export const apiV1 = new Elysia({
  prefix: "/api/v1",
})
  .get("/", "Hello Elysia")
  .get("/health", async ({ status }) => {
    // test db
    const users = await db
      .select({ created_at: auth.users.createdAt })
      .from(auth.users)
      .limit(1);

    return status(200, {
      ok: true,
      users,
    });
  });
