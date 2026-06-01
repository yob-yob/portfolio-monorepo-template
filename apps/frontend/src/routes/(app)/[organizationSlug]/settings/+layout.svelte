<script>
  import { onMount } from "svelte";
  import { resolve } from "$app/paths";
  import { breadcrumbs } from "$lib/composables/breadcrumbs.svelte";

  const { children, params } = $props();

  onMount(() => {
    const OrganizationSettingsCrumb = breadcrumbs.addCrumb({
      href: resolve("/(app)/[organizationSlug]/settings/general", {
        organizationSlug: params.organizationSlug,
      }),
      label: "Organization Settings",
      sort_order: 2,
    });

    return () => {
      breadcrumbs.removeCrumb(OrganizationSettingsCrumb);
    };
  });
</script>

{@render children()}
