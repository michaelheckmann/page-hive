/**
 * If the string starts with http:// or https://, then it contains a dot, and then it ends with a
 * slash, then it's a valid URL
 * @param {string} str - The string to be tested.
 * @returns A boolean value.
 */
export function isValidURL(str: string): boolean {
  const pattern = new RegExp(
    "^(https?:\\/\\/)" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}\\.[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  );

  return !!pattern.test(str);
}
