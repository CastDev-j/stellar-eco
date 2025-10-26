import type { SolarSystemFavorite } from "@/interfaces/favorite";

export const getSolarSystemFavoritesFromLocalStorage = (): Promise<
  SolarSystemFavorite[]
> => {
  return new Promise((resolve) => {
    try {
      const favoritesData = localStorage.getItem("favorites");

      if (!favoritesData) {
        resolve([]);
        return;
      }

      const allFavorites = JSON.parse(favoritesData);

      if (!Array.isArray(allFavorites)) {
        resolve([]);
        return;
      }

      const solarSystemFavorites = allFavorites
        .filter(
          (row: any) =>
            row.userId === "guest" &&
            row.type === "solar_system" &&
            row.isFavorite === 1
        )
        .map((row: any) => ({
          ...row,
          referenceData:
            typeof row.referenceData === "string"
              ? JSON.parse(row.referenceData)
              : row.referenceData,
        })) as SolarSystemFavorite[];

      resolve(solarSystemFavorites);
    } catch (error) {
      console.error(
        "Error loading solar system favorites from localStorage:",
        error
      );
      resolve([]);
    }
  });
};
