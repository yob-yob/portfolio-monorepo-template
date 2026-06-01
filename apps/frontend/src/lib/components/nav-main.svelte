<script lang="ts">
  import ChevronRightIcon from "@lucide/svelte/icons/chevron-right";
  import HomeIcon from "@lucide/svelte/icons/home";
  import type { Component } from "svelte";
  import { page } from "$app/state";
  import * as Collapsible from "$lib/components/ui/collapsible/index.js";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";

  let {
    items,
    title = "Platform",
    dashboardUrl = "/",
  }: {
    items: {
      title: string;
      url: string;
      // this should be `Component` after @lucide/svelte updates types
      icon?: Component;
      isActive?: boolean;
      items?: {
        title: string;
        url: string;
      }[];
    }[];
    title?: string;
    dashboardUrl: string;
  } = $props();

  const isActive = (path: string) => page.url.pathname === path;
</script>

<Sidebar.Group>
  <Sidebar.GroupLabel>{title}</Sidebar.GroupLabel>
  <Sidebar.Menu>
    <Sidebar.MenuItem>
      <Sidebar.MenuButton isActive={isActive(dashboardUrl)}>
        {#snippet child({ props })}
          <a href={dashboardUrl} {...props}>
            <HomeIcon />
            <span>Dashboard</span>
          </a>
        {/snippet}
      </Sidebar.MenuButton>
    </Sidebar.MenuItem>
    {#each items as item (item.title)}
      <Collapsible.Root open={item.isActive} class="group/collapsible">
        {#snippet child({ props })}
          <Sidebar.MenuItem {...props}>
            <Collapsible.Trigger>
              {#snippet child({ props })}
                <Sidebar.MenuButton {...props} tooltipContent={item.title}>
                  {#if item.icon}
                    <item.icon />
                  {/if}
                  <span>{item.title}</span>
                  <ChevronRightIcon
                    class="ms-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                  />
                </Sidebar.MenuButton>
              {/snippet}
            </Collapsible.Trigger>
            <Collapsible.Content>
              <Sidebar.MenuSub>
                {#each item.items ?? [] as subItem (subItem.title)}
                  <Sidebar.MenuSubItem>
                    <Sidebar.MenuSubButton isActive={isActive(subItem.url)}>
                      {#snippet child({ props })}
                        <a href={subItem.url} {...props}>
                          <span>{subItem.title}</span>
                        </a>
                      {/snippet}
                    </Sidebar.MenuSubButton>
                  </Sidebar.MenuSubItem>
                {/each}
              </Sidebar.MenuSub>
            </Collapsible.Content>
          </Sidebar.MenuItem>
        {/snippet}
      </Collapsible.Root>
    {/each}
  </Sidebar.Menu>
</Sidebar.Group>
