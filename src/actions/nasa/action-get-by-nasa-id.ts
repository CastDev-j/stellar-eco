import { NASAImageAndVideoByID } from "@/modules/nasa-image-video/interfaces/nasa-image-and-video-by-id";

const NasaImageAndVideoAPIBaseURL = `https://images-api.nasa.gov/search`;

export async function actionGetByNasaId({
  queryKey,
}: {
  queryKey: [string, string];
}): Promise<NASAImageAndVideoByID> {
  const [, nasaId] = queryKey;

  const response = await fetch(
    `${NasaImageAndVideoAPIBaseURL}?nasa_id=${nasaId}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }

  return response.json();
}

export default actionGetByNasaId;
