<script lang="ts">
  import ArrowRightLeftIcon from "@lucide/svelte/icons/arrow-right-left";
  import EllipsisIcon from "@lucide/svelte/icons/ellipsis";
  import LogInIcon from "@lucide/svelte/icons/log-in";
  import LogOutIcon from "@lucide/svelte/icons/log-out";
  import Trash2Icon from "@lucide/svelte/icons/trash-2";
  import UsersIcon from "@lucide/svelte/icons/users";
  import { toast } from "svelte-sonner";
  import { authClient } from "@/auth/client";
  import { invalidateAll } from "$app/navigation";
  import SettingsSection from "$lib/components/settings-section.svelte";
  import * as Avatar from "$lib/components/ui/avatar/index.js";
  import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import Skeleton from "../ui/skeleton/skeleton.svelte";

  interface TeamData {
    createdAt: Date | string;
    createdBy: string;
    id: string;
    name: string;
  }

  let {
    teams,
    userTeams,
    activeTeamId,
    userId,
  }: {
    teams: TeamData[];
    userTeams: TeamData[];
    activeTeamId: string | null | undefined;
    userId: string;
  } = $props();

  const formatRelativeTime = (date: Date | string): string => {
    const target = typeof date === "string" ? new Date(date) : date;
    const diffSec = Math.round((target.getTime() - Date.now()) / 1000);
    const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });

    const divisions: { amount: number; unit: Intl.RelativeTimeFormatUnit }[] = [
      { amount: 60, unit: "second" },
      { amount: 60, unit: "minute" },
      { amount: 24, unit: "hour" },
      { amount: 7, unit: "day" },
      { amount: 4.345_24, unit: "week" },
      { amount: 12, unit: "month" },
      { amount: Number.POSITIVE_INFINITY, unit: "year" },
    ];

    let duration = diffSec;
    for (const division of divisions) {
      if (Math.abs(duration) < division.amount) {
        return rtf.format(Math.round(duration), division.unit);
      }
      duration /= division.amount;
    }

    return rtf.format(Math.round(duration), "year");
  };

  const teamInitials = (name: string) =>
    name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "TM";

  const userIsAMemberOfTeam = (team: TeamData) =>
    userTeams.some((userTeam) => userTeam.id === team.id);

  const userOnlyHasOneTeam = $derived(() => userTeams.length === 1);

  const userCanLeaveTeam = (team: TeamData) =>
    userIsAMemberOfTeam(team) && !userOnlyHasOneTeam();

  const isActiveTeam = (team: TeamData) => activeTeamId === team.id;

  type CreatorLookup = ReturnType<
    typeof authClient.organization.getActiveMember
  >;

  const creatorCache = new Map<string, CreatorLookup>();

  const getCreatorName = (creatorUserId: string) => {
    // cache the result...
    const cached = creatorCache.get(creatorUserId);

    if (cached) {
      return cached;
    }

    const request = authClient.organization.getActiveMember({
      query: {
        creatorUserId,
      },
    });

    creatorCache.set(creatorUserId, request);

    return request;
  };

  const switchTeam = async (team: TeamData) => {
    const { error } = await authClient.organization.setActiveTeam({
      teamId: team.id,
    });

    if (error) {
      toast.error(
        `There was a problem when switching to team: ${team.name} (${error.message})`
      );
      return;
    }

    toast.success(`Switched to team: ${team.name}`);
    invalidateAll();
  };

  const joinTeam = async (team: TeamData) => {
    const { error } = await authClient.organization.addTeamMember({
      teamId: team.id,
      userId,
    });

    if (error) {
      toast.error(
        `There was a problem when joining to team: ${team.name} (${error.message})`
      );
      return;
    }

    toast.success(`Joined to team: ${team.name}`);
    invalidateAll();
  };

  const leaveTeam = async (team: TeamData) => {
    if (!userCanLeaveTeam(team)) {
      toast.error(
        `You cannot leave the team: ${team.name}, because this is your only assigned team.`
      );
      return;
    }

    // First move the user to another team...
    const OtherTeam = userTeams.find((userTeam) => userTeam.id !== team.id);

    if (OtherTeam) {
      switchTeam(OtherTeam);
    } else {
      toast.error(
        `You cannot leave the team: ${team.name}, because you are the only member of the team.`
      );
      return;
    }

    const { error } = await authClient.organization.removeTeamMember({
      teamId: team.id,
      userId,
    });

    if (error) {
      toast.error(
        `There was a problem when trying to remove yourself from the team: ${team.name} (${error.message})`
      );
      return;
    }

    toast.success(`Left team: ${team.name}`);
    invalidateAll();
  };

  let deleteDialogOpen = $state(false);
  let teamToDelete = $state<TeamData | null>(null);
  let deleteConfirmationName = $state("");
  let isDeletingTeam = $state(false);

  const deleteConfirmationMatches = $derived(
    teamToDelete !== null && deleteConfirmationName === teamToDelete.name
  );

  const openDeleteDialog = (team: TeamData) => {
    teamToDelete = team;
    deleteConfirmationName = "";
    deleteDialogOpen = true;
  };

  const closeDeleteDialog = () => {
    deleteDialogOpen = false;
    teamToDelete = null;
    deleteConfirmationName = "";
  };

  const confirmDeleteTeam = async () => {
    if (teamToDelete === null) {
      return;
    }

    if (!deleteConfirmationMatches) {
      return;
    }

    isDeletingTeam = true;

    const team = teamToDelete;
    const { error } = await authClient.organization.removeTeam({
      teamId: team.id,
    });

    isDeletingTeam = false;

    if (error) {
      toast.error(
        `There was a problem while deleting the team (${team.name}): ${error.message}`
      );
      return;
    }

    toast.success(`Team Deleted: ${team.name}`);
    closeDeleteDialog();
    invalidateAll();
  };
