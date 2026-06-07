import {
  emailOTPClient,
  inferOrgAdditionalFields,
  organizationClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/svelte";
import type { AuthConfig } from "./auth.ts";

export const authClient = createAuthClient({
  baseURL: "http://localhost:3000",
  plugins: [
    organizationClient({
      teams: {
        enabled: true,
      },
      schema: inferOrgAdditionalFields<AuthConfig>(),
    }),
    emailOTPClient(),
  ],
});

export type Session = typeof authClient.$Infer.Session;
export type User = Session["user"];
