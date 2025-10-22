import type { Favorite } from "@/interfaces/favorite";

interface BaseToggleProps {
  userId: string;
  newStatus: number;
}

interface ToggleNasaImageProps extends BaseToggleProps {
  type: "image_library";
  nasaId: string;
}

interface ToggleApodProps extends BaseToggleProps {
  type: "apod";
  date: string;
}

interface ToggleMarsRoverProps extends BaseToggleProps {
  type: "mars_rover";
  photoId: string;
  rover: "curiosity" | "opportunity" | "spirit" | "perseverance";
  sol: number;
  camera: string;
}

interface ToggleEpicProps extends BaseToggleProps {
  type: "epic";
  date: string;
}

type ToggleFavoriteProps =
  | ToggleNasaImageProps
  | ToggleApodProps
  | ToggleMarsRoverProps
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

    case "apod":
      return upsertApodFavoriteInLocalStorage(userId, props.date, newStatus);

    case "mars_rover":
      return upsertMarsRoverFavoriteInLocalStorage(
        userId,
        {
          photoId: props.photoId,
          rover: props.rover,
          sol: props.sol,
          camera: props.camera,
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

const upsertApodFavoriteInLocalStorage = (
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
          fav.type === "apod" &&
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
          type: "apod",
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

const upsertMarsRoverFavoriteInLocalStorage = (
  userId: string,
  roverData: {
    photoId: string;
    rover: "curiosity" | "opportunity" | "spirit" | "perseverance";
    sol: number;
    camera: string;
  },
  newStatus: number
): Promise<Favorite> => {
  return new Promise((resolve, reject) => {
    try {
      const referenceData = JSON.stringify(roverData);
      const favoritesData = localStorage.getItem("favorites");
      const favorites: Favorite[] = favoritesData
        ? JSON.parse(favoritesData)
        : [];

      const existingIndex = favorites.findIndex(
        (fav) =>
          fav.userId === userId &&
          fav.type === "mars_rover" &&
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
          type: "mars_rover",
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
