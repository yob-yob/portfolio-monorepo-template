import { emailOTPClient, organizationClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/svelte";

export const authClient = createAuthClient({
  baseURL: "http://localhost:3000",
  plugins: [organizationClient(), emailOTPClient()],
});

export type Session = typeof authClient.$Infer.Session;
export type User = Session["user"];
