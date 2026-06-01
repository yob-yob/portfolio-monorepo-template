<script lang="ts" module>
  import { resolve } from "$app/paths";

  export const ProfileSettingsRoute = () => resolve("/(app)/profile");
</script>

<script lang="ts">
  import ProfileDetailsForm from "$lib/components/profile/profile-details-form.svelte";
  import ProfilePasswordForm from "$lib/components/profile/profile-password-form.svelte";

  const { data } = $props();
</script>

<ProfileDetailsForm user={data.user} />
<ProfilePasswordForm />
