/**
 * DOCS:
 *
 * Understanding storage context types...
 * Storage Context is a way to know what an upload is for.
 * example:
 * Organization Context means that all uploads goes to the /organization/${organizationId} directory
 * and User context means that all uploads  goes to the /user/${userId} directory
 */

import { t, type UnwrapSchema } from "elysia";

export const supportedStorageContextTypes = ["organization", "user"] as const;

export const StorageModel = {
  getStorageFileQuery: t.Object({
    path: t.String(),
  }),
  uploadStorageFileBody: t.Object({
    contextType: t.String({
      enum: supportedStorageContextTypes,
    }),
    contextId: t.String(),
    location: t.String(),
    files: t.Files(),
  }),
  uploadStorageFileSuccessReponse: t.Object({
    files: t.Array(t.String()),
  }),
};

export type supportedStorageContextTypes =
  (typeof supportedStorageContextTypes)[number];

// Optional, cast all model to TypeScript type
export type StorageModel = {
  [k in keyof typeof StorageModel]: UnwrapSchema<(typeof StorageModel)[k]>;
};
