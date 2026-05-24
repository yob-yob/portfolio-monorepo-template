<script lang="ts">
  import ProfileAccountsList from "./profile-accounts-list.svelte";
</script>

<div class="space-y-6">
  <div class="space-y-1">
    <h2 class="text-2xl font-semibold tracking-tight">Connected accounts</h2>
    <p class="text-muted-foreground text-sm">
      See how you sign in to this application. Link additional providers when
      they become available.
    </p>
  </div>

  <ProfileAccountsList />
</div>
