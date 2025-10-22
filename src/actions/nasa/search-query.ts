import { itemsPerPageOptions } from "@/config";
import { NASAImageAndVideo } from "@/modules/nasa-image-video/interfaces/nasa-image-and-video";

const NasaImageAndVideoAPIBaseURL = `https://images-api.nasa.gov/search?page_size=${itemsPerPageOptions.nasa}`;

export async function searchQuery({
  queryKey,
}: {
  queryKey: [string, string, number];
}): Promise<NASAImageAndVideo> {
  const [, query, page] = queryKey;

  const response = await fetch(
    `${NasaImageAndVideoAPIBaseURL}&q=${query}&page=${page}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }

  return response.json();
}
