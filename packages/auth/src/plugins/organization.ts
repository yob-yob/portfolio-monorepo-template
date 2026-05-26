import { organization } from "better-auth/plugins";

export const organizationPlugin = organization({
  teams: {
    enabled: true,
  },
  allowUserToCreateOrganization: () => {
    // TODO: Only Allow Users to create if they don't have an existing organizations
    // Users can only create 1 free organization
    return true;
  },
});
