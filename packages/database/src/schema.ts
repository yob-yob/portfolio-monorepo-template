import * as AuthSchema from "./schemas/auth.ts";

export const schema = {
  ...AuthSchema,
} as const;

export type Schema = typeof schema;
