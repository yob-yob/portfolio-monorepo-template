<script lang="ts" module>
  import BookOpenIcon from "@lucide/svelte/icons/book-open";
  import BotIcon from "@lucide/svelte/icons/bot";
  import ChartPieIcon from "@lucide/svelte/icons/chart-pie";
  import FrameIcon from "@lucide/svelte/icons/frame";
  import MapIcon from "@lucide/svelte/icons/map";
  import Settings2Icon from "@lucide/svelte/icons/settings-2";
  import SquareTerminalIcon from "@lucide/svelte/icons/square-terminal";

  const navMain = [
    {
      title: "Playground",
      url: "#",
      icon: SquareTerminalIcon,
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: BotIcon,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpenIcon,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2Icon,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ];

  const projects = [
    {
      name: "Design Engineering",
      url: "#",
      icon: FrameIcon,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: ChartPieIcon,
    },
    {
      name: "Travel",
      url: "#",
      icon: MapIcon,
    },
  ];
</script>

<script lang="ts">
  import type { User } from "@city-os/auth/client";
  import { type ComponentProps, onMount } from "svelte";
  import { authClient } from "@/auth/client";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import NavMain from "./nav-main.svelte";
  import NavProjects from "./nav-projects.svelte";
  import NavUser from "./nav-user.svelte";
  import TeamSwitcher from "./team-switcher.svelte";

  let {
    ref = $bindable(null),
    collapsible = "icon",
    user = $bindable<User>(),
    ...restProps
  }: ComponentProps<typeof Sidebar.Root> & {
    user: User;
  } = $props();

  const sessionStore = authClient.useSession();

  let teams = $state(authClient.organization.listTeams());

  sessionStore.subscribe(() => {
    teams = authClient.organization.listTeams();
  });
</script>

<Sidebar.Root bind:ref {collapsible} {...restProps}>
  <Sidebar.Header>
    {#await teams then {data}}
      {#if data}
        <TeamSwitcher
          teams={data.map((team) => ({
            name: team.name,
            logo: "",
            plan: "",
          }))}
        />
      {/if}
    {/await}
  </Sidebar.Header>
  <Sidebar.Content>
    <NavMain items={navMain} />
    <NavProjects {projects} />
  </Sidebar.Content>
  <Sidebar.Footer>
    <NavUser {user} />
  </Sidebar.Footer>
  <Sidebar.Rail />
</Sidebar.Root>
