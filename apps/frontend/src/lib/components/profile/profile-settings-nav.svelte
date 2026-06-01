<script lang="ts">
  import BuildingIcon from "@lucide/svelte/icons/building";
  import FileTextIcon from "@lucide/svelte/icons/file-text";
  import Link2Icon from "@lucide/svelte/icons/link-2";
  import MailIcon from "@lucide/svelte/icons/mail";
  import MonitorSmartphoneIcon from "@lucide/svelte/icons/monitor-smartphone";
  import UserRoundIcon from "@lucide/svelte/icons/user-round";
  import { resolve } from "$app/paths";
  import { page } from "$app/state";
  import { Button } from "$lib/components/ui/button/index.js";

  const navItems = [
    {
      href: resolve("/(app)/profile"),
      label: "General",
      description: "Profile and password",
      icon: UserRoundIcon,
      match: (pathname: string) => pathname === resolve("/(app)/profile"),
    },
    {
      href: resolve("/(app)/profile/email"),
      label: "Email address",
      description: "Change your sign-in email",
      icon: MailIcon,
      match: (pathname: string) =>
        pathname.startsWith(resolve("/(app)/profile/email")),
    },
    {
      href: resolve("/(app)/profile/sessions"),
      label: "Sessions",
      description: "Active devices and sign-ins",
      icon: MonitorSmartphoneIcon,
      match: (pathname: string) =>
        pathname.startsWith(resolve("/(app)/profile/sessions")),
    },
    {
      href: resolve("/(app)/profile/accounts"),
      label: "Connected accounts",
      description: "Sign-in methods on your account",
      icon: Link2Icon,
      match: (pathname: string) =>
        pathname.startsWith(resolve("/(app)/profile/accounts")),
    },
    {
      href: resolve("/(app)/profile/organizations"),
      label: "Organizations",
      description: "Manage your organizations",
      icon: BuildingIcon,
      match: (pathname: string) =>
        pathname.startsWith(resolve("/(app)/profile/organizations")),
    },
    {
      href: resolve("/(app)/profile/account-retention"),
      label: "Account retention",
      description: "Audit and compliance policy",
      icon: FileTextIcon,
      match: (pathname: string) =>
        pathname.startsWith(resolve("/(app)/profile/account-retention")),
    },
  ] as const;
</script>

<nav aria-label="Profile settings" class="flex flex-col gap-1">
  {#each navItems as item (item.href)}
    {@const isActive = item.match(page.url.pathname)}
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
