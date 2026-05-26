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
  import { type ComponentProps } from "svelte";
  import { authClient } from "@/auth/client";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import NavMain from "./nav-main.svelte";
  import NavProjects from "./nav-projects.svelte";
  import NavUser from "./nav-user.svelte";
  import TeamSwitcher from "./team-switcher.svelte";

  interface User {
    email: string;
    image?: string | null;
    name: string;
  }

  let {
    ref = $bindable(null),
    collapsible = "icon",
    user = $bindable<User>(),
    ...restProps
  }: ComponentProps<typeof Sidebar.Root> & { user: User } = $props();

  const organizations = authClient.useListOrganizations();
</script>

<Sidebar.Root bind:ref {collapsible} {...restProps}>
  <Sidebar.Header>
    {#if $organizations.isPending}
      <p>Loading...</p>
    {:else if $organizations.data && $organizations.data.length > 0}
      <TeamSwitcher
        teams={$organizations.data.map((org) => ({
        name: org.name,
        logo: org.logo,
        plan: "",
      }))}
      />
    {:else}
      ERROR... No Organization.
    {/if}
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
