<script lang="ts">
  import Link2Icon from "@lucide/svelte/icons/link-2";
  import MailIcon from "@lucide/svelte/icons/mail";
  import MonitorSmartphoneIcon from "@lucide/svelte/icons/monitor-smartphone";
  import UserRoundIcon from "@lucide/svelte/icons/user-round";
  import { Button } from "$lib/components/ui/button/index.js";

  const {
    PageUrlPathName,
    OrganizationSettingsRoutes,
  }: {
    PageUrlPathName: string;
    OrganizationSettingsRoutes: {
      general: string;
      teams: string;
      members: string;
      billing: string;
      rbac: string;
    };
  } = $props();

  const navItems = $derived([
    {
      href: OrganizationSettingsRoutes.general,
      label: "General",
      description: "Name, Owner and Description",
      icon: UserRoundIcon,
      match: (pathname: string) =>
        pathname === OrganizationSettingsRoutes.general,
    },
    {
      href: OrganizationSettingsRoutes.teams,
      label: "Teams",
      description: "Manage your teams",
      icon: MailIcon,
      match: (pathname: string) =>
        pathname === OrganizationSettingsRoutes.teams,
    },
    {
      href: OrganizationSettingsRoutes.members,
      label: "Members",
      description: "Manage your members",
      icon: MonitorSmartphoneIcon,
      match: (pathname: string) =>
        pathname === OrganizationSettingsRoutes.members,
    },
    {
      href: OrganizationSettingsRoutes.rbac,
      label: "Roles and Permissions",
      description: "Manage your roles and permissions",
      icon: Link2Icon,
      match: (pathname: string) => pathname === OrganizationSettingsRoutes.rbac,
    },
    {
      href: OrganizationSettingsRoutes.billing,
      label: "Billing",
      description: "Manage your billing",
      icon: Link2Icon,
      match: (pathname: string) =>
        pathname === OrganizationSettingsRoutes.billing,
    },
  ]);
</script>

<nav aria-label="Profile settings" class="flex flex-col gap-1">
  {#each navItems as item (item.href)}
    {@const isActive = item.match(PageUrlPathName)}
    <Button
      href={item.href}
      variant={isActive ? "secondary" : "ghost"}
      class="h-auto w-full justify-start gap-3 px-3 py-2.5 text-start"
    >
      <item.icon class="size-4 shrink-0" />
      <span class="flex min-w-0 flex-col gap-0.5">
        <span class="truncate font-medium">{item.label}</span>
        <span class="text-muted-foreground truncate text-xs font-normal">
          {item.description}
        </span>
      </span>
    </Button>
  {/each}
</nav>
