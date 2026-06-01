<script lang="ts">
  import { onMount } from "svelte";

  import AppBreadcrumbs from "$lib/components/app-breadcrumbs.svelte";
  import AppSidebar from "$lib/components/app-sidebar.svelte";
  import { Separator } from "$lib/components/ui/separator/index.js";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import { breadcrumbs } from "$lib/composables/breadcrumbs.svelte";
  import { setActiveOrganizationSlug } from "$lib/contexts/active-organization.svelte.js";

  const { children, data, params } = $props();

  onMount(() => {
    const OrganizationHomeDashboardCrumb = breadcrumbs.addCrumb({
      href: "/",
      label: "Home",
      sort_order: 1,
    });

    return () => {
      breadcrumbs.removeCrumb(OrganizationHomeDashboardCrumb);
    };
  });

  setActiveOrganizationSlug(() => params.organizationSlug);
</script>

<!-- AUTH PAGES Layout -->
<Sidebar.Provider>
  <AppSidebar
    user={data.user}
    activeOrganizationSlug={params.organizationSlug}
  />
  <Sidebar.Inset>
    <header
      class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12"
    >
      <div class="flex items-center gap-2 px-4">
        <Sidebar.Trigger class="-ms-1" />
        <Separator
          orientation="vertical"
          class="me-2 data-[orientation=vertical]:h-4"
        />
        <AppBreadcrumbs />
      </div>
    </header>
    <div class="flex flex-1 flex-col gap-4 p-4 pt-0">
      {@render children()}
    </div>
  </Sidebar.Inset>
</Sidebar.Provider>
