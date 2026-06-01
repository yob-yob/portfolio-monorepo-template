<script lang="ts">
  import { resolve } from "$app/paths";
  import illustration404 from "$lib/assets/illustrations/404.svg";
  import { Button } from "$lib/components/ui/button/index.js";

  let { error } = $props();

  const ERRORS = {
    ORGANIZATION_NOT_FOUND: {
      heading: "Organization Not Found",
      status: "404",
      description:
        "The page you are looking for does not exist or may have been moved.",
    },
    NOT_FOUND: {
      heading: "Entity Not Found",
      status: "404",
      description:
        "The page you are looking for does not exist or may have been moved.",
    },
  };

  type ErrorCode = keyof typeof ERRORS;

  const ERROR_CODE = $derived(error.code as ErrorCode);

  const heading = $derived(
    ERRORS[ERROR_CODE].heading ?? "Something Went Wrong"
  );

  const status = $derived(ERRORS[ERROR_CODE].status ?? "Something Went Wrong");

  const description = $derived(
    ERRORS[ERROR_CODE].description ??
      "An unexpected error occurred. Please try again."
  );
</script>

<main
  class="bg-background text-foreground flex min-h-svh items-center justify-center p-4"
>
  <div
    class="mx-auto flex w-full max-w-lg flex-col items-center gap-6 text-center"
  >
    <img
      src={illustration404}
      alt="Illustration of floating documents and pages, representing content that could not be found"
      class="mx-auto w-full max-w-sm"
      width="960"
      height="701"
      decoding="async"
    >
    <div class="space-y-2">
      <p class="text-muted-foreground text-sm font-medium"> {status} </p>
      <h1 class="text-2xl font-bold tracking-tight">{heading}</h1>
      <p class="text-muted-foreground text-balance text-sm">{description}</p>

      {#if error.message}
        <hr>
        <p class="text-muted-foreground text-balance text-sm">
          Error Message: {error.message}
        </p>
      {/if}
    </div>

    <div class="flex flex-col gap-3 sm:flex-row">
      <Button href={resolve("/")}>Back to dashboard</Button>
      <Button variant="outline" onclick={() => history.back()}>Go back</Button>
    </div>
  </div>
</main>
