<!-- Organization general settings page  -->
<script lang="ts" module>
  import { resolve } from "$app/paths";

  export const OrganizationSettingsRoute = (organizationSlug: string) =>
    resolve("/(app)/[organizationSlug]/settings", {
      organizationSlug,
    });
</script>

<script lang="ts">
  // import { onMount } from "svelte";
  // import { breadcrumbs } from "$lib/composables/breadcrumbs.svelte";

  // const { params } = $props();

  // // onMount(() => {
  // //   const OrganizationGeneralSettingsCrumb = breadcrumbs.addCrumb({
  // //     href: OrganizationSettingsRoute(params.organizationSlug),
  // //     label: "General",
  // //     sort_order: 3,
  // //   });

  // //   return () => {
  // //     breadcrumbs.removeCrumb(OrganizationGeneralSettingsCrumb);
  // //   };
  // // });
</script>

<h1>Organization General Settings</h1>
