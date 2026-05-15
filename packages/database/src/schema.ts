import { accounts, sessions, users, verifications } from "./schemas/auth.ts";

export const table = {
  users,
  sessions,
  accounts,
  verifications,
} as const;

export type Table = typeof table;
