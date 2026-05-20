<script lang="ts">
  import AlertTriangleIcon from "@lucide/svelte/icons/alert-triangle";
  import MonitorSmartphoneIcon from "@lucide/svelte/icons/monitor-smartphone";
  import UserRoundIcon from "@lucide/svelte/icons/user-round";
  import { page } from "$app/state";
  import { Button } from "$lib/components/ui/button/index.js";
  import { cn } from "$lib/utils.js";

  const navItems = [
    {
      href: "/profile",
      label: "General",
      description: "Profile, password, and email",
      icon: UserRoundIcon,
      match: (pathname: string) =>
        pathname === "/profile" || pathname === "/profile/",
    },
    {
      href: "/profile/sessions",
      label: "Sessions",
      description: "Active devices and sign-ins",
      icon: MonitorSmartphoneIcon,
      match: (pathname: string) => pathname.startsWith("/profile/sessions"),
    },
    {
      href: "/profile/delete",
      label: "Delete account",
      description: "Permanently remove your account",
      icon: AlertTriangleIcon,
      match: (pathname: string) => pathname.startsWith("/profile/delete"),
    },
  ] as const;
</script>

<nav aria-label="Profile settings" class="flex flex-col gap-1">
  {#each navItems as item (item.href)}
    {@const isActive = item.match(page.url.pathname)}
    <Button
      href={item.href}
      variant={isActive ? "secondary" : "ghost"}
      class={cn(
        "h-auto w-full justify-start gap-3 px-3 py-2.5 text-start",
        item.href === "/profile/delete" &&
          !isActive &&
          "text-destructive hover:text-destructive",
        item.href === "/profile/delete" &&
          isActive &&
          "bg-destructive/10 text-destructive hover:bg-destructive/15"
      )}
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
