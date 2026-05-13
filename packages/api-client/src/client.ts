// client.ts
import { treaty } from '@elysia/eden'
import type { App } from '@asset-tracking/backend/app'

export const api = treaty<App>(window.location.origin)
