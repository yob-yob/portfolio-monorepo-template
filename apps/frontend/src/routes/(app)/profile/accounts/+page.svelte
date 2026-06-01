<script lang="ts">
  import { onMount } from "svelte";
  import ProfileConnectedAccounts from "$lib/components/profile/profile-connected-accounts.svelte";
  import { breadcrumbs } from "$lib/composables/breadcrumbs.svelte";

  onMount(() => {
    const profileCrumb = breadcrumbs.addCrumb({
      href: "/profile",
      label: "Profile",
      sort_order: 2,
    });
    const accountsCrumb = breadcrumbs.addCrumb({
      href: "/profile/accounts",
      label: "Connected accounts",
      sort_order: 3,
    });

    return () => {
      breadcrumbs.removeCrumb(accountsCrumb);
      breadcrumbs.removeCrumb(profileCrumb);
    };
  });
</script>

<ProfileConnectedAccounts />
