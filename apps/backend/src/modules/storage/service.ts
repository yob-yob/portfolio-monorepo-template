// biome-ignore lint/correctness/noUnresolvedImports: false positive
import { randomUUIDv7, s3 } from "bun";
import { status } from "elysia";
import type { StorageModel } from "./model.ts";

export const StorageController = {
  handleStorageRequest: async (query: StorageModel["getStorageFileQuery"]) => {
    const fileData = s3.file(query.path);

    console.log(query.path);

    if (!(await fileData.exists())) {
      return status(404, { message: "File not found" });
    }

    return new Response(fileData);
  },
  handleUploadRequest: async (body: StorageModel["uploadStorageFileBody"]) => {
    // Upload the file to the S3 bucket
    const uploadedFiles = new Set<string>();

    const fileLocation = `${body.contextType}/${body.contextId}/${body.location}`;

    for (const file of body.files) {
      const filePathAndName = `${fileLocation}/${randomUUIDv7()}.${file.type.split("/")[1]}`;
      await s3.write(filePathAndName, file);

      // generate asset url
      const url = `${process.env.APP_URL}/storage?path=${filePathAndName}`;

      uploadedFiles.add(url);
    }

    return status(201, {
      files: Array.from(uploadedFiles),
    });
  },
};
