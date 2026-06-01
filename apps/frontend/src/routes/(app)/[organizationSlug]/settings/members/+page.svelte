<!-- Organization general settings page  -->
<script lang="ts" module>
  import { resolve } from "$app/paths";

  export const OrganizationMembersSettingsRoute = (organizationSlug: string) =>
    resolve("/(app)/[organizationSlug]/settings/members", {
      organizationSlug,
    });
</script>

<script lang="ts">
  import { onMount } from "svelte";
  import { breadcrumbs } from "$lib/composables/breadcrumbs.svelte";

  const { params } = $props();

  onMount(() => {
    const OrganizationMembersSettingsCrumb = breadcrumbs.addCrumb({
      href: OrganizationMembersSettingsRoute(params.organizationSlug),
      label: "Members",
      sort_order: 3,
    });

    return () => {
      breadcrumbs.removeCrumb(OrganizationMembersSettingsCrumb);
    };
  });
</script>

<h1>Organization Members Settings</h1>
