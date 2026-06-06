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
import type { StrictFileType } from "elysia/type-system/types";

export const supportedStorageContextTypes = [
  "organization",
  "organization/team",
  "user",
] as const;

// TODO: Put this in a CONFIG file, so that it's easier to find and modify
export const supportedFileTypes: StrictFileType[] = [
  "image/*",
  "video/*",
  "text/*",
  "audio/*",
  "application/json",
  "application/pdf",
  "application/xml",
  "application/zip",
] as const;

export const StorageModel = {
  getStorageFileQuery: t.Object({
    path: t.String(),
    v: t.Optional(t.String()),
  }),
  requestUploadFiles: t.Object({
    contextType: t.String({
      enum: supportedStorageContextTypes,
    }),
    contextId: t.String(),
    location: t.String(),
    files: t.Array(
      t.Object({
        name: t.String(),
        type: t.String(),
        size: t.Number(),
        versioned: t.Boolean(),
      })
    ),
  }),
  requestUploadFileUrls: t.Object({
    fileUploadUrls: t.Array(
      t.Object({
        fileName: t.String(),
        url: t.String(),
        path: t.String(),
      })
    ),
    skippedFiles: t.Array(
      t.Object({
        fileName: t.String(),
        reason: t.String(),
      })
    ),
  }),
};

export type supportedStorageContextTypes =
  (typeof supportedStorageContextTypes)[number];

// Optional, cast all model to TypeScript type
export type StorageModel = {
  [k in keyof typeof StorageModel]: UnwrapSchema<(typeof StorageModel)[k]>;
};
