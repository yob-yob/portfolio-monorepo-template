<script lang="ts">
  import { onMount } from "svelte";
  import ProfileOrganizationList from "$lib/components/profile/profile-organization-list.svelte";
  import { breadcrumbs } from "$lib/composables/breadcrumbs.svelte";

  onMount(() => {
    const profileCrumb = breadcrumbs.addCrumb({
      href: "/profile",
      label: "Profile",
    });
    const organizationsCrumb = breadcrumbs.addCrumb({
      href: "/profile/organizations",
      label: "Organizations",
    });

    return () => {
      breadcrumbs.removeCrumb(organizationsCrumb);
      breadcrumbs.removeCrumb(profileCrumb);
    };
  });
</script>

<ProfileOrganizationList />
