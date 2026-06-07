import {
  emailOTPClient,
  inferOrgAdditionalFields,
  organizationClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/svelte";
import type { AuthConfig } from "./auth.ts";

const baseURL = import.meta.env.VITE_PUBLIC_API_URL ?? "http://localhost:3000";

console.log("BetterAuth PUBLIC_API_URL:", baseURL);

export const authClient = createAuthClient({
  baseURL,
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
