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

  let {
    organizationName: sourceOrganizationName,
  }: { organizationName: string } = $props();

  let organizationName = $state("");

  $effect.pre(() => {
    organizationName = sourceOrganizationName;
  });

  const handleSubmit = async (event: Event) => {
    event.preventDefault();
    if (!organizationName.trim()) {
      toast.warning("Organization name cannot be empty");
      return;
    }

    const { data, error } = await authClient.organization.update({
      data: {
        name: organizationName,
      },
    });

    if (error) {
      toast.error(
        error.message ??
          `An unknown error occurred: ${error.status} (${error.statusText})`
      );
      return;
    }

    toast.success(`Organization name update saved (${data.name})`);

    invalidateAll();
  };
</script>

<SettingsSection
  title="Organization name"
  description="The display name shown to members and on shared resources."
>
  {#snippet children()}
    <form id="organization-name-form-{id}" onsubmit={handleSubmit}>
      <FieldGroup>
        <Field>
          <FieldLabel for="organization-name-{id}">Name</FieldLabel>
          <Input
            id="organization-name-{id}"
            name="name"
            bind:value={organizationName}
            placeholder="Acme Corporation"
            autocomplete="organization"
          />
          <FieldDescription>
            This name is visible to all organization members.
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  {/snippet}
  {#snippet footer()}
    <Button type="submit" form="organization-name-form-{id}">Save name</Button>
  {/snippet}
</SettingsSection>
