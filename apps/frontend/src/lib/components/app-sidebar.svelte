<script lang="ts" module>
  import BookOpenIcon from "@lucide/svelte/icons/book-open";
  import ChartPieIcon from "@lucide/svelte/icons/chart-pie";
  import FrameIcon from "@lucide/svelte/icons/frame";
  import MapIcon from "@lucide/svelte/icons/map";
  import Settings2Icon from "@lucide/svelte/icons/settings-2";

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
  import { type ComponentProps } from "svelte";
  import { authClient } from "@/auth/client";
  import { resolve } from "$app/paths";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import { OrganizationSettingsRoute } from "../../routes/(app)/[organizationSlug]/settings/+page.svelte";
  import { OrganizationBillingSettingsRoute } from "../../routes/(app)/[organizationSlug]/settings/billing/+page.svelte";
  import { OrganizationMembersSettingsRoute } from "../../routes/(app)/[organizationSlug]/settings/members/+page.svelte";
  import { OrganizationTeamsSettingsRoute } from "../../routes/(app)/[organizationSlug]/settings/teams/+page.svelte";
  import NavMain from "./nav-main.svelte";
  import NavProjects from "./nav-projects.svelte";
  import NavUser from "./nav-user.svelte";
  import TeamSwitcher from "./team-switcher.svelte";

  let {
    ref = $bindable(null),
    collapsible = "icon",
    user = $bindable<User>(),
    activeOrganizationSlug = $bindable<string>(),
    ...restProps
  }: ComponentProps<typeof Sidebar.Root> & {
    user: User;
    activeOrganizationSlug: string;
  } = $props();

  const sessionStore = authClient.useSession();

  let teams = $state(authClient.organization.listTeams());

  sessionStore.subscribe(() => {
    teams = authClient.organization.listTeams();
  });

  const dashboardUrl = $derived(
    resolve("/(app)/[organizationSlug]", {
      organizationSlug: activeOrganizationSlug,
    })
  );

  const navMain = [
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
          url: OrganizationSettingsRoute(activeOrganizationSlug),
        },
        {
          title: "Team",
          url: OrganizationTeamsSettingsRoute(activeOrganizationSlug),
        },
        {
          title: "Members",
          url: OrganizationMembersSettingsRoute(activeOrganizationSlug),
        },
        {
          title: "Billing",
          url: OrganizationBillingSettingsRoute(activeOrganizationSlug),
        },
      ],
    },
  ];
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
    <NavMain items={navMain} {dashboardUrl} />
    <NavProjects {projects} />
  </Sidebar.Content>
  <Sidebar.Footer>
    <NavUser {user} />
  </Sidebar.Footer>
  <Sidebar.Rail />
</Sidebar.Root>
