// biome-ignore lint/correctness/noUnresolvedImports: false positive
import { randomUUIDv7, s3 } from "bun";
import { status } from "elysia";
import type { UploadModel } from "./model.ts";

export const UploadController = {
  handleUploadRequest: async (body: UploadModel["UploadBody"]) => {
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
};
