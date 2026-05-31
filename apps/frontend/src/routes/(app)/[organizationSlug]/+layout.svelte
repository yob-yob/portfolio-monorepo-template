<script lang="ts">
  import { onMount } from "svelte";
  import AppSidebar from "$lib/components/app-sidebar.svelte";
  import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js";
  import { Separator } from "$lib/components/ui/separator/index.js";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import { breadcrumbs } from "$lib/composables/breadcrumbs.svelte";
  import { setActiveOrganizationSlug } from "$lib/contexts/active-organization.svelte.js";

  const { children, data, params } = $props();

  onMount(() => {
    const homeCrumb = breadcrumbs.addCrumb({
      href: "/",
      label: "Home",
    });

    return () => {
      breadcrumbs.removeCrumb(homeCrumb);
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
        <Breadcrumb.Root>
          <Breadcrumb.List>
            {#each breadcrumbs.breadcrumbs as crumb, index}
              <Breadcrumb.Item>
                <Breadcrumb.Link href={crumb.href}>
                  {crumb.label}
                </Breadcrumb.Link>
              </Breadcrumb.Item>

              {#if index < breadcrumbs.breadcrumbs.size - 1}
                <Breadcrumb.Separator class="hidden md:block" />
              {/if}
            {/each}
          </Breadcrumb.List>
        </Breadcrumb.Root>
      </div>
    </header>
    <div class="flex flex-1 flex-col gap-4 p-4 pt-0">
      {@render children()}
    </div>
  </Sidebar.Inset>
</Sidebar.Provider>
