<script lang="ts">
  import ChevronsUpDownIcon from "@lucide/svelte/icons/chevrons-up-down";
  import PlusIcon from "@lucide/svelte/icons/plus";
  import { goto } from "$app/navigation";
  import { resolve } from "$app/paths";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import { useSidebar } from "$lib/components/ui/sidebar/index.js";

  interface Team {
    color: string;
    description: string;
    id: string;
    name: string;
  }

  let {
    teams = $bindable<Team[]>(),
    activeTeamId = $bindable<string>(),
    organizationSlug = $bindable<string>(),
  }: {
    teams: Team[];
    activeTeamId: string;
    organizationSlug: string;
  } = $props();
  const sidebar = useSidebar();

  let activeTeam = $derived.by(() =>
    teams.find((team) => team.id === activeTeamId)
  );

  const teamInitials = (name: string) =>
    name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "TM";
</script>

<Sidebar.Menu>
  <Sidebar.MenuItem>
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        {#snippet child({ props })}
          {#if activeTeam}
            <Sidebar.MenuButton
              {...props}
              size="lg"
              class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div
                class="bg-sidebar-primary flex aspect-square size-8 items-center justify-center rounded-lg text-black"
                style={`background-color: ${activeTeam.color ?? "#ffffff"}`}
              >
                {teamInitials(activeTeam.name)}
              </div>
              <div class="grid flex-1 text-start text-sm leading-tight">
                <span class="truncate font-medium"> {activeTeam.name} </span>
                <span class="truncate text-xs">{activeTeam.description}</span>
              </div>
              <ChevronsUpDownIcon class="ms-auto" />
            </Sidebar.MenuButton>
          {/if}
        {/snippet}
      </DropdownMenu.Trigger>
      <DropdownMenu.Content
        class="w-(--bits-dropdown-menu-anchor-width) min-w-56 rounded-lg"
        align="start"
        side={sidebar.isMobile ? "bottom" : "right"}
        sideOffset={4}
      >
        <DropdownMenu.Label class="text-muted-foreground text-xs">
          Teams
        </DropdownMenu.Label>
        {#each teams as team, index (team.id)}
          <DropdownMenu.Item
            onSelect={() => (activeTeam = team)}
            class="gap-2 p-2"
          >
            <div
              class="flex size-6 items-center justify-center rounded-md border text-black"
              style={`background-color: ${team.color ?? "#ffffff"}`}
            >
              {teamInitials(team.name)}
            </div>
            {team.name}
            <DropdownMenu.Shortcut>⌘{index + 1}</DropdownMenu.Shortcut>
          </DropdownMenu.Item>
        {/each}
        <DropdownMenu.Separator />
        <DropdownMenu.Item class="gap-2 p-2">
          <div
            class="flex size-6 items-center justify-center rounded-md border bg-transparent"
          >
            <PlusIcon class="size-4" />
          </div>
          <button
            type="button"
            class="text-muted-foreground font-medium"
            onclick={() => goto(resolve('/(app)/[organizationSlug]/settings/teams', { organizationSlug }))}
          >
            Add team
          </button>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  </Sidebar.MenuItem>
</Sidebar.Menu>
