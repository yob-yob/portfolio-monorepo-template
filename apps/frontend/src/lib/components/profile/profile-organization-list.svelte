<script lang="ts">
  import BuildingIcon from "@lucide/svelte/icons/building";
  import { onMount } from "svelte";
  import { toast } from "svelte-sonner";
  import { authClient } from "@/auth/client";
  import { invalidateAll } from "$app/navigation";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Skeleton } from "$lib/components/ui/skeleton/index.js";
  import ProfileSettingsSection from "./profile-settings-section.svelte";

  interface DisplayOrganization {
    id: string;
    isActive: boolean;
    memberSince: string;
    name: string;
    role: string;
    slug: string;
  }

  const organizationsStore = authClient.useListOrganizations();
  const sessionStore = authClient.useSession();

  let displayOrganizations = $state<DisplayOrganization[]>([]);
  let isLoading = $state(true);
  let activatingOrganizationId = $state<string | null>(null);

  const formatMemberSince = (
    createdAt: Date | string | null | undefined
  ): string => {
    if (!createdAt) {
      return "A member since: Date unavailable";
    }

    const date =
      typeof createdAt === "string" ? new Date(createdAt) : createdAt;

    if (Number.isNaN(date.getTime())) {
      return "A member since: Date unavailable";
    }

    return `A member since: ${date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    })}`;
  };

  const formatRole = (role: string | null | undefined): string => {
    if (!role?.trim()) {
      return "Unknown role";
    }

    return role
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean)
      .map((value) => value.charAt(0).toUpperCase() + value.slice(1))
      .join(", ");
  };

  const loadOrganizations = async () => {
    const organizationsState = organizationsStore.get();
    const sessionState = sessionStore.get();

    if (organizationsState.isPending) {
      isLoading = true;
      return;
    }

    if (organizationsState.error) {
      toast.error(
        `Failed to load organizations: ${organizationsState.error.message}`
      );
      displayOrganizations = [];
      isLoading = false;
      return;
    }

    const organizations = organizationsState.data ?? [];
    const userId = sessionState.data?.user.id;
    const activeOrganizationId =
      sessionState.data?.session.activeOrganizationId ?? null;

    if (!(organizations.length && userId)) {
      displayOrganizations = [];
      isLoading = false;
      return;
    }

    isLoading = true;

    const results = await Promise.all(
      organizations.map(async (organization) => {
        const { data, error } = await authClient.organization.listMembers({
          query: {
            organizationId: organization.id,
            filterField: "userId",
            filterOperator: "eq",
            filterValue: userId,
            limit: 1,
          },
        });

        if (error) {
          return {
            id: organization.id,
            name: organization.name,
            slug: organization.slug,
            role: "Unknown role",
            memberSince: "A member since: Date unavailable",
            isActive: organization.id === activeOrganizationId,
          };
        }

        const member = data?.members?.[0];

        return {
          id: organization.id,
          name: organization.name,
          slug: organization.slug,
          role: formatRole(member?.role),
          memberSince: formatMemberSince(member?.createdAt),
          isActive: organization.id === activeOrganizationId,
        };
      })
    );

    displayOrganizations = results;
    isLoading = false;
  };

  const handleSwitchOrganization = async (organizationId: string) => {
    activatingOrganizationId = organizationId;

    try {
      const { error } = await authClient.organization.setActive({
        organizationId,
      });

      if (error) {
        toast.error(`Failed to switch organization: ${error.message}`);
        return;
      }

      toast.success("Organization switched");
      await invalidateAll();
      await loadOrganizations();
    } finally {
      activatingOrganizationId = null;
    }
  };

  onMount(() => {
    loadOrganizations();
  });

  organizationsStore.subscribe(() => {
    loadOrganizations();
  });

  sessionStore.subscribe(() => {
    loadOrganizations();
  });
</script>

<ProfileSettingsSection
  title="Organizations"
  description="Organizations you belong to. Switch your active workspace from here."
>
  {#snippet children()}
    <div class="space-y-4">
      <p class="text-muted-foreground text-sm">
        {#if isLoading}
          Loading organizations...
        {:else}
          {displayOrganizations.length}
          organization{displayOrganizations.length === 1 ? "" : "s"}
        {/if}
      </p>

      <Card.Root class="py-0">
        {#if isLoading}
          <ul class="divide-y">
            {#each Array.from({ length: 2 }) as _, index (index)}
              <li class="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                <div class="flex min-w-0 flex-1 items-start gap-3">
                  <Skeleton class="size-10 shrink-0 rounded-lg" />
                  <div class="min-w-0 flex-1 space-y-2">
                    <Skeleton class="h-4 w-40" />
                    <Skeleton class="h-3 w-32" />
                    <Skeleton class="h-3 w-52" />
                  </div>
                </div>
                <Skeleton class="h-8 w-44 shrink-0" />
              </li>
            {/each}
          </ul>
        {:else if displayOrganizations.length === 0}
          <div class="text-muted-foreground p-4 text-sm">
            You do not have access to any organizations yet.
          </div>
        {:else}
          <ul class="divide-y">
            {#each displayOrganizations as organization (organization.id)}
              <li class="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                <div class="flex min-w-0 flex-1 items-start gap-3">
                  <div
                    class="bg-muted text-muted-foreground flex size-10 shrink-0 items-center justify-center rounded-lg"
                  >
                    <BuildingIcon class="size-5" />
                  </div>
                  <div class="min-w-0 space-y-1">
                    <div class="flex flex-wrap items-center gap-2">
                      <p class="font-medium">{organization.name}</p>
                      {#if organization.isActive}
                        <span
                          class="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs font-medium"
                        >
                          Current organization
                        </span>
                      {/if}
                    </div>
                    <p class="text-muted-foreground text-sm">
                      {organization.role}
                    </p>
                    <p class="text-muted-foreground text-xs">
                      {organization.memberSince}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  disabled={organization.isActive ||
                    activatingOrganizationId === organization.id}
                  class="shrink-0"
                  aria-label={`Switch to ${organization.name}`}
                  onclick={() => handleSwitchOrganization(organization.id)}
                >
                  {#if organization.isActive}
                    Active
                  {:else if activatingOrganizationId === organization.id}
                    Switching...
                  {:else}
                    Switch to this Organization
                  {/if}
                </Button>
              </li>
            {/each}
          </ul>
        {/if}
      </Card.Root>
    </div>
  {/snippet}
</ProfileSettingsSection>
