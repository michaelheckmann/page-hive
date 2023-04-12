/**
 * It takes a string, converts it to lowercase, replaces all non-alphanumeric characters with a dash,
 * and removes any leading or trailing dashes
 * @param {string | undefined} name - The name of the slug.
 * @returns A function that takes a name and returns a slug
 */
export function createSlug(name: string | undefined) {
  if (!name) {
    return "";
  }
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}
