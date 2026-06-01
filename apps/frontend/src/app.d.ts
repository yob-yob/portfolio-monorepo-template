// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { Session } from "@city-os/auth/client";

declare global {
  // biome-ignore lint/style/noNamespace: SvelteKit
  namespace App {
    interface Error {
      code: string;
      message: string;
    }
    interface Locals {
      session: Session["session"] | null;
      user: Session["user"] | null;
    }
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}
