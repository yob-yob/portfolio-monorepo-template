<script lang="ts">
  import LaptopIcon from "@lucide/svelte/icons/laptop";
  import SmartphoneIcon from "@lucide/svelte/icons/smartphone";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Separator } from "$lib/components/ui/separator/index.js";
  import ProfileSettingsSection from "./profile-settings-section.svelte";

  interface Session {
    browser: string;
    device: string;
    icon: typeof LaptopIcon;
    id: string;
    isCurrent: boolean;
    lastActive: string;
    location: string;
  }

  // Placeholder data for UI only
  const sessions: Session[] = [
    {
      id: "1",
      device: "MacBook Pro",
      browser: "Chrome · macOS",
      location: "Oslo, Norway",
      lastActive: "Active now",
      isCurrent: true,
      icon: LaptopIcon,
    },
    {
      id: "2",
      device: "iPhone 15",
      browser: "Safari · iOS",
      location: "Oslo, Norway",
      lastActive: "2 hours ago",
      isCurrent: false,
      icon: SmartphoneIcon,
    },
    {
      id: "3",
      device: "Windows PC",
      browser: "Firefox · Windows",
      location: "Bergen, Norway",
      lastActive: "3 days ago",
      isCurrent: false,
      icon: LaptopIcon,
    },
  ];
</script>

<ProfileSettingsSection
  title="Sessions"
  description="Devices where you are currently signed in. Revoke any session you do not recognize."
>
  {#snippet children()}
    <div class="space-y-4">
      <div
        class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
      >
        <p class="text-muted-foreground text-sm">
          {sessions.length}
          active sessions
        </p>
        <Button variant="destructive" type="button">
          Revoke all other sessions
        </Button>
      </div>

      <Card.Root class="py-0">
        <ul class="divide-y">
          {#each sessions as session (session.id)}
            <li class="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
              <div class="flex min-w-0 flex-1 items-start gap-3">
                <div
                  class="bg-muted text-muted-foreground flex size-10 shrink-0 items-center justify-center rounded-lg"
                >
                  <session.icon class="size-5" />
                </div>
                <div class="min-w-0 space-y-1">
                  <div class="flex flex-wrap items-center gap-2">
                    <p class="font-medium">{session.device}</p>
                    {#if session.isCurrent}
                      <span
                        class="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs font-medium"
                      >
                        Current session
                      </span>
                    {/if}
                  </div>
                  <p class="text-muted-foreground text-sm">
                    {session.browser}
                  </p>
                  <p class="text-muted-foreground text-xs">
                    {session.location}
                    · {session.lastActive}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                type="button"
                disabled={session.isCurrent}
                class="shrink-0"
              >
                {session.isCurrent ? "This device" : "Revoke"}
              </Button>
            </li>
          {/each}
        </ul>
      </Card.Root>

      <Separator />

      <p class="text-muted-foreground text-xs">
        Revoking a session signs that device out immediately. Your current
        session stays active unless you revoke all other sessions or sign out
        everywhere from the account menu.
      </p>
    </div>
  {/snippet}
</ProfileSettingsSection>
