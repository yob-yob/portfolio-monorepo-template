<script lang="ts">
  import MailIcon from "@lucide/svelte/icons/mail";
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

  // Placeholder values for UI only
  const currentEmail = "jane.cooper@example.com";
  let newEmail = $state("");
  let verificationCode = $state("");
  let step = $state<"idle" | "pending">("idle");

  const handleSendVerification = (event: Event) => {
    event.preventDefault();
    if (!newEmail.trim()) {
      return;
    }
    step = "pending";
  };

  const handleCancelEmailChange = () => {
    step = "idle";
    newEmail = "";
    verificationCode = "";
  };

  const handleConfirmEmail = (event: Event) => {
    event.preventDefault();
  };
</script>

<ProfileSettingsSection
  title="Email address"
  description="Change the email you use to sign in. We will send a verification link before the change takes effect."
>
  {#snippet children()}
    <FieldGroup>
      <Field>
        <FieldLabel for="current-email-{id}">Current email</FieldLabel>
        <Input
          id="current-email-{id}"
          type="email"
          value={currentEmail}
          disabled
          class="bg-muted"
        />
        <FieldDescription>
          This is the email currently associated with your account.
        </FieldDescription>
      </Field>

      {#if step === "idle"}
        <form id="profile-email-form" onsubmit={handleSendVerification}>
          <Field>
            <FieldLabel for="new-email-{id}">New email address</FieldLabel>
            <Input
              id="new-email-{id}"
              name="newEmail"
              type="email"
              bind:value={newEmail}
              placeholder="you@example.com"
              autocomplete="email"
              required
            />
          </Field>
        </form>
      {:else}
        <div
          class="border-border bg-muted/50 flex gap-3 rounded-lg border p-4"
          role="status"
        >
          <MailIcon class="text-primary mt-0.5 size-5 shrink-0" />
          <div class="space-y-1 text-sm">
            <p class="font-medium">Check your inbox</p>
            <p class="text-muted-foreground">
              We sent a verification link to
              <span class="text-foreground font-medium">{newEmail}</span>. Open
              the link or enter the code below to confirm your new email.
            </p>
          </div>
        </div>

        <form id="profile-email-verify-form" onsubmit={handleConfirmEmail}>
          <Field>
            <FieldLabel for="verification-code-{id}">
              Verification code
            </FieldLabel>
            <Input
              id="verification-code-{id}"
              name="verificationCode"
              bind:value={verificationCode}
              placeholder="Enter 6-digit code"
              inputmode="numeric"
              autocomplete="one-time-code"
            />
            <FieldDescription>
              Optional if you verified via the email link.
            </FieldDescription>
          </Field>
        </form>
      {/if}
    </FieldGroup>
  {/snippet}
  {#snippet footer()}
    {#if step === "idle"}
      <Button type="submit" form="profile-email-form">
        Send verification email
      </Button>
    {:else}
      <div class="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          onclick={handleCancelEmailChange}
        >
          Cancel
        </Button>
        <Button type="button" variant="ghost">Resend email</Button>
        <Button type="submit" form="profile-email-verify-form">
          Confirm new email
        </Button>
      </div>
    {/if}
  {/snippet}
</ProfileSettingsSection>
