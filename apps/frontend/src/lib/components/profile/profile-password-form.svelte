<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
  } from "$lib/components/ui/field/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import ProfileSettingsSection from "./profile-settings-section.svelte";

  const id = $props.id();

  const handleSubmit = (event: Event) => {
    event.preventDefault();
  };
</script>

<ProfileSettingsSection
  title="Password"
  description="Change your password. You will stay signed in on this device."
>
  {#snippet children()}
    <form id="profile-password-form" onsubmit={handleSubmit}>
      <FieldGroup>
        <Field>
          <FieldLabel for="current-password-{id}">Current password</FieldLabel>
          <Input
            id="current-password-{id}"
            name="currentPassword"
            type="password"
            autocomplete="current-password"
            required
          />
        </Field>
        <Field>
          <FieldLabel for="new-password-{id}">New password</FieldLabel>
          <Input
            id="new-password-{id}"
            name="newPassword"
            type="password"
            autocomplete="new-password"
            required
          />
          <FieldDescription>
            Use at least 8 characters with a mix of letters and numbers.
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel for="confirm-password-{id}">
            Confirm new password
          </FieldLabel>
          <Input
            id="confirm-password-{id}"
            name="confirmPassword"
            type="password"
            autocomplete="new-password"
            required
          />
        </Field>
      </FieldGroup>
    </form>
  {/snippet}
  {#snippet footer()}
    <Button type="submit" form="profile-password-form">Update password</Button>
  {/snippet}
</ProfileSettingsSection>
