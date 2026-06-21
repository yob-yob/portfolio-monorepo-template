<script lang="ts">
  import { onMount } from "svelte";
  import { authClient } from "@/auth/client";
  import { goto, invalidateAll } from "$app/navigation";
  import { resolve } from "$app/paths";
  import DarkModeToggle from "$lib/components/dark-mode-toggle.svelte";
  import OrganizationTeamCombobox from "$lib/components/organization-team-combobox.svelte";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Skeleton } from "$lib/components/ui/skeleton/index.js";

  // import Skeleton from "$lib/components/ui/skeleton/skeleton.svelte";

  const { data } = $props();

  interface Organization {
    id: string;
    name: string;
    slug: string;
  }

  interface UserTeam {
    id: string;
    name: string;
    organizationId: string;
  }

  let activatingOrganizationId = $state<string | null>(null);
  let selectedTeamIds = $state<Record<string, string>>({});

  const organizations = authClient.useListOrganizations();
  const teams = authClient.organization.listUserTeams();

  const activeOrganizationId = $derived(
    data.session?.activeOrganizationId ?? null
  );
  const activeTeamId = $derived(data.session?.activeTeamId ?? null);

  const teamsByOrganizationId = $derived.by(() => {
    const map = new Map<string, UserTeam[]>();

    for (const team of data.teams ?? []) {
      const organizationTeams = map.get(team.organizationId) ?? [];
      organizationTeams.push(team);
      map.set(team.organizationId, organizationTeams);
    }

    return map;
  });

  const defaultTeamForOrganization = (organizationId: string) => {
    const organizationTeams = teamsByOrganizationId.get(organizationId) ?? [];

    if (
      activeTeamId &&
      organizationTeams.some((team) => team.id === activeTeamId)
    ) {
      return activeTeamId;
    }

    return organizationTeams[0]?.id ?? "";
  };

  const selectedTeamForOrganization = (organizationId: string) =>
    selectedTeamIds[organizationId] ??
    defaultTeamForOrganization(organizationId);

  const isActiveOrganization = (organizationId: string) =>
    organizationId === activeOrganizationId;

  const activeOrganization = async (
    organization: Organization,
    teamId?: string
  ) => {
    activatingOrganizationId = organization.id;

    try {
      await authClient.organization.setActive({
        organizationId: organization.id,
      });
      await authClient.organization.setActiveTeam({ teamId });
      await invalidateAll();
      goto(
        resolve("/(app)/[organizationSlug]", {
          organizationSlug: organization.slug,
        })
      );
    } finally {
      activatingOrganizationId = null;
    }
  };

  onMount(() => {
    if (data.organizations) {
      if (data.organizations.length === 1) {
        const firstOrg = data.organizations[0];
        const firstTeamId = firstOrg
          ? defaultTeamForOrganization(firstOrg.id)
          : "";

        if (firstOrg && firstTeamId) {
          activeOrganization(firstOrg, firstTeamId);
        }
      } else if (data.organizations.length === 0) {
        goto(resolve("/(screening)/onboarding"));
      }
    }
  });
</script>

<div
  class="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10"
>
  <div class="absolute top-4 right-4">
    <DarkModeToggle />
  </div>

  <div class="w-full max-w-sm space-y-3 md:max-w-3xl">
    <h1 class="text-2xl font-semibold tracking-tight"
      >Select an organization</h1
    >
    <p class="text-muted-foreground text-sm">
      Choose a team, then open the organization to continue.
    </p>

    {#if $organizations.isPending}
      <ul class="space-y-3">
        {#each Array.from({ length: 2 }) as _, index (index)}
          <li>
            <Skeleton class="h-18 w-full bg-card" />
          </li>
        {/each}
      </ul>
    {:else if $organizations.data && $organizations.data.length === 0}
      <div
        class="bg-card text-card-foreground rounded-xl border p-5 shadow-sm text-center space-y-5"
      >
        <div class="text-muted-foreground px-4 text-sm">
          You do not have access to any organizations yet. would you like to
          create one?
        </div>
        <Button
          variant="default"
          size="lg"
          onclick={() => goto(resolve("/(screening)/onboarding"))}
        >
          Create an organization
        </Button>
      </div>
    {:else}
      <ul class="space-y-3">
        {#each $organizations.data as organization (organization.id)}
          {@const organizationTeams =
              teamsByOrganizationId.get(organization.id) ?? []}
          {@const selectedTeamId = selectedTeamForOrganization(organization.id)}
          {@const isActive = isActiveOrganization(organization.id)}
          <li>
            <div
              class="bg-card text-card-foreground rounded-xl border p-4 shadow-sm"
            >
              <div class="flex items-center justify-between gap-3">
                <div class="min-w-0">
                  <div class="flex flex-wrap items-center gap-2">
                    <p class="truncate font-medium">{organization.name}</p>
                    {#if isActive}
                      <span
                        class="bg-primary/10 text-primary shrink-0 rounded-full px-2 py-0.5 text-xs font-medium"
                      >
                        Current organization
                      </span>
                    {/if}
                  </div>
                  <p class="text-muted-foreground text-sm">
                    {#if activatingOrganizationId === organization.id}
                      Switching organization...
                    {:else if organizationTeams.length === 1}
                      1 team available
                    {:else}
                      {`${organizationTeams.length} teams available`}
                    {/if}
                  </p>
                </div>

                <div class="flex shrink-0 items-center gap-2">
                  {#if organizationTeams.length > 0}
                    <OrganizationTeamCombobox
                      teams={organizationTeams}
                      value={selectedTeamId}
                      organizationName={organization.name}
                      disabled={activatingOrganizationId === organization.id}
                      onValueChange={(teamId) => {
                          selectedTeamIds = {
                            ...selectedTeamIds,
                            [organization.id]: teamId,
                          };
                        }}
                    />
                  {/if}

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    class="shrink-0"
                    disabled={activatingOrganizationId === organization.id ||
                        !selectedTeamId}
                    onclick={() =>
                        activeOrganization(organization, selectedTeamId)}
                  >
                    {activatingOrganizationId === organization.id
                        ? "..."
                        : "Open"}
                  </Button>
                </div>
              </div>
            </div>
          </li>
        {/each}
      </ul>
    {/if}
  </div>
</div>
