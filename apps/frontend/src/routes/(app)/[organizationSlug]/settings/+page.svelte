<!-- Organization general settings page -->
<script lang="ts" module>
  import { resolve } from "$app/paths";

  export const OrganizationSettingsRoute = (organizationSlug: string) =>
    resolve("/(app)/[organizationSlug]/settings", {
      organizationSlug,
    });
</script>

<script lang="ts">
  import { onMount } from "svelte";
  import OrganizationLogoForm from "$lib/components/organization-settings/organization-logo-form.svelte";
  import OrganizationNameForm from "$lib/components/organization-settings/organization-name-form.svelte";
  import OrganizationSlugForm from "$lib/components/organization-settings/organization-slug-form.svelte";
  import OrganizationSwitchOwnerForm from "$lib/components/organization-settings/organization-switch-owner-form.svelte";
  import { breadcrumbs } from "$lib/composables/breadcrumbs.svelte";

  const { params, data } = $props();
  const currentOrganizationSlug = $derived(params.organizationSlug);

  onMount(() => {
    const OrganizationGeneralSettingsCrumb = breadcrumbs.addCrumb({
      href: OrganizationSettingsRoute(currentOrganizationSlug),
      label: "General",
      sort_order: 3,
    });

    return () => {
      breadcrumbs.removeCrumb(OrganizationGeneralSettingsCrumb);
    };
  });
</script>

<div class="space-y-6">
  <div class="space-y-1">
    <h2 class="text-2xl font-semibold tracking-tight">General</h2>
    <p class="text-muted-foreground text-sm">
      Manage your organization's identity, URL slug, and ownership.
    </p>
  </div>

  <OrganizationLogoForm
    organizationName={data.organization.name}
    organizationId={data.organization.id}
    logoPreview={data.organization.logo ?? ""}
  />
  <OrganizationNameForm organizationName={data.organizationName} />
  <OrganizationSlugForm organizationSlug={currentOrganizationSlug} />
  <OrganizationSwitchOwnerForm />
</div>
