import { db } from "@asset-tracking/database/db";
import { users } from "@asset-tracking/database/schemas/auth";
// biome-ignore lint/correctness/noUnresolvedImports: false positive
import { randomUUIDv7, s3 } from "bun";
import Elysia, { status, t } from "elysia";
import { onboarding } from "@/backend/modules/onboarding/index.ts";

export const apiV1 = new Elysia({
  prefix: "/api/v1",
  tags: ["API v1"],
})
  .use(onboarding)
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

  .post(
    "/upload",
    async ({ body }) => {
      // Upload the file to the S3 bucket
      const uploadedFiles = new Set<string>();

      for (const file of body.files) {
        const fileName = `${body.location}/${randomUUIDv7()}.${file.type.split("/")[1]}`;
        await s3.write(fileName, file);

        // generate asset url
        const url = `${process.env.APP_URL}/storage?path=${fileName}`;

        uploadedFiles.add(url);
      }

      return status(201, {
        files: Array.from(uploadedFiles),
      });
    },
    {
      body: t.Object({
        location: t.String({
          enum: ["avatar"],
        }),
        files: t.Files(),
      }),
      response: {
        201: t.Object({
          files: t.Array(t.String()),
        }),
      },
    }
  );
