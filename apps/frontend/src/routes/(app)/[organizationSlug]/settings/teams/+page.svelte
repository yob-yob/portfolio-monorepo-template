<!-- Organization teams settings page -->
<script lang="ts" module>
  import { resolve } from "$app/paths";

  export const OrganizationTeamsSettingsRoute = (organizationSlug: string) =>
    resolve("/(app)/[organizationSlug]/settings/teams", {
      organizationSlug,
    });
</script>

<script lang="ts">
  import { onMount } from "svelte";
  import OrganizationCreateTeamForm from "$lib/components/organization-settings/organization-create-team-form.svelte";
  import OrganizationTeamsList from "$lib/components/organization-settings/organization-teams-list.svelte";
  import { breadcrumbs } from "$lib/composables/breadcrumbs.svelte";

  const { params, data } = $props();

  onMount(() => {
    const OrgTeamSettings = breadcrumbs.addCrumb({
      href: OrganizationTeamsSettingsRoute(params.organizationSlug),
      label: "Teams",
      sort_order: 3,
    });

    return () => {
      breadcrumbs.removeCrumb(OrgTeamSettings);
    };
  });
</script>

<div class="space-y-6">
  <div class="space-y-1">
    <h2 class="text-2xl font-semibold tracking-tight">Teams</h2>
    <p class="text-muted-foreground text-sm">
      Manage teams in your organization, switch workspaces, and create new
      teams.
    </p>
  </div>

  <OrganizationTeamsList
    teams={data.organization.teams}
    userTeams={data.userTeams}
    activeTeamId={data.session.activeTeamId}
    userId={data.user.id}
  />
  <OrganizationCreateTeamForm />
</div>
