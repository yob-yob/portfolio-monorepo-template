<script lang="ts">
  import { toast } from "svelte-sonner";
  import { authClient } from "@/auth/client";
  import { Button } from "$lib/components/ui/button/index.js";
  import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
  } from "$lib/components/ui/field/index.js";
  import * as Password from "$lib/components/ui/password";
  import ProfileSettingsSection from "./profile-settings-section.svelte";

  const id = $props.id();

  const handleSubmit = async (event: Event) => {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);
    const currentPassword = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (currentPassword === newPassword) {
      toast.warning("New password cannot be the same as the current password");
      return;
    }

    if (confirmPassword !== newPassword) {
      toast.warning("Passwords do not match");
      return;
    }

    const { error } = await authClient.changePassword({
      newPassword,
      currentPassword,
      revokeOtherSessions: true,
    });

    if (error) {
      toast.error(`Failed to update password: ${error.message}`);
      return;
    }

    toast.success("Password updated successfully");
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
          <Password.Root>
            <Password.Input
              id="current-password-{id}"
              name="currentPassword"
              autocomplete="current-password"
              required
            >
              <Password.ToggleVisibility />
            </Password.Input>
          </Password.Root>
        </Field>
        <Field>
          <FieldLabel for="new-password-{id}">New password</FieldLabel>
          <Password.Root>
            <Password.Input
              id="new-password-{id}"
              name="newPassword"
              autocomplete="new-password"
              required
            >
              <Password.ToggleVisibility />
            </Password.Input>
            <Password.Strength />
          </Password.Root>
          <FieldDescription>
            Use at least 8 characters with a mix of letters and numbers.
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel for="confirm-password-{id}">
            Confirm new password
          </FieldLabel>
          <Password.Root>
            <Password.Input
              id="confirm-password-{id}"
              name="confirmPassword"
              autocomplete="new-password"
              required
            >
              <Password.ToggleVisibility />
            </Password.Input>
          </Password.Root>
        </Field>
      </FieldGroup>
    </form>
  {/snippet}
  {#snippet footer()}
    <Button type="submit" form="profile-password-form">Update password</Button>
  {/snippet}
</ProfileSettingsSection>
