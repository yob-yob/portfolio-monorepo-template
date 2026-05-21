// client.ts

import type { App } from "@asset-tracking/backend/app";
import { treaty } from "@elysia/eden";
import { PUBLIC_API_URL } from "$env/static/public";

export const backend = treaty<App>(PUBLIC_API_URL);
