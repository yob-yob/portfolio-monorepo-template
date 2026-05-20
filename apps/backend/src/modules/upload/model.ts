import { t, type UnwrapSchema } from "elysia";

export const UploadModel = {
  UploadBody: t.Object({
    location: t.String({
      enum: ["avatar"],
    }),
    files: t.Files(),
  }),
  UploadSuccessReponse: t.Object({
    files: t.Array(t.String()),
  }),
};

// Optional, cast all model to TypeScript type
export type UploadModel = {
  [k in keyof typeof UploadModel]: UnwrapSchema<(typeof UploadModel)[k]>;
};
