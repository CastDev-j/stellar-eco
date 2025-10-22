import { EPICImage } from "@/modules/epic/interfaces/epic-image";

const NASA_API_KEY = process.env.NEXT_PUBLIC_NASA_API_KEY;
const EPIC_API_URL = "https://epic.gsfc.nasa.gov/api/enhanced/date";

export const fetchEPICImages = async (date: string) => {
  try {
    const apiUrl = `${EPIC_API_URL}/${date}?api_key=${NASA_API_KEY}`;

    console.log(apiUrl);

    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data: EPICImage[] = await response.json();

    return {
      collection: {
        items: Array.isArray(data) ? data : [],
        metadata: {
          total_hits: Array.isArray(data) ? data.length : 0,
        },
      },
    };
  } catch (error) {
    console.error("Error al obtener imágenes EPIC:", error);
    throw error;
  }
};
