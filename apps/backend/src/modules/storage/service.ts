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
  handleUploadRequest: (body: StorageModel["requestUploadFiles"]) => {
    // Upload the file to the S3 bucket
    const uploadUrls = new Set<{
      fileName: string;
      url: string;
      path: string;
    }>();
    const skippedUploadedFiles = new Set<{
      fileName: string;
      reason: string;
    }>();

    const fileDirectory = `${body.contextType}/${body.contextId}/${body.location}`;

    for (const file of body.files) {
      if (!isSupportedMimeType(file.type)) {
        skippedUploadedFiles.add({
          fileName: file.name,
          reason: `Unsupported file type: ${file.type} - File name: ${file.name}`,
        });
        continue;
      }

      const fileName = file.name
        ? file.name
        : `${randomUUIDv7()}.${getMimeTypeExtension(file.type)}`;

      const filePathAndName = `${fileDirectory}/${fileName}`;

      const fullUrl = new URL(process.env.APP_URL ?? "");

      fullUrl.pathname = "/storage";

      fullUrl.searchParams.append("path", filePathAndName);

      if (file.versioned) {
        fullUrl.searchParams.append("v", Date.now().toString());
      }

      uploadUrls.add({
        fileName: file.name,
        url: s3.presign(filePathAndName, {
          method: "PUT",
          expiresIn: 1 * 60 * 60, // 1 hour
        }),
        path: fullUrl.toString(),
      });
    }

    return status(201, {
      fileUploadUrls: Array.from(uploadUrls),
      skippedFiles: Array.from(skippedUploadedFiles),
    });
  },
};
