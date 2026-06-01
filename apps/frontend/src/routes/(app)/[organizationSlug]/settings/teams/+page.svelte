<!-- Organization general settings page  -->
<script lang="ts" module>
  import { resolve } from "$app/paths";

  export const OrganizationTeamsSettingsRoute = (organizationSlug: string) =>
    resolve("/(app)/[organizationSlug]/settings/teams", {
      organizationSlug,
    });
</script>

<script lang="ts">
  import { onMount } from "svelte";
  import { breadcrumbs } from "$lib/composables/breadcrumbs.svelte";

  const { params } = $props();

  onMount(() => {
    const OrgTeamSettings = breadcrumbs.addCrumb({
      href: OrganizationTeamsSettingsRoute(params.organizationSlug),
      label: "Teams",
      sort_order: 3,
    });

    return () => {
      breadcrumbs.removeCrumb(OrgTeamSettings);
    };
  });
</script>

<h1>Organization Team Settings</h1>
