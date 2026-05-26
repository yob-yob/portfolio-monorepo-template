import { authClient } from "@asset-tracking/auth/client";

export async function handle({ event, resolve }) {
  // Fetch current session from Better Auth
  const session = await authClient.getSession({
    fetchOptions: {
      headers: event.request.headers,
    },
  });

  if (session?.data) {
    event.locals.user = session.data.user;
    event.locals.session = {
      ...session.data.session,
      activeOrganizationId: session.data.session.activeOrganizationId ?? null,
    };
  } else {
    event.locals.user = null;
    event.locals.session = null;
  }

  return resolve(event);
}
