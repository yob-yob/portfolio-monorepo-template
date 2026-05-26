<script lang="ts">
  import LaptopIcon from "@lucide/svelte/icons/laptop";
  import SmartphoneIcon from "@lucide/svelte/icons/smartphone";
  import { onMount } from "svelte";
  import { toast } from "svelte-sonner";
  import { authClient, type Session } from "@/auth/client";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Separator } from "$lib/components/ui/separator/index.js";
  import { Skeleton } from "$lib/components/ui/skeleton/index.js";
  import ProfileSettingsSection from "./profile-settings-section.svelte";

  interface DisplaySession {
    browser: string;
    device: string;
    icon: typeof LaptopIcon;
    id: string;
    isCurrent: boolean;
    lastActive: string;
    location: string;
    token: string;
  }

  const MOBILE_PATTERN = /Android|iPhone|iPad|iPod|Mobile/i;
  const BROWSER_PATTERNS = [
    { name: "Edge", pattern: /Edg\// },
    { name: "Chrome", pattern: /Chrome\// },
    { name: "Firefox", pattern: /Firefox\// },
    { name: "Safari", pattern: /Safari\// },
  ] as const;
  const OS_PATTERNS = [
    { name: "iOS", pattern: /iPhone|iPad|iPod/ },
    { name: "Android", pattern: /Android/ },
    { name: "macOS", pattern: /Mac OS X/ },
    { name: "Windows", pattern: /Windows/ },
    { name: "Linux", pattern: /Linux/ },
  ] as const;

  const DEVICE_PATTERNS = [
    { device: "iPhone", pattern: /iPhone/ },
    { device: "iPad", pattern: /iPad/ },
    { device: "Android device", pattern: /Android/ },
    { device: "Mac", pattern: /Mac OS X/ },
    { device: "Windows PC", pattern: /Windows/ },
    { device: "Linux PC", pattern: /Linux/ },
  ] as const;

  const currentSessionStore = authClient.useSession();

  let sessions = $state<DisplaySession[]>([]);
  let isLoading = $state(true);
  let revokingToken = $state<string | null>(null);
  let isRevokingOthers = $state(false);

  const otherSessionCount = $derived(
    sessions.filter((session) => !session.isCurrent).length
  );

  const parseUserAgent = (userAgent: string | null | undefined) => {
    const ua = userAgent ?? "";
    const browser =
      BROWSER_PATTERNS.find(({ pattern }) => pattern.test(ua))?.name ??
      "Unknown browser";
    const os =
      OS_PATTERNS.find(({ pattern }) => pattern.test(ua))?.name ?? "Unknown OS";
    const isMobile = MOBILE_PATTERN.test(ua);

    const device =
      DEVICE_PATTERNS.find(({ pattern }) => pattern.test(ua))?.device ??
      "Unknown device";

    return {
      device,
      browser: `${browser} · ${os}`,
      icon: isMobile ? SmartphoneIcon : LaptopIcon,
    };
  };

  const formatLastActive = (
    updatedAt: Date | string,
    isCurrent: boolean
  ): string => {
    if (isCurrent) {
      return "Active now";
    }

    const date =
      typeof updatedAt === "string" ? new Date(updatedAt) : updatedAt;
    const diffMs = Date.now() - date.getTime();
    const diffMinutes = Math.floor(diffMs / 60_000);

    if (diffMinutes < 1) {
      return "Active now";
    }

    if (diffMinutes < 60) {
      return `${diffMinutes} minute${diffMinutes === 1 ? "" : "s"} ago`;
    }

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) {
      return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
    }

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 30) {
      return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
    }

    return date.toLocaleDateString();
  };

  const toDisplaySession = (
    session: Session,
    currentToken: string | undefined
  ): DisplaySession => {
    const isCurrent = session.token === currentToken;
    const { device, browser, icon } = parseUserAgent(session.userAgent);

    return {
      id: session.id,
      token: session.token,
      device,
      browser,
      location: session.ipAddress ?? "Unknown location",
      lastActive: formatLastActive(session.updatedAt, isCurrent),
      isCurrent,
      icon,
    };
  };

  const loadSessions = async () => {
    isLoading = true;

    const { data, error } = await authClient.listSessions();

    isLoading = false;

    if (error) {
      toast.error(`Failed to load sessions: ${error.message}`);
      return;
    }

    const currentToken = currentSessionStore.get()?.data?.session.token;

    sessions = (data ?? [])
      .slice()
      .sort((left, right) => {
        const leftIsCurrent = left.token === currentToken;
        const rightIsCurrent = right.token === currentToken;

        if (leftIsCurrent !== rightIsCurrent) {
          return leftIsCurrent ? -1 : 1;
        }

        return (
          new Date(right.updatedAt).getTime() -
          new Date(left.updatedAt).getTime()
        );
      })
      .map((session) => toDisplaySession(session, currentToken));
  };

  const handleRevokeSession = async (token: string) => {
    revokingToken = token;

    const { error } = await authClient.revokeSession({ token });

    revokingToken = null;

    if (error) {
      toast.error(`Failed to revoke session: ${error.message}`);
      return;
    }

    toast.success("Session revoked");
    await loadSessions();
  };

  const handleRevokeOthers = async () => {
    isRevokingOthers = true;

    const { error } = await authClient.revokeOtherSessions();

    isRevokingOthers = false;

    if (error) {
      toast.error(`Failed to revoke other sessions: ${error.message}`);
      return;
    }

    toast.success("All other sessions revoked");
    await loadSessions();
  };

  onMount(() => {
    loadSessions();
  });

  currentSessionStore.subscribe(async () => await loadSessions());
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
          {#if isLoading}
            Loading sessions...
          {:else}
            {sessions.length}
            active session{sessions.length === 1 ? "" : "s"}
          {/if}
        </p>
        <Button
          variant="destructive"
          type="button"
          disabled={isLoading || otherSessionCount === 0 || isRevokingOthers}
          onclick={handleRevokeOthers}
        >
          {isRevokingOthers ? "Revoking..." : "Revoke all other sessions"}
        </Button>
      </div>

      <Card.Root class="py-0">
        {#if isLoading}
          <ul class="divide-y">
            {#each Array.from({ length: 3 }) as _, index (index)}
              <li class="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                <div class="flex min-w-0 flex-1 items-start gap-3">
                  <Skeleton class="size-10 shrink-0 rounded-lg" />
                  <div class="min-w-0 flex-1 space-y-2">
                    <Skeleton class="h-4 w-32" />
                    <Skeleton class="h-3 w-40" />
                    <Skeleton class="h-3 w-48" />
                  </div>
                </div>
                <Skeleton class="h-8 w-20 shrink-0" />
              </li>
            {/each}
          </ul>
        {:else if sessions.length === 0}
          <div class="text-muted-foreground p-4 text-sm">
            No active sessions found.
          </div>
        {:else}
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
                  disabled={session.isCurrent || revokingToken === session.token}
                  class="shrink-0"
                  onclick={() => handleRevokeSession(session.token)}
                >
                  {#if session.isCurrent}
                    This device
                  {:else if revokingToken === session.token}
                    Revoking...
                  {:else}
                    Revoke
                  {/if}
                </Button>
              </li>
            {/each}
          </ul>
        {/if}
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
