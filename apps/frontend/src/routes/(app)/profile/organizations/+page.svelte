<script lang="ts" module>
  import { resolve } from "$app/paths";

  export const ProfileOrganizationsRoute = () =>
    resolve("/(app)/profile/organizations");
</script>

<script lang="ts">
  import { onMount } from "svelte";
  import ProfileOrganizationList from "$lib/components/profile/profile-organization-list.svelte";
  import { breadcrumbs } from "$lib/composables/breadcrumbs.svelte";

  onMount(() => {
    const organizationsCrumb = breadcrumbs.addCrumb({
      href: ProfileOrganizationsRoute(),
      label: "Organizations",
      sort_order: 3,
    });

    return () => {
      breadcrumbs.removeCrumb(organizationsCrumb);
    };
  });
</script>

<ProfileOrganizationList />
