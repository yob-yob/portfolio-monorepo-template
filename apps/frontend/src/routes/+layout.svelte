<script lang="ts">
  import "./layout.css";
  import { authClient } from "@asset-tracking/auth/client";
  import { ModeWatcher } from "mode-watcher";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import favicon from "$lib/assets/favicon.svg";
  import AppSidebar from "$lib/components/app-sidebar.svelte";
  import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js";
  import { Separator } from "$lib/components/ui/separator/index.js";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import { breadcrumbs } from "$lib/composables/breadcrumbs.svelte";

  const { children } = $props();
  const session = authClient.useSession();

  session.subscribe((session) => {
    if (!session.isPending && session.data === null) {
      goto("/auth/login");
    } else if (
      window.location.pathname.includes("/auth/") ||
      window.location.pathname.includes("/onboarding") ||
      window.location.pathname.includes("/install")
    ) {
      goto("/");
    }
  });

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

<svelte:head>
  <link rel="icon" href={favicon}>
</svelte:head>

<ModeWatcher />

{#if $session.isPending}
  <!-- We're still checking if session is authenticated. -->
  <div class="flex items-center justify-center h-screen">
    <div
      class="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900 dark:border-white"
    ></div>
  </div>
{:else if $session.data === null}
  <!-- GUEST PAGES Layout -->
  {@render children()}
{:else}
  <!-- AUTH PAGES Layout -->
  <Sidebar.Provider>
    <AppSidebar user={$session.data.user} />
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
{/if}
