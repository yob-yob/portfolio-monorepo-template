<script lang="ts">
  import FileTextIcon from "@lucide/svelte/icons/file-text";
  import ProfileSettingsSection from "./profile-settings-section.svelte";
</script>

<div class="space-y-6">
  <div class="space-y-1">
    <h2 class="text-2xl font-semibold tracking-tight">Account retention</h2>
    <p class="text-muted-foreground text-sm">
      User accounts are retained for audit and compliance. Self-service account
      deletion is not available in this application.
    </p>
  </div>

  <ProfileSettingsSection
    title="Why accounts are retained"
    description="Activity in this system is logged and must stay aligned with our records."
  >
    <div class="flex items-start gap-3">
      <div
        class="bg-muted text-muted-foreground flex size-10 shrink-0 items-center justify-center rounded-lg"
      >
        <FileTextIcon class="size-5" />
      </div>
      <ul class="text-muted-foreground list-inside list-disc space-y-2 text-sm">
        <li>User actions are recorded for audit and accountability.</li>
        <li>
          Removing an account would break the consistency of those historical
          records.
        </li>
        <li>
          Accounts are never deleted through self-service in this application.
        </li>
      </ul>
    </div>
    <p class="text-muted-foreground mt-4 text-sm">
      If you need help with access changes, contact your administrator.
    </p>
  </ProfileSettingsSection>
</div>
