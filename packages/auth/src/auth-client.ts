import { organizationClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/svelte";

export const authClient = createAuthClient({
  baseURL: "http://localhost:3000",
  plugins: [organizationClient()],
});

export type { Session, User } from "better-auth/types";
