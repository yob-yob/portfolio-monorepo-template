import { SvelteSet } from "svelte/reactivity";

interface Crumb {
  href: string;
  label: string;
}

class Breadcrumbs {
  //
  breadcrumbs = new SvelteSet<Crumb>();

  addCrumb(crumb: Crumb) {
    this.breadcrumbs.add(crumb);
    return crumb;
  }

  removeCrumb(crumb: Crumb) {
    this.breadcrumbs.delete(crumb);
  }

  clearBreadcrumbs() {
    this.breadcrumbs.clear();
  }
}

export const breadcrumbs = new Breadcrumbs();
