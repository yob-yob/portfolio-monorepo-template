import { accounts, users } from "./schemas/auth.ts";

export const table = {
  users,
  accounts,
} as const;

export type Table = typeof table;
