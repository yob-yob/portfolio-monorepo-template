<script lang="ts">
  import { onMount } from "svelte";
  import AppSidebar from "$lib/components/app-sidebar.svelte";
  import ProfileSettingsNav from "$lib/components/profile/profile-settings-nav.svelte";
  import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js";
  import { Separator } from "$lib/components/ui/separator/index.js";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import { breadcrumbs } from "$lib/composables/breadcrumbs.svelte";

  const { children, data } = $props();

  onMount(() => {
    const homeCrumb = breadcrumbs.addCrumb({
      href: "/",
      label: "Home",
    });

    return () => {
      breadcrumbs.removeCrumb(homeCrumb);
    };
  });
</script>

<!-- AUTH PAGES Layout -->
<Sidebar.Provider>
  <AppSidebar user={data.user} />
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
      <div
        class="mx-auto flex w-full max-w-5xl flex-col gap-8 lg:flex-row lg:gap-12"
      >
        <aside class="lg:w-56 lg:shrink-0">
          <div class="space-y-4 lg:sticky lg:top-4">
            <div class="space-y-1 px-1">
              <h1 class="text-2xl font-semibold tracking-tight">Settings</h1>
              <p class="text-muted-foreground text-sm">
                Manage your account and security preferences.
              </p>
            </div>
            <ProfileSettingsNav />
          </div>
        </aside>
        <main class="min-w-0 flex-1 space-y-8"> {@render children()} </main>
      </div>
    </div>
  </Sidebar.Inset>
</Sidebar.Provider>
