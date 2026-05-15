// client.ts

import type { App } from "@asset-tracking/backend/app";
import { treaty } from "@elysia/eden";

export const api = treaty<App>(window.location.origin);
