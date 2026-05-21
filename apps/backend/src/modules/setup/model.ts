import { t, type UnwrapSchema } from "elysia";

export const SetupModel = {
  setupCompleteBody: t.Object({
    name: t.String(),
    email: t.String({
      format: "email",
    }),
    password: t.String({
      minLength: 8,
      maxLength: 20,
      description:
        "Password must be 8-20 chars with uppercase, lowercase, and a number.",
    }),
  }),
};

// Optional, cast all model to TypeScript type
export type SetupModel = {
  [k in keyof typeof SetupModel]: UnwrapSchema<(typeof SetupModel)[k]>;
};
