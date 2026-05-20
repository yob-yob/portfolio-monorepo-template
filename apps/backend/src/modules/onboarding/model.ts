import { t, type UnwrapSchema } from "elysia";

export const OnboardingModel = {
  onboardingCompleteBody: t.Object({
    name: t.String(),
    organizationName: t.String(),
    email: t.String({
      format: "email",
    }),
    password: t.String({
      minLength: 8,
      maxLength: 20,
      description:
        "Password must be 8-20 chars with uppercase, lowercase, and a number.",
    }),
    confirmPassword: t.String(),
  }),
};

// Optional, cast all model to TypeScript type
export type OnboardingModel = {
  [k in keyof typeof OnboardingModel]: UnwrapSchema<
    (typeof OnboardingModel)[k]
  >;
};
