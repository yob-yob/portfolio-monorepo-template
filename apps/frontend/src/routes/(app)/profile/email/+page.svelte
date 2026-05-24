<script lang="ts">
  import { onMount } from "svelte";
  import ProfileChangeEmail from "$lib/components/profile/profile-change-email.svelte";
  import { breadcrumbs } from "$lib/composables/breadcrumbs.svelte";

  const { data } = $props();

  onMount(() => {
    const profileCrumb = breadcrumbs.addCrumb({
      href: "/profile",
      label: "Profile",
    });
    const emailCrumb = breadcrumbs.addCrumb({
      href: "/profile/email",
      label: "Email address",
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
