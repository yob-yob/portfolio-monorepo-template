<script lang="ts">
  import MailIcon from "@lucide/svelte/icons/mail";
  import { toast } from "svelte-sonner";
  import { authClient } from "@/auth/client";
  import { refreshAll } from "$app/navigation";
  import { Button } from "$lib/components/ui/button/index.js";
  import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
  } from "$lib/components/ui/field/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import ProfileSettingsSection from "./profile-settings-section.svelte";

  type EmailChangeStep = "idle" | "current-otp" | "new-email" | "new-otp";

  const id = $props.id();

  const { currentEmail, emailVerified } = $props<{
    currentEmail: string;
    emailVerified: boolean;
  }>();

  let step = $state<EmailChangeStep>("idle");
  let currentEmailOtp = $state("");
  let newEmail = $state("");
  let newEmailOtp = $state("");
  let isLoading = $state(false);

  const resetForm = () => {
    step = "idle";
    currentEmailOtp = "";
    newEmail = "";
    newEmailOtp = "";
    isLoading = false;
  };

  const handleStartEmailChange = async () => {
    isLoading = true;

    const { error } = await authClient.emailOtp.sendVerificationOtp({
      email: currentEmail,
      type: "email-verification",
    });

    isLoading = false;

    if (error) {
      toast.error(`Failed to send verification code: ${error.message}`);
      return;
    }

    toast.success("Verification code sent to your current email");
    step = "current-otp";
  };

  const handleContinueToNewEmail = (event: Event) => {
    event.preventDefault();

    if (!currentEmailOtp.trim()) {
      toast.warning("Enter the verification code from your current email");
      return;
    }

    step = "new-email";
  };

  const handleRequestNewEmail = async (event: Event) => {
    event.preventDefault();

    const trimmedNewEmail = newEmail.trim();

    if (!trimmedNewEmail) {
      toast.warning("Enter your new email address");
      return;
    }

    if (trimmedNewEmail.toLowerCase() === currentEmail.toLowerCase()) {
      toast.warning("New email must be different from your current email");
      return;
    }

    isLoading = true;

    const { error } = await authClient.emailOtp.requestEmailChange({
      newEmail: trimmedNewEmail,
      otp: currentEmailOtp,
    });

    isLoading = false;

    if (error) {
      toast.error(`Failed to send verification code: ${error.message}`);
      return;
    }

    toast.success("Verification code sent to your new email");
    step = "new-otp";
  };

  const handleConfirmEmailChange = async (event: Event) => {
    event.preventDefault();

    if (!newEmailOtp.trim()) {
      toast.warning("Enter the verification code from your new email");
      return;
    }

    isLoading = true;

    const { error } = await authClient.emailOtp.changeEmail({
      newEmail: newEmail.trim(),
      otp: newEmailOtp,
    });

    isLoading = false;

    if (error) {
      toast.error(`Failed to change email: ${error.message}`);
      return;
    }

    toast.success("Email address updated successfully");
    resetForm();

    // We need to reset everything because the session needs to update
    // so that we get a new user state.
    refreshAll();
  };

  const handleResendCurrentEmailOtp = async () => {
    isLoading = true;

    const { error } = await authClient.emailOtp.sendVerificationOtp({
      email: currentEmail,
      type: "email-verification",
    });

    isLoading = false;

    if (error) {
      toast.error(`Failed to resend verification code: ${error.message}`);
      return;
    }

    toast.success("Verification code resent to your current email");
  };

  const handleResendNewEmailOtp = async () => {
    isLoading = true;

    const { error } = await authClient.emailOtp.sendVerificationOtp({
      email: currentEmail,
      type: "email-verification",
    });

    isLoading = false;

    if (error) {
      toast.error(`Failed to resend verification code: ${error.message}`);
      return;
    }

    currentEmailOtp = "";
    newEmailOtp = "";
    step = "current-otp";
    toast.info(
      "Verify your current email again to resend a code to your new address."
    );
  };
</script>

