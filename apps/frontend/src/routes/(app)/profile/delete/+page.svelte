<script lang="ts">
  import { onMount } from "svelte";
  import ProfileDeleteAccount from "$lib/components/profile/profile-delete-account.svelte";
  import { breadcrumbs } from "$lib/composables/breadcrumbs.svelte";

  onMount(() => {
    const profileCrumb = breadcrumbs.addCrumb({
      href: "/profile",
      label: "Profile",
    });
    const deleteCrumb = breadcrumbs.addCrumb({
      href: "/profile/delete",
      label: "Delete account",
    });

    return () => {
      breadcrumbs.removeCrumb(deleteCrumb);
      breadcrumbs.removeCrumb(profileCrumb);
    };
  });
</script>

<ProfileDeleteAccount />
