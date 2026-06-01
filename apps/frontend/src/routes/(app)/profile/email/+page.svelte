<script lang="ts">
  import { onMount } from "svelte";
  import ProfileChangeEmail from "$lib/components/profile/profile-change-email.svelte";
  import { breadcrumbs } from "$lib/composables/breadcrumbs.svelte";

  const { data } = $props();

  onMount(() => {
    const profileCrumb = breadcrumbs.addCrumb({
      href: "/profile",
      label: "Profile",
      sort_order: 2,
    });
    const emailCrumb = breadcrumbs.addCrumb({
      href: "/profile/email",
      label: "Email address",
      sort_order: 3,
    });

    return () => {
      breadcrumbs.removeCrumb(emailCrumb);
      breadcrumbs.removeCrumb(profileCrumb);
    };
  });
</script>

<ProfileChangeEmail
  currentEmail={data.user.email}
  emailVerified={data.user.emailVerified}
/>