<ProfileSettingsSection
  title="Email address"
  description="Change the email you use to sign in. We will verify your current email first, then confirm the new one with a code."
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
        <FieldDescription>
          Start the process to receive a verification code at your current email
          address.
        </FieldDescription>
      {:else if step === "current-otp"}
        <div
          class="border-border bg-muted/50 flex gap-3 rounded-lg border p-4"
          role="status"
        >
          <MailIcon class="text-primary mt-0.5 size-5 shrink-0" />
          <div class="space-y-1 text-sm">
            <p class="font-medium">Check your current inbox</p>
            <p class="text-muted-foreground">
              We sent a verification code to
              <span class="text-foreground font-medium">{currentEmail}</span>.
              Enter it below to continue.
            </p>
          </div>
        </div>

        <form
          id="profile-email-current-otp-form"
          onsubmit={handleContinueToNewEmail}
        >
          <Field>
            <FieldLabel for="current-email-otp-{id}">
              Verification code
            </FieldLabel>
            <Input
              id="current-email-otp-{id}"
              name="currentEmailOtp"
              bind:value={currentEmailOtp}
              placeholder="Enter 6-digit code"
              inputmode="numeric"
              autocomplete="one-time-code"
              required
            />
          </Field>
        </form>
      {:else if step === "new-email"}
        <form id="profile-email-new-form" onsubmit={handleRequestNewEmail}>
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
            <FieldDescription>
              We will send a verification code to this address.
            </FieldDescription>
          </Field>
        </form>
      {:else}
        <div
          class="border-border bg-muted/50 flex gap-3 rounded-lg border p-4"
          role="status"
        >
          <MailIcon class="text-primary mt-0.5 size-5 shrink-0" />
          <div class="space-y-1 text-sm">
            <p class="font-medium">Check your new inbox</p>
            <p class="text-muted-foreground">
              We sent a verification code to
              <span class="text-foreground font-medium">{newEmail}</span>. Enter
              it below to confirm your new email.
            </p>
          </div>
        </div>

        <form
          id="profile-email-verify-form"
          onsubmit={handleConfirmEmailChange}
        >
          <Field>
            <FieldLabel for="new-email-otp-{id}">Verification code</FieldLabel>
            <Input
              id="new-email-otp-{id}"
              name="newEmailOtp"
              bind:value={newEmailOtp}
              placeholder="Enter 6-digit code"
              inputmode="numeric"
              autocomplete="one-time-code"
              required
            />
          </Field>
        </form>
      {/if}
    </FieldGroup>
  {/snippet}
  {#snippet footer()}
    {#if step === "idle"}
      <Button
        type="button"
        disabled={isLoading}
        onclick={handleStartEmailChange}
      >
        Start email change
      </Button>
    {:else if step === "current-otp"}
      <div class="flex flex-wrap gap-2">
        <Button type="button" variant="outline" onclick={resetForm}>
          Cancel
        </Button>
        <Button
          type="button"
          variant="ghost"
          disabled={isLoading}
          onclick={handleResendCurrentEmailOtp}
        >
          Resend code
        </Button>
        <Button
          type="submit"
          form="profile-email-current-otp-form"
          disabled={isLoading}
        >
          Continue
        </Button>
      </div>
    {:else if step === "new-email"}
      <div class="flex flex-wrap gap-2">
        <Button type="button" variant="outline" onclick={resetForm}>
          Cancel
        </Button>
        <Button
          type="submit"
          form="profile-email-new-form"
          disabled={isLoading}
        >
          Send verification code
        </Button>
      </div>
    {:else}
      <div class="flex flex-wrap gap-2">
        <Button type="button" variant="outline" onclick={resetForm}>
          Cancel
        </Button>
        <Button
          type="button"
          variant="ghost"
          disabled={isLoading}
          onclick={handleResendNewEmailOtp}
        >
          Resend code
        </Button>
        <Button
          type="submit"
          form="profile-email-verify-form"
          disabled={isLoading}
        >
          Confirm new email
        </Button>
      </div>
    {/if}
  {/snippet}
</ProfileSettingsSection>
