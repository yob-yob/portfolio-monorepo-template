export function slugify(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/---/g, "-"); // handle cases where the result has 3 dashes (-) example "Wilkinson - Dare" becomes "Wilkinson---Dare"
}
