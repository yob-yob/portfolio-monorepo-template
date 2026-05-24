<script lang="ts">
  import KeyRoundIcon from "@lucide/svelte/icons/key-round";
  import Link2Icon from "@lucide/svelte/icons/link-2";
  import { onMount } from "svelte";
  import { toast } from "svelte-sonner";
  import { authClient } from "@/auth/client";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Skeleton } from "$lib/components/ui/skeleton/index.js";
  import ProfileSettingsSection from "./profile-settings-section.svelte";

  interface LinkedAccount {
    accountId: string;
    createdAt: Date | string;
    id: string;
    providerId: string;
    scopes: string[];
    updatedAt: Date | string;
  }

  interface DisplayAccount {
    detail: string | null;
    icon: typeof KeyRoundIcon;
    id: string;
    label: string;
    linkedAt: string;
    providerId: string;
  }

  const PROVIDER_META: Record<
    string,
    { label: string; icon: typeof KeyRoundIcon }
  > = {
    credential: {
      label: "Email and password",
      icon: KeyRoundIcon,
    },
  };

  const currentSessionStore = authClient.useSession();

  let accounts = $state<DisplayAccount[]>([]);
  let isLoading = $state(true);

  const getProviderMeta = (providerId: string) =>
    PROVIDER_META[providerId] ?? {
      label: providerId,
      icon: Link2Icon,
    };

  const formatLinkedAt = (createdAt: Date | string): string => {
    const date =
      typeof createdAt === "string" ? new Date(createdAt) : createdAt;
    return `Linked ${date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    })}`;
  };

  const toDisplayAccount = (
    account: LinkedAccount,
    userEmail: string | undefined
  ): DisplayAccount => {
    const meta = getProviderMeta(account.providerId);

    return {
      id: account.id,
      providerId: account.providerId,
      label: meta.label,
      detail:
        account.providerId === "credential"
          ? (userEmail ?? null)
          : account.accountId,
      linkedAt: formatLinkedAt(account.createdAt),
      icon: meta.icon,
    };
  };

  const loadAccounts = async () => {
    isLoading = true;

    const { data, error } = await authClient.listAccounts();

    isLoading = false;

    if (error) {
      toast.error(`Failed to load accounts: ${error.message}`);
      return;
    }

    const userEmail = currentSessionStore.get()?.data?.user.email;

    accounts = (data ?? [])
      .slice()
      .sort(
        (left, right) =>
          new Date(right.updatedAt).getTime() -
          new Date(left.updatedAt).getTime()
      )
      .map((account) => toDisplayAccount(account, userEmail));
  };

  onMount(() => {
    loadAccounts();
  });

  currentSessionStore.subscribe(async () => {
    await loadAccounts();
  });
</script>

<ProfileSettingsSection
  title="Your sign-in methods"
  description="Accounts you use to sign in. Link additional providers when they are enabled."
>
  {#snippet children()}
    <div class="space-y-4">
      <p class="text-muted-foreground text-sm">
        {#if isLoading}
          Loading sign-in methods...
        {:else}
          {accounts.length}
          connected account{accounts.length === 1 ? "" : "s"}
        {/if}
      </p>

      <Card.Root class="py-0">
        {#if isLoading}
          <ul class="divide-y">
            {#each Array.from({ length: 1 }) as _, index (index)}
              <li class="flex items-start gap-3 p-4">
                <Skeleton class="size-10 shrink-0 rounded-lg" />
                <div class="min-w-0 flex-1 space-y-2">
                  <Skeleton class="h-4 w-36" />
                  <Skeleton class="h-3 w-48" />
                  <Skeleton class="h-3 w-28" />
                </div>
              </li>
            {/each}
          </ul>
        {:else if accounts.length === 0}
          <div class="text-muted-foreground p-4 text-sm">
            No sign-in methods found.
          </div>
        {:else}
          <ul class="divide-y">
            {#each accounts as account (account.id)}
              <li class="flex items-start gap-3 p-4">
                <div
                  class="bg-muted text-muted-foreground flex size-10 shrink-0 items-center justify-center rounded-lg"
                >
                  <account.icon class="size-5" />
                </div>
                <div class="min-w-0 space-y-1">
                  <div class="flex flex-wrap items-center gap-2">
                    <p class="font-medium">{account.label}</p>
                    <span
                      class="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs font-medium"
                    >
                      Connected
                    </span>
                  </div>
                  {#if account.detail}
                    <p class="text-muted-foreground text-sm"
                      >{account.detail}</p
                    >
                  {/if}
                  <p class="text-muted-foreground text-xs"
                    >{account.linkedAt}</p
                  >
                </div>
              </li>
            {/each}
          </ul>
        {/if}
      </Card.Root>

      <p class="text-muted-foreground text-xs">
        OAuth sign-in providers are not enabled yet. When they are, you will be
        able to link them here alongside email and password.
      </p>
    </div>
  {/snippet}
</ProfileSettingsSection>
