<!-- Organization general settings page  -->
<script lang="ts">
  import { onMount } from "svelte";
  import { resolve } from "$app/paths";
  import { breadcrumbs } from "$lib/composables/breadcrumbs.svelte";

  const { params } = $props();

  onMount(() => {
    const OrgTeamSettings = breadcrumbs.addCrumb({
      href: resolve("/(app)/[organizationSlug]/settings/teams", {
        organizationSlug: params.organizationSlug,
      }),
      label: "Teams",
      sort_order: 3,
    });

    return () => {
      breadcrumbs.removeCrumb(OrgTeamSettings);
    };
  });
</script>

<h1>Organization Team Settings</h1>
