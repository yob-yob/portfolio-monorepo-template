<script lang="ts">
  import { onMount } from "svelte";
  import { authClient } from "@/auth/client";
  import { goto } from "$app/navigation";
  import { resolve } from "$app/paths";

  const { data } = $props();

  onMount(async () => {
    // Redirect to Active Organization Dashboard
    if (data.session.activeOrganizationId) {
      const { data: organization } =
        await authClient.organization.getFullOrganization({
          query: {
            organizationId: data.session.activeOrganizationId,
          },
        });

      if (organization) {
        goto(resolve(`/${organization?.slug}`));
      }
    }
  });
</script>

<h1> Redirecting to your organization... </h1>
