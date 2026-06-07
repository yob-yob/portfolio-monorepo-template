import type { App } from "@city-os/backend/app";
import { treaty } from "@elysia/eden";
import { PUBLIC_API_URL } from "$env/static/public";

console.log("SvelteKit PUBLIC_API_URL:", PUBLIC_API_URL);

export const backend = treaty<App>(PUBLIC_API_URL);
