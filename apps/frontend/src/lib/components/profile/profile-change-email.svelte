<script lang="ts">
  import BadgeCheckIcon from "@lucide/svelte/icons/badge-check";
  import CircleAlertIcon from "@lucide/svelte/icons/circle-alert";
  import {
    Field,
    FieldDescription,
    FieldLabel,
  } from "$lib/components/ui/field/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import ProfileEmailForm from "./profile-email-form.svelte";
  import ProfileSettingsSection from "./profile-settings-section.svelte";

  const id = $props.id();

  const { currentEmail, emailVerified } = $props<{
    currentEmail: string;
    emailVerified: boolean;
  }>();
</script>

<div class="space-y-6">
  <div class="space-y-1">
    <h2 class="text-2xl font-semibold tracking-tight">Email address</h2>
    <p class="text-muted-foreground text-sm">
      Change the email you use to sign in. We will verify your current inbox
      before accepting a new address.
    </p>
  </div>

  <ProfileSettingsSection
    title="Current email"
    description="This is the address linked to your account today."
  >
    {#snippet children()}
      <Field>
        <div class="flex items-center gap-2">
          <FieldLabel for="current-email-display-{id}">Email address</FieldLabel>
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
              title="Email not verified"
            />
          {/if}
        </div>
        <Input
          id="current-email-display-{id}"
          type="email"
          value={currentEmail}
          disabled
          class="bg-muted"
        />
        <FieldDescription>
          {#if emailVerified}
            This email is verified and used to sign in.
          {:else}
            This email is not verified yet.
          {/if}
        </FieldDescription>
      </Field>
    {/snippet}
  </ProfileSettingsSection>

  <ProfileEmailForm {currentEmail} />
</div>
