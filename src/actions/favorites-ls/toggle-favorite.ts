import type { Favorite } from "@/interfaces/favorite";

interface BaseToggleProps {
  userId: string;
  newStatus: number;
}

interface ToggleNasaImageProps extends BaseToggleProps {
  type: "image_library";
  nasaId: string;
}

interface ToggleISSProps extends BaseToggleProps {
  type: "iss";
  timestamp: number;
  latitude: number;
  longitude: number;
  altitude: number;
}

interface ToggleSolarSystemProps extends BaseToggleProps {
  type: "solar_system";
  bodyId: string;
  bodyName: string;
}

interface ToggleEpicProps extends BaseToggleProps {
  type: "epic";
  date: string;
}

type ToggleFavoriteProps =
  | ToggleNasaImageProps
  | ToggleISSProps
  | ToggleSolarSystemProps
  | ToggleEpicProps;

export function toggleFavoriteInLocalStorage(
  props: ToggleFavoriteProps
): Promise<Favorite> {
  const { type, userId, newStatus } = props;

  switch (type) {
    case "image_library":
      return upsertNasaImageVideoFavoriteInLocalStorage(
        userId,
        props.nasaId,
        newStatus
      );

    case "iss":
      return upsertISSFavoriteInLocalStorage(
        userId,
        {
          timestamp: props.timestamp,
          latitude: props.latitude,
          longitude: props.longitude,
          altitude: props.altitude,
        },
        newStatus
      );

    case "solar_system":
      return upsertSolarSystemFavoriteInLocalStorage(
        userId,
        {
          bodyId: props.bodyId,
          bodyName: props.bodyName,
        },
        newStatus
      );

    case "epic":
      return upsertEpicFavoriteInLocalStorage(userId, props.date, newStatus);

    default:
      return Promise.reject(new Error("Tipo de referencia no válido"));
  }
}

const upsertNasaImageVideoFavoriteInLocalStorage = (
  userId: string,
  nasaId: string,
  newStatus: number
): Promise<Favorite> => {
  return new Promise((resolve, reject) => {
    try {
      const referenceData = JSON.stringify({ nasaId });
      const favoritesData = localStorage.getItem("favorites");
      const favorites: Favorite[] = favoritesData
        ? JSON.parse(favoritesData)
        : [];

      const existingIndex = favorites.findIndex(
        (fav) =>
          fav.userId === userId &&
          fav.type === "image_library" &&
          JSON.stringify(
            typeof fav.referenceData === "string"
              ? JSON.parse(fav.referenceData)
              : fav.referenceData
          ) === referenceData
      );

      let result: Favorite;

      if (existingIndex !== -1) {
        favorites[existingIndex].isFavorite = newStatus;
        result = favorites[existingIndex];
      } else {
        result = {
          id: Date.now().toString().toString(),
          userId,
          type: "image_library",
          referenceData,
          createdAt: new Date(),
          isFavorite: newStatus,
        };
        favorites.push(result);
      }

      localStorage.setItem("favorites", JSON.stringify(favorites));
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
};

const upsertISSFavoriteInLocalStorage = (
  userId: string,
  issData: {
    timestamp: number;
    latitude: number;
    longitude: number;
    altitude: number;
  },
  newStatus: number
): Promise<Favorite> => {
  return new Promise((resolve, reject) => {
    try {
      const referenceData = JSON.stringify(issData);
      const favoritesData = localStorage.getItem("favorites");
      const favorites: Favorite[] = favoritesData
        ? JSON.parse(favoritesData)
        : [];

      const existingIndex = favorites.findIndex(
        (fav) =>
          fav.userId === userId &&
          fav.type === "iss" &&
          JSON.stringify(
            typeof fav.referenceData === "string"
              ? JSON.parse(fav.referenceData)
              : fav.referenceData
          ) === referenceData
      );

      let result: Favorite;

      if (existingIndex !== -1) {
        favorites[existingIndex].isFavorite = newStatus;
        result = favorites[existingIndex];
      } else {
        result = {
          id: Date.now().toString(),
          userId,
          type: "iss",
          referenceData,
          createdAt: new Date(),
          isFavorite: newStatus,
        };
        favorites.push(result);
      }

      localStorage.setItem("favorites", JSON.stringify(favorites));
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
};

const upsertSolarSystemFavoriteInLocalStorage = (
  userId: string,
  solarSystemData: {
    bodyId: string;
    bodyName: string;
  },
  newStatus: number
): Promise<Favorite> => {
  return new Promise((resolve, reject) => {
    try {
      const referenceData = JSON.stringify(solarSystemData);
      const favoritesData = localStorage.getItem("favorites");
      const favorites: Favorite[] = favoritesData
        ? JSON.parse(favoritesData)
        : [];

      const existingIndex = favorites.findIndex(
        (fav) =>
          fav.userId === userId &&
          fav.type === "solar_system" &&
          JSON.stringify(
            typeof fav.referenceData === "string"
              ? JSON.parse(fav.referenceData)
              : fav.referenceData
          ) === referenceData
      );

      let result: Favorite;

      if (existingIndex !== -1) {
        favorites[existingIndex].isFavorite = newStatus;
        result = favorites[existingIndex];
      } else {
        result = {
          id: Date.now().toString(),
          userId,
          type: "solar_system",
          referenceData,
          createdAt: new Date(),
          isFavorite: newStatus,
        };
        favorites.push(result);
      }

      localStorage.setItem("favorites", JSON.stringify(favorites));
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
};

const upsertEpicFavoriteInLocalStorage = (
  userId: string,
  date: string,
  newStatus: number
): Promise<Favorite> => {
  return new Promise((resolve, reject) => {
    try {
      const referenceData = JSON.stringify({ date });
      const favoritesData = localStorage.getItem("favorites");
      const favorites: Favorite[] = favoritesData
        ? JSON.parse(favoritesData)
        : [];

      const existingIndex = favorites.findIndex(
        (fav) =>
          fav.userId === userId &&
          fav.type === "epic" &&
          JSON.stringify(
            typeof fav.referenceData === "string"
              ? JSON.parse(fav.referenceData)
              : fav.referenceData
          ) === referenceData
      );

      let result: Favorite;

      if (existingIndex !== -1) {
        favorites[existingIndex].isFavorite = newStatus;
        result = favorites[existingIndex];
      } else {
        result = {
          id: Date.now().toString(),
          userId,
          type: "epic",
          referenceData,
          createdAt: new Date(),
          isFavorite: newStatus,
        };
        favorites.push(result);
      }

      localStorage.setItem("favorites", JSON.stringify(favorites));
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
};
