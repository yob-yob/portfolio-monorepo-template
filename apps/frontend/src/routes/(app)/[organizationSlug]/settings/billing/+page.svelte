<!-- Organization general settings page  -->
<script lang="ts" module>
  import { resolve } from "$app/paths";

  export const OrganizationBillingSettingsRoute = (organizationSlug: string) =>
    resolve("/(app)/[organizationSlug]/settings/billing", {
      organizationSlug,
    });
</script>

<script lang="ts">
  import { onMount } from "svelte";
  import { breadcrumbs } from "$lib/composables/breadcrumbs.svelte";

  const { params } = $props();

  onMount(() => {
    const OrganizationBillingSettingsCrumb = breadcrumbs.addCrumb({
      href: OrganizationBillingSettingsRoute(params.organizationSlug),
      label: "Billing",
      sort_order: 3,
    });

    return () => {
      breadcrumbs.removeCrumb(OrganizationBillingSettingsCrumb);
    };
  });
</script>

<h1>Organization Billing Settings</h1>
