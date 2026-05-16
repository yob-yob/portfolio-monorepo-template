import auth from "@asset-tracking/auth/server";
import { db } from "@asset-tracking/database/db";
import { users } from "@asset-tracking/database/schemas/auth";
import { Elysia, status, t } from "elysia";

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
  })
  .get("/onboarding", async () => {
    const user = await db.select().from(users).limit(1);

    return status(200, {
      shouldOnBoard: user.length === 0,
    });
  })
  .post(
    "/onboarding",
    async ({ body }) => {
      try {
        const data = await auth.api.signUpEmail({
          body: {
            name: body.name,
            email: body.email,
            password: body.password,
          },
        });

        return status(200, data);
      } catch (error) {
        return status(500, {
          message: (error as Error).message,
        });
      }
    },
    {
      body: t.Object({
        name: t.String(),
        email: t.String({
          format: "email",
        }),
        password: t.String({
          minLength: 8,
          maxLength: 20,
          description:
            "Password must be 8-20 chars with uppercase, lowercase, and a number.",
        }),
        confirmPassword: t.String(),
      }),
      beforeHandle({ body }) {
        if (body.password !== body.confirmPassword) {
          return status(400, {
            ok: false,
            message: "Passwords do not match",
          });
        }
      },
    }
  );
