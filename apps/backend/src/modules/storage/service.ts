// biome-ignore lint/correctness/noUnresolvedImports: false positive
import { s3 } from "bun";
import { status } from "elysia";
import type { StorageModel } from "./model.ts";

export const StorageController = {
  handleStorageRequest: async (query: StorageModel["getStorageFileQuery"]) => {
    const fileData = s3.file(query.path);

    if (!(await fileData.exists())) {
      return status(404, { message: "File not found" });
    }

    return new Response(fileData);
  },
};
