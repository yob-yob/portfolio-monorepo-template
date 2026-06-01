<script lang="ts">
  import { onMount } from "svelte";
  import ProfileAccountRetention from "$lib/components/profile/profile-account-retention.svelte";
  import { breadcrumbs } from "$lib/composables/breadcrumbs.svelte";

  onMount(() => {
    const profileCrumb = breadcrumbs.addCrumb({
      href: "/profile",
      label: "Profile",
      sort_order: 2,
    });

    const retentionCrumb = breadcrumbs.addCrumb({
      href: "/profile/account-retention",
      label: "Account retention",
      sort_order: 3,
    });

    return () => {
      breadcrumbs.removeCrumb(retentionCrumb);
      breadcrumbs.removeCrumb(profileCrumb);
    };
  });
</script>

<ProfileAccountRetention />
