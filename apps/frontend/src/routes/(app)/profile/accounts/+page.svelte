<script lang="ts">
  import { onMount } from "svelte";
  import ProfileConnectedAccounts from "$lib/components/profile/profile-connected-accounts.svelte";
  import { breadcrumbs } from "$lib/composables/breadcrumbs.svelte";

  onMount(() => {
    const profileCrumb = breadcrumbs.addCrumb({
      href: "/profile",
      label: "Profile",
    });
    const accountsCrumb = breadcrumbs.addCrumb({
      href: "/profile/accounts",
      label: "Connected accounts",
    });

    return () => {
      breadcrumbs.removeCrumb(accountsCrumb);
      breadcrumbs.removeCrumb(profileCrumb);
    };
  });
</script>

<ProfileConnectedAccounts />
