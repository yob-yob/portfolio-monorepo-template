<script lang="ts">
  import { toast } from "svelte-sonner";
  import { authClient } from "@/auth/client";
  import { invalidateAll } from "$app/navigation";
  import SettingsSection from "$lib/components/settings-section.svelte";
  import { Button } from "$lib/components/ui/button/index.js";
  import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
  } from "$lib/components/ui/field/index.js";
  import { Input } from "$lib/components/ui/input/index.js";

  const id = $props.id();

  let teamName = $state("");

  const handleSubmit = async (event: Event) => {
    event.preventDefault();

    if (teamName.trim() === "") {
      toast.warning("Empty Team Name");
      return;
    }

    const { error } = await authClient.organization.createTeam({
      name: teamName,
    });

    if (error) {
      toast.error(
        `There was a problem while creating the new team: ${error.message}`
      );
      return;
    }

    toast.success(`New team created: ${teamName}`);
    invalidateAll();
    teamName = "";
  };
</script>

<SettingsSection
  title="Create team"
  description="Add a new team to organize members and resources within your organization."
>
  {#snippet children()}
    <form id="create-team-form-{id}" onsubmit={handleSubmit}>
      <FieldGroup>
        <Field>
          <FieldLabel for="team-name-{id}">Team name</FieldLabel>
          <Input
            id="team-name-{id}"
            name="teamName"
            bind:value={teamName}
            placeholder="Engineering"
            autocomplete="off"
          />
          <FieldDescription>
            Choose a short, recognizable name for this team.
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  {/snippet}
  {#snippet footer()}
    <Button type="submit" form="create-team-form-{id}">Create team</Button>
  {/snippet}
</SettingsSection>
