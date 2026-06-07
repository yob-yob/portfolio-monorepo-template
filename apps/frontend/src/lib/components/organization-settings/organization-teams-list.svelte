<script lang="ts">
  import ArrowRightLeftIcon from "@lucide/svelte/icons/arrow-right-left";
  import LogInIcon from "@lucide/svelte/icons/log-in";
  import LogOutIcon from "@lucide/svelte/icons/log-out";
  import Trash2Icon from "@lucide/svelte/icons/trash-2";
  import UsersIcon from "@lucide/svelte/icons/users";
  import { toast } from "svelte-sonner";
  import { authClient } from "@/auth/client";
  import { invalidateAll } from "$app/navigation";
  import SettingsSection from "$lib/components/settings-section.svelte";
  import * as Avatar from "$lib/components/ui/avatar/index.js";
  import { Button } from "$lib/components/ui/button/index.js";

  interface TeamData {
    createdAt: Date | string;
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

  const isActiveTeam = (team: TeamData) => activeTeamId === team.id;

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

  const deleteTeam = async (team: TeamData) => {
    const { error } = await authClient.organization.removeTeam({
      teamId: team.id,
    });

    if (error) {
      toast.error(
        `There was a problem while deleting the team (${team.name}): ${error.message}`
      );
      return;
    }

    toast.success(`Team Deleted: ${team.name}`);
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
                <p class="text-muted-foreground text-sm">
                  Created {formatRelativeTime(team.createdAt)}
                </p>
              </div>
            </div>

            <div class="flex flex-wrap items-center gap-2 sm:justify-end">
              {#if userIsAMemberOfTeam(team) && !isActiveTeam(team)}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onclick={() => switchTeam(team)}
                >
                  <ArrowRightLeftIcon />
                  Switch
                </Button>
              {/if}

              {#if !userIsAMemberOfTeam(team)}
                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  onclick={() => joinTeam(team)}
                >
                  <LogInIcon />
                  Join
                </Button>
              {:else}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onclick={() => leaveTeam(team)}
                >
                  <LogOutIcon />
                  Leave
                </Button>
              {/if}

              <Button
                type="button"
                variant="destructive"
                size="sm"
                onclick={() => deleteTeam(team)}
              >
                <Trash2Icon />
                Delete
              </Button>
            </div>
          </li>
        {/each}
      </ul>
    {/if}
  {/snippet}
</SettingsSection>
