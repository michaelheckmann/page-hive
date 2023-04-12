export type MetaData = {
  title: string;
  description: string;
  images: string[];
  duration: number;
  domain: string;
  url: string;
};

/**
 * It takes a URL as a parameter, fetches the data from the API, and returns the data as a MetaData
 * object
 * @param {string} url - The URL of the website you want to get the meta data from.
 * @returns MetaData
 */
export async function getWebsiteMeta(url: string) {
  const URL = `https://jsonlink.io/api/extract?url=${url}`;
  const response = await fetch(URL);
  const data = (await response.json()) as MetaData;
  return data;
}
