/**
 * It takes a URL as a string, and returns the hostname of that URL
 * @param {string} url - The URL to get the hostname from.
 * @returns The hostname of the url
 */
export function getHostfromURL(url: string) {
  const { hostname } = new URL(url);
  return hostname;
}
