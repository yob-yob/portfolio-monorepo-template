import { redirect } from "@sveltejs/kit";

export const load = ({ locals, url }) => {
  if (!locals.user) {
    if (url.pathname.startsWith("/install")) {
      return {};
    }

    if (url.pathname.startsWith("/auth")) {
      return {};
    }

    redirect(307, "/auth/login");
  }

  return {
    user: locals.user,
    session: locals.session,
  };
};
