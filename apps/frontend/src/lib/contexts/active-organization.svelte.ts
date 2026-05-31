// context.ts (Shared file)
import { createContext } from "svelte";

// Generates typed getter and setter pairs
export const [getActiveOrganizationSlug, setActiveOrganizationSlug] =
  createContext<() => string>();
