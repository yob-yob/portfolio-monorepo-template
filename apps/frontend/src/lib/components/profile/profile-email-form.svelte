<script lang="ts">
  import BadgeCheckIcon from "@lucide/svelte/icons/badge-check";
  import CircleAlertIcon from "@lucide/svelte/icons/circle-alert";
  import MailIcon from "@lucide/svelte/icons/mail";
  import { onDestroy } from "svelte";
  import { fly } from "svelte/transition";
  import { toast } from "svelte-sonner";
  import { authClient } from "@/auth/client";
  import { refreshAll } from "$app/navigation";
  import { Button } from "$lib/components/ui/button/index.js";
  import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
  } from "$lib/components/ui/field/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import ProfileSettingsSection from "./profile-settings-section.svelte";

  type EmailChangeStep = "idle" | "request-change" | "new-otp";

  const OTP_RESEND_COOLDOWN_SECONDS = 60;
  const OTP_DIGIT_PATTERN = /^\d{6}$/;

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
  let currentEmailOtpError = $state("");
  let otpResendCooldownRemaining = $state(0);

  let otpResendCooldownInterval: ReturnType<typeof setInterval> | null = null;

  const isOtpResendOnCooldown = $derived(otpResendCooldownRemaining > 0);

  const clearOtpResendCooldownInterval = () => {
    if (otpResendCooldownInterval !== null) {
      clearInterval(otpResendCooldownInterval);
      otpResendCooldownInterval = null;
    }
  };

  const startOtpResendCooldown = () => {
    clearOtpResendCooldownInterval();
    otpResendCooldownRemaining = OTP_RESEND_COOLDOWN_SECONDS;

    otpResendCooldownInterval = setInterval(() => {
      if (otpResendCooldownRemaining <= 1) {
        otpResendCooldownRemaining = 0;
        clearOtpResendCooldownInterval();
        return;
      }

      otpResendCooldownRemaining -= 1;
    }, 1000);
  };

  const formatOtpResendCooldown = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const sanitizeOtpInput = (value: string) =>
    value.replace(/\D/g, "").slice(0, 6);

  const handleCurrentEmailOtpInput = (event: Event) => {
    const input = event.currentTarget as HTMLInputElement;
    currentEmailOtp = sanitizeOtpInput(input.value);
    currentEmailOtpError = "";
  };

  const validateCurrentEmailOtp = () => {
    currentEmailOtp = sanitizeOtpInput(currentEmailOtp);
    const trimmedOtp = currentEmailOtp.trim();

    if (!trimmedOtp) {
      currentEmailOtpError = "Enter the code from your current email";
      return false;
    }

    if (!OTP_DIGIT_PATTERN.test(trimmedOtp)) {
      currentEmailOtpError = "Code must be exactly 6 digits";
      return false;
    }

    currentEmailOtpError = "";
    return true;
  };

  const otpResendButtonClass =
    "h-auto shrink-0 px-0 text-sm cursor-pointer disabled:cursor-not-allowed disabled:text-muted-foreground disabled:opacity-100";

  onDestroy(() => {
    clearOtpResendCooldownInterval();
  });

  const stepEnterTransition = {
    y: 8,
    duration: 220,
  };

  const stepExitTransition = {
    y: -8,
    duration: 180,
  };

  const resetForm = () => {
    step = "idle";
    currentEmailOtp = "";
    newEmail = "";
    newEmailOtp = "";
    isLoading = false;
    currentEmailOtpError = "";
    otpResendCooldownRemaining = 0;
    clearOtpResendCooldownInterval();
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

    toast.success(`Verification code sent to ${currentEmail}`);
    step = "request-change";
    startOtpResendCooldown();
  };

  const handleRequestNewEmail = async (event: Event) => {
    event.preventDefault();

    if (!validateCurrentEmailOtp()) {
      return;
    }

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
      toast.error(`Could not send code to your new email: ${error.message}`);
      return;
    }

    toast.success(`Verification code sent to ${newEmail.trim()}`);
    step = "new-otp";
    startOtpResendCooldown();
  };

  const handleConfirmEmailChange = async (event: Event) => {
    event.preventDefault();

    if (!newEmailOtp.trim()) {
      toast.warning("Enter the code from your new email");
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
    refreshAll();
  };

  const handleResendCurrentEmailOtp = async () => {
    if (isOtpResendOnCooldown) {
      return;
    }

    isLoading = true;

    const { error } = await authClient.emailOtp.sendVerificationOtp({
      email: currentEmail,
      type: "email-verification",
    });

    isLoading = false;

    if (error) {
      toast.error(`Failed to send a new verification code: ${error.message}`);
      return;
    }

    currentEmailOtp = "";
    currentEmailOtpError = "";
    toast.success(`New verification code sent to ${currentEmail}`);
    startOtpResendCooldown();
  };

  const handleResendNewEmailOtp = async () => {
    if (isOtpResendOnCooldown) {
      return;
    }

    isLoading = true;

    const { error } = await authClient.emailOtp.sendVerificationOtp({
      email: currentEmail,
      type: "email-verification",
    });

    isLoading = false;

    if (error) {
      toast.error(`Failed to send a new verification code: ${error.message}`);
      return;
    }

    currentEmailOtp = "";
    newEmailOtp = "";
    currentEmailOtpError = "";
    step = "request-change";
    startOtpResendCooldown();
    toast.info(
      `Re-enter the code from ${currentEmail} and your new address to send a new code to your new email.`
    );
  };
</script>

<ProfileSettingsSection
  title="Email address"
  description="Changing your email takes three steps: verify your current inbox, choose a new address, then confirm the new inbox."
>
  {#snippet children()}
    <FieldGroup>
      <Field>
        <div class="flex items-center gap-2">
          <FieldLabel for="current-email-{id}">Current email</FieldLabel>
          {#if emailVerified}
            <BadgeCheckIcon
              class="text-primary size-4 shrink-0"
              aria-label="Email verified"
              title="Email verified"
            />
          {:else}
            <CircleAlertIcon
              class="size-4 shrink-0 text-amber-600 dark:text-amber-500"
              aria-label="Email not verified"
            />
          {/if}
        </div>
        <Input
          id="current-email-{id}"
          type="email"
          value={currentEmail}
          disabled
          class="bg-muted"
        />
        {#if step === "idle"}
          <FieldDescription>
            {#if emailVerified}
              This email is verified and used to sign in.
            {:else}
              This email is not verified yet.
            {/if}
          </FieldDescription>
        {/if}
      </Field>

      {#if step === "new-otp"}
        <Field>
          <FieldLabel for="new-email-display-{id}"
            >New email address</FieldLabel
          >
          <Input
            id="new-email-display-{id}"
            type="email"
            value={newEmail}
            disabled
            class="bg-muted"
          />
          <FieldDescription>
            Enter the code we sent to this address to finish the change.
          </FieldDescription>
        </Field>
      {/if}

      <div class="min-h-80">
        {#key step}
          <div
            class="flex flex-col gap-4"
            in:fly={stepEnterTransition}
            out:fly={stepExitTransition}
          >
            {#if step === "idle"}
              <FieldDescription>
                We will email a code to your current address so you can confirm
                it is you before making a change.
              </FieldDescription>
            {:else if step === "request-change"}
              <div
                class="border-border bg-muted/50 flex gap-3 rounded-lg border p-4"
                role="status"
              >
                <MailIcon class="text-primary mt-0.5 size-5 shrink-0" />
                <div class="space-y-1 text-sm">
                  <p class="font-medium">Step 2 of 3 — Confirm it is you</p>
                  <p class="text-muted-foreground">
                    We emailed a code to
                    <span class="text-foreground font-medium"
                      >{currentEmail}</span
                    >. Enter that code below, then the address you want to use
                    instead.
                  </p>
                </div>
              </div>

              <form
                id="profile-email-request-form"
                novalidate
                onsubmit={handleRequestNewEmail}
              >
                <FieldGroup>
                  <Field>
                    <div class="flex items-center justify-between gap-3">
                      <FieldLabel for="current-email-otp-{id}">
                        Code from current email
                      </FieldLabel>
                      <Button
                        type="button"
                        variant="link"
                        disabled={isLoading || isOtpResendOnCooldown}
                        class={otpResendButtonClass}
                        onclick={handleResendCurrentEmailOtp}
                      >
                        {#if isOtpResendOnCooldown}
                          Request a new code ({formatOtpResendCooldown(
                            otpResendCooldownRemaining
                          )})
                        {:else}
                          Request a new code
                        {/if}
                      </Button>
                    </div>
                    <Input
                      id="current-email-otp-{id}"
                      name="currentEmailOtp"
                      type="text"
                      bind:value={currentEmailOtp}
                      oninput={handleCurrentEmailOtpInput}
                      placeholder="Enter 6-digit code"
                      inputmode="numeric"
                      autocomplete="one-time-code"
                      maxlength={6}
                      aria-invalid={currentEmailOtpError ? true : undefined}
                      required
                    />
                    {#if currentEmailOtpError}
                      <FieldError>{currentEmailOtpError}</FieldError>
                    {/if}
                  </Field>
                  <Field>
                    <FieldLabel for="new-email-{id}"
                      >New email address</FieldLabel
                    >
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
                      After you continue, we will email a code to this address
                      for the final confirmation step.
                    </FieldDescription>
                  </Field>
                </FieldGroup>
              </form>
            {:else}
              <div
                class="border-border bg-muted/50 flex gap-3 rounded-lg border p-4"
                role="status"
              >
                <MailIcon class="text-primary mt-0.5 size-5 shrink-0" />
                <div class="space-y-1 text-sm">
                  <p class="font-medium"
                    >Step 3 of 3 — Confirm your new email</p
                  >
                  <p class="text-muted-foreground">
                    We emailed a code to
                    <span class="text-foreground font-medium">{newEmail}</span>.
                    Enter it below to finish changing your email.
                  </p>
                </div>
              </div>

              <form
                id="profile-email-verify-form"
                onsubmit={handleConfirmEmailChange}
              >
                <Field>
                  <div class="flex items-center justify-between gap-3">
                    <FieldLabel for="new-email-otp-{id}">
                      Code from new email
                    </FieldLabel>
                    <Button
                      type="button"
                      variant="link"
                      disabled={isLoading || isOtpResendOnCooldown}
                      class={otpResendButtonClass}
                      onclick={handleResendNewEmailOtp}
                    >
                      {#if isOtpResendOnCooldown}
                        Request a new code ({formatOtpResendCooldown(
                          otpResendCooldownRemaining
                        )})
                      {:else}
                        Request a new code
                      {/if}
                    </Button>
                  </div>
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
          </div>
        {/key}
      </div>
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
    {:else if step === "request-change"}
      <div class="flex flex-wrap gap-2">
        <Button type="button" variant="outline" onclick={resetForm}>
          Cancel
        </Button>
        <Button
          type="submit"
          form="profile-email-request-form"
          disabled={isLoading}
        >
          Send code to new email
        </Button>
      </div>
    {:else}
      <div class="flex flex-wrap gap-2">
        <Button type="button" variant="outline" onclick={resetForm}>
          Cancel
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
