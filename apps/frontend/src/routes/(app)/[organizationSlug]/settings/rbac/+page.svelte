<!-- Organization teams settings page -->
<script lang="ts" module>
  import { resolve } from "$app/paths";

  export const OrganizationRBACSettingsRoute = (organizationSlug: string) =>
    resolve("/(app)/[organizationSlug]/settings/rbac", {
      organizationSlug,
    });
</script>

<h1> Organization RBAC Settings Page </h1>
