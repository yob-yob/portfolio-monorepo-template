<script>
  import { onMount } from "svelte";
  import { page } from "$app/state";
  import OrganizationSettingsNav from "$lib/components/organization-settings/organization-settings-nav.svelte";
  import { breadcrumbs } from "$lib/composables/breadcrumbs.svelte";
  import { OrganizationSettingsRoute } from "./+page.svelte";
  import { OrganizationBillingSettingsRoute } from "./billing/+page.svelte";
  import { OrganizationMembersSettingsRoute } from "./members/+page.svelte";
  import { OrganizationRBACSettingsRoute } from "./rbac/+page.svelte";
  import { OrganizationTeamsSettingsRoute } from "./teams/+page.svelte";

  const { children, params } = $props();

  onMount(() => {
    const OrganizationSettingsCrumb = breadcrumbs.addCrumb({
      href: OrganizationSettingsRoute(params.organizationSlug),
      label: "Organization Settings",
      sort_order: 2,
    });

    return () => {
      breadcrumbs.removeCrumb(OrganizationSettingsCrumb);
    };
  });

  const OrganizationSettingsRoutes = $derived({
    general: OrganizationSettingsRoute(params.organizationSlug),
    teams: OrganizationTeamsSettingsRoute(params.organizationSlug),
    members: OrganizationMembersSettingsRoute(params.organizationSlug),
    billing: OrganizationBillingSettingsRoute(params.organizationSlug),
    rbac: OrganizationRBACSettingsRoute(params.organizationSlug),
  });
</script>

<div class="mr-auto flex w-full max-w-5xl flex-col gap-8 lg:flex-row lg:gap-12">
  <aside class="lg:w-56 lg:shrink-0">
    <div class="space-y-4 lg:sticky lg:top-4">
      <div class="space-y-1 px-1">
        <h1 class="text-2xl font-semibold tracking-tight">
          Organization Settings
        </h1>
        <p class="text-muted-foreground text-sm">
          Manage your organization settings preferences.
        </p>
      </div>
      <OrganizationSettingsNav
        PageUrlPathName={page.url.pathname}
        {OrganizationSettingsRoutes}
      />
    </div>
  </aside>
  <main class="min-w-0 flex-1 space-y-8"> {@render children()} </main>
</div>
