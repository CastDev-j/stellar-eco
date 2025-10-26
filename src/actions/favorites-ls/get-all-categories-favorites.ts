import {
  ISSFavorite,
  ISSReference,
  SolarSystemFavorite,
  SolarSystemReference,
  EPICFavorite,
  EPICReference,
  ImageLibraryFavorite,
  ImageLibraryReference,
} from "@/interfaces/favorite";
import { CategorizedFavorites } from "../favorites/get-all-categories-favorites";

export const getAllCategoriesFavoritesFromLocalStorage =
  (): Promise<CategorizedFavorites> => {
    return new Promise((resolve) => {
      const categorized: CategorizedFavorites = {
        iss: [],
        solarSystem: [],
        epic: [],
        imageLibrary: [],
      };

      try {
        const favoritesData = localStorage.getItem("favorites");

        if (!favoritesData) {
          resolve(categorized);
          return;
        }

        const rows = JSON.parse(favoritesData);

        const filteredRows = Array.isArray(rows)
          ? rows.filter((row: any) => row.isFavorite === 1)
          : [];

        filteredRows.forEach((row: any) => {
          const parsedReferenceData =
            typeof row.referenceData === "string"
              ? JSON.parse(row.referenceData)
              : row.referenceData;

          switch (row.type) {
            case "iss":
              categorized.iss.push({
                ...row,
                referenceData: parsedReferenceData as ISSReference,
              } as ISSFavorite);
              break;
            case "solar_system":
              categorized.solarSystem.push({
                ...row,
                referenceData: parsedReferenceData as SolarSystemReference,
              } as SolarSystemFavorite);
              break;
            case "epic":
              categorized.epic.push({
                ...row,
                referenceData: parsedReferenceData as EPICReference,
              } as EPICFavorite);
              break;
            case "image_library":
              categorized.imageLibrary.push({
                ...row,
                referenceData: parsedReferenceData as ImageLibraryReference,
              } as ImageLibraryFavorite);
              break;
          }
        });

        resolve(categorized);
      } catch (error) {
        console.error("Error fetching from localStorage:", error);
        resolve(categorized);
      }
    });
  };
