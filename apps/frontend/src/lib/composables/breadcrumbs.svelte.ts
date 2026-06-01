import { SvelteSet } from "svelte/reactivity";

export interface Crumb {
  href: string;
  label: string;
  sort_order: number;
}

class Breadcrumbs {
  //
  breadcrumbs = new SvelteSet<Crumb>();

  addCrumb(crumb: Crumb) {
    this.breadcrumbs.add(crumb);
    return crumb;
  }

  removeCrumb(crumb: Crumb | null) {
    if (!crumb) {
      return;
    }
    this.breadcrumbs.delete(crumb);
  }

  clearBreadcrumbs() {
    this.breadcrumbs.clear();
  }

  sortedBreadcrumbs() {
    return [...this.breadcrumbs].sort((a, b) => a.sort_order - b.sort_order);
  }
}

export const breadcrumbs = new Breadcrumbs();