</script>

<SettingsSection
  title="Teams"
  description="View teams in your organization, join or leave memberships, and switch your active workspace."
>
  {#snippet children()}
    {#if teams.length === 0}
      <div
        class="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed px-6 py-10 text-center"
      >
        <div
          class="bg-muted text-muted-foreground flex size-10 items-center justify-center rounded-full"
        >
          <UsersIcon class="size-5" />
        </div>
        <p class="text-sm font-medium">No teams yet</p>
        <p class="text-muted-foreground max-w-sm text-sm">
          Create your first team below to organize work within this
          organization.
        </p>
      </div>
    {:else}
      <ul class="divide-border divide-y rounded-lg border">
        {#each teams as team (team.id)}
          <li
            class="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div class="flex min-w-0 items-start gap-3">
              <Avatar.Root class="size-10 shrink-0 rounded-lg">
                <Avatar.Fallback class="rounded-lg text-xs font-medium">
                  {teamInitials(team.name)}
                </Avatar.Fallback>
              </Avatar.Root>
              <div class="min-w-0 space-y-1">
                <div class="flex flex-wrap items-center gap-2">
                  <span class="truncate font-medium">{team.name}</span>
                  {#if userIsAMemberOfTeam(team)}
                    <span
                      class="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400"
                    >
                      Member
                    </span>
                  {/if}
                  {#if isActiveTeam(team)}
                    <span
                      class="bg-primary/10 text-primary inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
                    >
                      Active
                    </span>
                  {/if}
                </div>
                <div class="text-muted-foreground text-sm">
                  Created {formatRelativeTime(team.createdAt)}
                  {#await getCreatorName(team.createdBy)}
                    <Skeleton class="h-2 w-[100px] inline-block" />
                  {:then creator}
                    by {creator.data?.user.name}
                  {:catch error}
                    {@debug error}
                    by Unknown
                  {/await}
                </div>
              </div>
            </div>

            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                {#snippet child({ props })}
                  <Button
                    {...props}
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    class="shrink-0"
                  >
                    <EllipsisIcon />
                    <span class="sr-only">Team actions for {team.name}</span>
                  </Button>
                {/snippet}
              </DropdownMenu.Trigger>

              <DropdownMenu.Content align="end" class="w-44">
                {#if userIsAMemberOfTeam(team) && !isActiveTeam(team)}
                  <DropdownMenu.Item onSelect={() => switchTeam(team)}>
                    <ArrowRightLeftIcon />
                    Switch
                  </DropdownMenu.Item>
                {/if}

                {#if !userIsAMemberOfTeam(team)}
                  <DropdownMenu.Item onSelect={() => joinTeam(team)}>
                    <LogInIcon />
                    Join
                  </DropdownMenu.Item>
                {/if}

                {#if !userIsAMemberOfTeam(team) || (userIsAMemberOfTeam(team) && !isActiveTeam(team))}
                  <DropdownMenu.Separator />
                {/if}

                {#if userIsAMemberOfTeam(team)}
                  <DropdownMenu.Item
                    onSelect={() => leaveTeam(team)}
                    class="text-amber-600 focus:text-amber-600 focus:bg-amber-500/10 dark:text-amber-400 dark:focus:bg-amber-500/15 dark:focus:text-amber-400 [&_svg]:text-amber-600 dark:[&_svg]:text-amber-400"
                  >
                    <LogOutIcon />
                    Leave
                  </DropdownMenu.Item>
                {/if}

                <DropdownMenu.Item
                  variant="destructive"
                  onSelect={() => openDeleteDialog(team)}
                >
                  <Trash2Icon />
                  Delete
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </li>
        {/each}
      </ul>
    {/if}
  {/snippet}
</SettingsSection>

<Dialog.Root
  open={deleteDialogOpen}
  onOpenChange={(open) => {
    if (!open) {
      closeDeleteDialog();
    }
  }}
>
  <Dialog.Content class="sm:max-w-md">
    <Dialog.Header>
      <Dialog.Title>Delete team</Dialog.Title>
      <Dialog.Description>
        This action cannot be undone. Type
        <span class="text-foreground font-medium">{teamToDelete?.name}</span>
        to confirm.
      </Dialog.Description>
    </Dialog.Header>

    <div class="grid gap-3">
      <Label for="delete-team-confirmation">Team name</Label>
      <Input
        id="delete-team-confirmation"
        bind:value={deleteConfirmationName}
        placeholder={teamToDelete?.name ?? "Team name"}
        autocomplete="off"
        disabled={isDeletingTeam}
      />
    </div>

    <Dialog.Footer>
      <Dialog.Close
        type="button"
        class={buttonVariants({ variant: "outline" })}
        disabled={isDeletingTeam}
      >
        Cancel
      </Dialog.Close>
      <Button
        type="button"
        variant="destructive"
        disabled={!deleteConfirmationMatches || isDeletingTeam}
        onclick={confirmDeleteTeam}
      >
        Delete team
      </Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
