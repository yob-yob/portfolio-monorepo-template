import { Elysia } from "elysia";
import { StorageModel } from "./model.ts";
import { StorageController } from "./service.ts";

export const storage = new Elysia().get(
  "/storage",
  async ({ query }) => StorageController.handleStorageRequest(query),
  {
    query: StorageModel.getStorageFileQuery,
  }
);
