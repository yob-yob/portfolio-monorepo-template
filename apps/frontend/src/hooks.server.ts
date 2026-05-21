import { authClient } from "@asset-tracking/auth/client";

export async function handle({ event, resolve }) {
  // Fetch current session from Better Auth
  const session = await authClient.getSession({
    fetchOptions: {
      headers: event.request.headers,
    },
  });

  // Make session and user available on server
  if (session?.data) {
    event.locals.user = session.data.user;
    event.locals.session = session.data.session;
  }

  return resolve(event);
}
