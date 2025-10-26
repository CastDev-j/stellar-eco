interface BaseGetFavoriteProps {
  userId: string;
}

interface GetNasaImageFavoriteProps extends BaseGetFavoriteProps {
  type: "image_library";
  nasaId: string;
}

interface GetISSFavoriteProps extends BaseGetFavoriteProps {
  type: "iss";
  timestamp: number;
  latitude: number;
  longitude: number;
  altitude: number;
}

interface GetSolarSystemFavoriteProps extends BaseGetFavoriteProps {
  type: "solar_system";
  bodyId: string;
  bodyName: string;
}

interface GetEpicFavoriteProps extends BaseGetFavoriteProps {
  type: "epic";
  date: string;
}

type GetIsFavoriteProps =
  | GetNasaImageFavoriteProps
  | GetISSFavoriteProps
  | GetSolarSystemFavoriteProps
  | GetEpicFavoriteProps;

export function getIsFavoriteFromLocalStorage(
  props: GetIsFavoriteProps
): Promise<number> {
  const { type, userId } = props;

  switch (type) {
    case "image_library":
      return getNasaImageFavoriteStatusFromLocalStorage(userId, props.nasaId);

    case "iss":
      return getISSFavoriteStatusFromLocalStorage(userId, {
        timestamp: props.timestamp,
        latitude: props.latitude,
        longitude: props.longitude,
        altitude: props.altitude,
      });

    case "solar_system":
      return getSolarSystemFavoriteStatusFromLocalStorage(userId, {
        bodyId: props.bodyId,
        bodyName: props.bodyName,
      });

    case "epic":
      return getEpicFavoriteStatusFromLocalStorage(userId, props.date);

    default:
      return Promise.resolve(0);
  }
}

const getNasaImageFavoriteStatusFromLocalStorage = (
  userId: string,
  nasaId: string
): Promise<number> => {
  return new Promise((resolve) => {
    try {
      const referenceData = JSON.stringify({ nasaId });
      const favoritesData = localStorage.getItem("favorites");

      if (!favoritesData) {
        resolve(0);
        return;
      }

      const favorites = JSON.parse(favoritesData);
      const result = Array.isArray(favorites)
        ? favorites.find(
            (fav: any) =>
              fav.userId === userId &&
              fav.type === "image_library" &&
              JSON.stringify(
                typeof fav.referenceData === "string"
                  ? JSON.parse(fav.referenceData)
                  : fav.referenceData
              ) === referenceData
          )
        : null;

      resolve(result?.isFavorite ?? 0);
    } catch (error) {
      console.error("Error getting NASA image favorite status:", error);
      resolve(0);
    }
  });
};

const getISSFavoriteStatusFromLocalStorage = (
  userId: string,
  issData: {
    timestamp: number;
    latitude: number;
    longitude: number;
    altitude: number;
  }
): Promise<number> => {
  return new Promise((resolve) => {
    try {
      const referenceData = JSON.stringify(issData);
      const favoritesData = localStorage.getItem("favorites");

      if (!favoritesData) {
        resolve(0);
        return;
      }

      const favorites = JSON.parse(favoritesData);
      const result = Array.isArray(favorites)
        ? favorites.find(
            (fav: any) =>
              fav.userId === userId &&
              fav.type === "iss" &&
              JSON.stringify(
                typeof fav.referenceData === "string"
                  ? JSON.parse(fav.referenceData)
                  : fav.referenceData
              ) === referenceData
          )
        : null;

      resolve(result?.isFavorite ?? 0);
    } catch (error) {
      console.error("Error getting ISS favorite status:", error);
      resolve(0);
    }
  });
};

const getSolarSystemFavoriteStatusFromLocalStorage = (
  userId: string,
  solarSystemData: {
    bodyId: string;
    bodyName: string;
  }
): Promise<number> => {
  return new Promise((resolve) => {
    try {
      const referenceData = JSON.stringify(solarSystemData);
      const favoritesData = localStorage.getItem("favorites");

      if (!favoritesData) {
        resolve(0);
        return;
      }

      const favorites = JSON.parse(favoritesData);
      const result = Array.isArray(favorites)
        ? favorites.find(
            (fav: any) =>
              fav.userId === userId &&
              fav.type === "solar_system" &&
              JSON.stringify(
                typeof fav.referenceData === "string"
                  ? JSON.parse(fav.referenceData)
                  : fav.referenceData
              ) === referenceData
          )
        : null;

      resolve(result?.isFavorite ?? 0);
    } catch (error) {
      console.error("Error getting Solar System favorite status:", error);
      resolve(0);
    }
  });
};

const getEpicFavoriteStatusFromLocalStorage = (
  userId: string,
  date: string
): Promise<number> => {
  return new Promise((resolve) => {
    try {
      const referenceData = JSON.stringify({ date });
      const favoritesData = localStorage.getItem("favorites");

      if (!favoritesData) {
        resolve(0);
        return;
      }

      const favorites = JSON.parse(favoritesData);
      const result = Array.isArray(favorites)
        ? favorites.find(
            (fav: any) =>
              fav.userId === userId &&
              fav.type === "epic" &&
              JSON.stringify(
                typeof fav.referenceData === "string"
                  ? JSON.parse(fav.referenceData)
                  : fav.referenceData
              ) === referenceData
          )
        : null;

      resolve(result?.isFavorite ?? 0);
    } catch (error) {
      console.error("Error getting EPIC favorite status:", error);
      resolve(0);
    }
  });
};
