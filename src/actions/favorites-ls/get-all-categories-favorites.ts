import {
  APODFavorite,
  APODReference,
  EPICFavorite,
  EPICReference,
  ImageLibraryFavorite,
  ImageLibraryReference,
  MarsRoverFavorite,
  MarsRoverReference,
} from "@/interfaces/favorite";
import { CategorizedFavorites } from "../favorites/get-all-categories-favorites";

export const getAllCategoriesFavoritesFromLocalStorage =
  (): Promise<CategorizedFavorites> => {
    return new Promise((resolve) => {
      const categorized: CategorizedFavorites = {
        apod: [],
        marsRover: [],
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
            case "apod":
              categorized.apod.push({
                ...row,
                referenceData: parsedReferenceData as APODReference,
              } as APODFavorite);
              break;
            case "mars_rover":
              categorized.marsRover.push({
                ...row,
                referenceData: parsedReferenceData as MarsRoverReference,
              } as MarsRoverFavorite);
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
