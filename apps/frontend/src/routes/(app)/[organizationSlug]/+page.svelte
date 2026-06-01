<!-- Organization DASHBOARD -->
<script lang="ts" module>
  export const OrganizationDashboardRoute = (organizationSlug: string) =>
    resolve("/(app)/[organizationSlug]", {
      organizationSlug,
    });
</script>

<script lang="ts">
  import { onMount } from "svelte";
  import { resolve } from "$app/paths";
  import { breadcrumbs } from "$lib/composables/breadcrumbs.svelte";

  onMount(() => {
    const OrganizationDashboardCrumb = breadcrumbs.addCrumb({
      href: "/",
      label: "Dashboard",
      sort_order: 2,
    });

    return () => {
      breadcrumbs.removeCrumb(OrganizationDashboardCrumb);
    };
  });
</script>

<div class="grid auto-rows-min gap-4 md:grid-cols-3">
  <div class="bg-muted/50 aspect-video rounded-xl text-white">test</div>
  <div class="bg-muted/50 aspect-video rounded-xl text-white">test</div>
  <div class="bg-muted/50 aspect-video rounded-xl text-white">test</div>
</div>
<div class="bg-muted/50 min-h-screen flex-1 rounded-xl md:min-h-min"></div>
