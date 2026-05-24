<script lang="ts">
  import FileTextIcon from "@lucide/svelte/icons/file-text";
  import MailIcon from "@lucide/svelte/icons/mail";
  import MonitorSmartphoneIcon from "@lucide/svelte/icons/monitor-smartphone";
  import UserRoundIcon from "@lucide/svelte/icons/user-round";
  import { page } from "$app/state";
  import { Button } from "$lib/components/ui/button/index.js";

  const navItems = [
    {
      href: "/profile",
      label: "General",
      description: "Profile and password",
      icon: UserRoundIcon,
      match: (pathname: string) =>
        pathname === "/profile" || pathname === "/profile/",
    },
    {
      href: "/profile/email",
      label: "Email address",
      description: "Change your sign-in email",
      icon: MailIcon,
      match: (pathname: string) => pathname.startsWith("/profile/email"),
    },
    {
      href: "/profile/sessions",
      label: "Sessions",
      description: "Active devices and sign-ins",
      icon: MonitorSmartphoneIcon,
      match: (pathname: string) => pathname.startsWith("/profile/sessions"),
    },
    {
      href: "/profile/account-retention",
      label: "Account retention",
      description: "Audit and compliance policy",
      icon: FileTextIcon,
      match: (pathname: string) =>
        pathname.startsWith("/profile/account-retention"),
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
