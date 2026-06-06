<script lang="ts">
  import { toast } from "svelte-sonner";
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

  let newOwnerIdentifier = $state("");

  const handleSubmit = (event: Event) => {
    event.preventDefault();
    if (!newOwnerIdentifier.trim()) {
      toast.warning("Enter an email address or user ID for the new owner");
      return;
    }
    toast.success("Ownership transfer request submitted (placeholder)");
  };
</script>

<SettingsSection
  title="Switch owner"
  description="Transfer organization ownership to another member."
>
  {#snippet children()}
    <form id="organization-owner-form-{id}" onsubmit={handleSubmit}>
      <FieldGroup>
        <Field>
          <FieldLabel for="new-owner-identifier-{id}">
            New owner email or user ID
          </FieldLabel>
          <Input
            id="new-owner-identifier-{id}"
            name="newOwner"
            type="text"
            bind:value={newOwnerIdentifier}
            placeholder="member@example.com or usr_abc123"
            autocomplete="off"
            aria-describedby="new-owner-hint-{id}"
          />
          <FieldDescription id="new-owner-hint-{id}">
            The new owner must already be a member of this organization. They
            will gain full administrative control, and your role will change
            after the transfer completes.
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  {/snippet}
  {#snippet footer()}
    <Button
      type="submit"
      form="organization-owner-form-{id}"
      variant="destructive"
    >
      Transfer ownership
    </Button>
  {/snippet}
</SettingsSection>
