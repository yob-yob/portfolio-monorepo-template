<script lang="ts" module>
  import { resolve } from "$app/paths";

  export const ProfileAccountsRoute = () => resolve("/(app)/profile/accounts");
</script>

<script lang="ts">
  import { onMount } from "svelte";
  import ProfileConnectedAccounts from "$lib/components/profile/profile-connected-accounts.svelte";
  import { breadcrumbs } from "$lib/composables/breadcrumbs.svelte";

  onMount(() => {
    const accountsCrumb = breadcrumbs.addCrumb({
      href: ProfileAccountsRoute(),
      label: "Connected accounts",
      sort_order: 3,
    });

    return () => {
      breadcrumbs.removeCrumb(accountsCrumb);
    };
  });
</script>

<ProfileConnectedAccounts />
