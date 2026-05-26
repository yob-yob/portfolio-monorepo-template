import { redirect } from "@sveltejs/kit";

export const load = ({ locals }) => {
  if (!(locals.user && locals.session)) {
    redirect(307, "/auth/login");
  }

  if (locals.session.activeOrganizationId) {
    redirect(307, "/");
  }

  return {
    user: locals.user,
    session: locals.session,
  };
};
