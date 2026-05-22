import { t, type UnwrapSchema } from "elysia";

export const HealthModel = {
  HealthSuccessReponse: t.Object({
    api_is_reachable: t.Boolean(),
    db_is_reachable: t.Boolean(),
  }),
};

// Optional, cast all model to TypeScript type
export type HealthModel = {
  [k in keyof typeof HealthModel]: UnwrapSchema<(typeof HealthModel)[k]>;
};
