import { t, type UnwrapSchema } from "elysia";

export const StorageModel = {
  getStorageFileQuery: t.Object({
    path: t.String(),
  }),
};

// Optional, cast all model to TypeScript type
export type StorageModel = {
  [k in keyof typeof StorageModel]: UnwrapSchema<(typeof StorageModel)[k]>;
};
