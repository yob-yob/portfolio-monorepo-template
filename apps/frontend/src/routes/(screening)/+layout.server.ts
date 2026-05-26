import { redirect } from "@sveltejs/kit";

export const load = ({ locals }) => {
  if (!(locals.user && locals.session)) {
    redirect(307, "/auth/login");
  }

  return {
    user: locals.user,
    session: locals.session,
  };
};
