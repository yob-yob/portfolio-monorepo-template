<script lang="ts" module>
  import { resolve } from "$app/paths";

  export const ProfileAccountRetentionRoute = () =>
    resolve("/(app)/profile/account-retention");
</script>

<script lang="ts">
  import { onMount } from "svelte";
  import ProfileAccountRetention from "$lib/components/profile/profile-account-retention.svelte";
  import { breadcrumbs } from "$lib/composables/breadcrumbs.svelte";

  onMount(() => {
    const retentionCrumb = breadcrumbs.addCrumb({
      href: ProfileAccountRetentionRoute(),
      label: "Account retention",
      sort_order: 3,
    });

    return () => {
      breadcrumbs.removeCrumb(retentionCrumb);
    };
  });
</script>

<ProfileAccountRetention />
