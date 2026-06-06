// biome-ignore lint/correctness/noUnresolvedImports: false positive
import { randomUUIDv7, s3 } from "bun";
import { status } from "elysia";
import {
  getMimeTypeExtension,
  isSupportedMimeType,
} from "@/backend/utils/constants/supported-mime-types.ts";
import type { StorageModel } from "./model.ts";

export const StorageController = {
  handleStorageRequest: async (query: StorageModel["getStorageFileQuery"]) => {
    const fileData = s3.file(query.path);

    if (!(await fileData.exists())) {
      return status(404, { message: "File not found" });
    }

    return new Response(fileData);
  },
  handleUploadRequest: async (body: StorageModel["uploadStorageFileBody"]) => {
    // Upload the file to the S3 bucket
    const uploadedFiles = new Set<string>();
    const skippedUploadedFiles = new Set<{ file: string; reason: string }>();

    const filePath = `${body.contextType}/${body.contextId}/${body.location}`;

    for (const file of body.files) {
      if (!isSupportedMimeType(file.type)) {
        skippedUploadedFiles.add({
          file: file.name,
          reason: `Unsupported file type: ${file.type}`,
        });
        continue;
      }

      const fileName = `${randomUUIDv7()}.${getMimeTypeExtension(file.type)}`;
      const filePathAndName = `${filePath}/${fileName}`;

      const uploadFileToS3 = await s3.write(filePathAndName, file);

      if (uploadFileToS3 === 0) {
        skippedUploadedFiles.add({
          file: file.name,
          reason: "There was a problem trying to upload the file to storage",
        });
        continue;
      }

      // generate asset url
      const url = `${process.env.APP_URL}/storage?path=${filePathAndName}`;

      uploadedFiles.add(url);
    }

    return status(201, {
      files: Array.from(uploadedFiles),
      skippedFiles: Array.from(skippedUploadedFiles),
    });
  },
};
