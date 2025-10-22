interface BaseGetFavoriteProps {
  userId: string;
}

interface GetNasaImageFavoriteProps extends BaseGetFavoriteProps {
  type: "image_library";
  nasaId: string;
}

interface GetApodFavoriteProps extends BaseGetFavoriteProps {
  type: "apod";
  date: string;
}

interface GetMarsRoverFavoriteProps extends BaseGetFavoriteProps {
  type: "mars_rover";
  photoId: string;
  rover: "curiosity" | "opportunity" | "spirit" | "perseverance";
  sol: number;
  camera: string;
}

interface GetEpicFavoriteProps extends BaseGetFavoriteProps {
  type: "epic";
  date: string;
}

type GetIsFavoriteProps =
  | GetNasaImageFavoriteProps
  | GetApodFavoriteProps
  | GetMarsRoverFavoriteProps
  | GetEpicFavoriteProps;

export function getIsFavoriteFromLocalStorage(
  props: GetIsFavoriteProps
): Promise<number> {
  const { type, userId } = props;

  switch (type) {
    case "image_library":
      return getNasaImageFavoriteStatusFromLocalStorage(userId, props.nasaId);

    case "apod":
      return getApodFavoriteStatusFromLocalStorage(userId, props.date);

    case "mars_rover":
      return getMarsRoverFavoriteStatusFromLocalStorage(userId, {
        photoId: props.photoId,
        rover: props.rover,
        sol: props.sol,
        camera: props.camera,
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

const getApodFavoriteStatusFromLocalStorage = (
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
              fav.type === "apod" &&
              JSON.stringify(
                typeof fav.referenceData === "string"
                  ? JSON.parse(fav.referenceData)
                  : fav.referenceData
              ) === referenceData
          )
        : null;

      resolve(result?.isFavorite ?? 0);
    } catch (error) {
      console.error("Error getting APOD favorite status:", error);
      resolve(0);
    }
  });
};

const getMarsRoverFavoriteStatusFromLocalStorage = (
  userId: string,
  roverData: {
    photoId: string;
    rover: "curiosity" | "opportunity" | "spirit" | "perseverance";
    sol: number;
    camera: string;
  }
): Promise<number> => {
  return new Promise((resolve) => {
    try {
      const referenceData = JSON.stringify(roverData);
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
              fav.type === "mars_rover" &&
              JSON.stringify(
                typeof fav.referenceData === "string"
                  ? JSON.parse(fav.referenceData)
                  : fav.referenceData
              ) === referenceData
          )
        : null;

      resolve(result?.isFavorite ?? 0);
    } catch (error) {
      console.error("Error getting Mars Rover favorite status:", error);
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
