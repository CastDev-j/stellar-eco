"use server";

import { db } from "@/lib/turso";
import { favoritesTable } from "@/db/schema";
import { eq, and } from "drizzle-orm";

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
  eventId: string;
}

type GetIsFavoriteProps =
  | GetNasaImageFavoriteProps
  | GetApodFavoriteProps
  | GetMarsRoverFavoriteProps
  | GetEpicFavoriteProps;

export async function getIsFavorite(
  props: GetIsFavoriteProps
): Promise<number> {
  const { type, userId } = props;

  switch (type) {
    case "image_library":
      return getNasaImageFavoriteStatus(userId, props.nasaId);

    case "apod":
      return getApodFavoriteStatus(userId, props.date);

    case "mars_rover":
      return getMarsRoverFavoriteStatus(userId, {
        photoId: props.photoId,
        rover: props.rover,
        sol: props.sol,
        camera: props.camera,
      });

    case "epic":
      return getEpicFavoriteStatus(userId, props.eventId);

    default:
      return 0;
  }
}

const getNasaImageFavoriteStatus = async (
  userId: string,
  nasaId: string
): Promise<number> => {
  const referenceData = JSON.stringify({ nasaId });

  const result = await db
    .select({ isFavorite: favoritesTable.isFavorite })
    .from(favoritesTable)
    .where(
      and(
        eq(favoritesTable.userId, userId),
        eq(favoritesTable.type, "image_library"),
        eq(favoritesTable.referenceData, referenceData)
      )
    )
    .limit(1);

  return result[0]?.isFavorite ?? 0;
};

const getApodFavoriteStatus = async (
  userId: string,
  date: string
): Promise<number> => {
  const referenceData = JSON.stringify({ date });

  const result = await db
    .select({ isFavorite: favoritesTable.isFavorite })
    .from(favoritesTable)
    .where(
      and(
        eq(favoritesTable.userId, userId),
        eq(favoritesTable.type, "apod"),
        eq(favoritesTable.referenceData, referenceData)
      )
    )
    .limit(1);

  return result[0]?.isFavorite ?? 0;
};

const getMarsRoverFavoriteStatus = async (
  userId: string,
  roverData: {
    photoId: string;
    rover: "curiosity" | "opportunity" | "spirit" | "perseverance";
    sol: number;
    camera: string;
  }
): Promise<number> => {
  const referenceData = JSON.stringify(roverData);

  const result = await db
    .select({ isFavorite: favoritesTable.isFavorite })
    .from(favoritesTable)
    .where(
      and(
        eq(favoritesTable.userId, userId),
        eq(favoritesTable.type, "mars_rover"),
        eq(favoritesTable.referenceData, referenceData)
      )
    )
    .limit(1);

  return result[0]?.isFavorite ?? 0;
};

const getEpicFavoriteStatus = async (
  userId: string,
  eventId: string
): Promise<number> => {
  const referenceData = JSON.stringify({ eventId });

  const result = await db
    .select({ isFavorite: favoritesTable.isFavorite })
    .from(favoritesTable)
    .where(
      and(
        eq(favoritesTable.userId, userId),
        eq(favoritesTable.type, "epic"),
        eq(favoritesTable.referenceData, referenceData)
      )
    )
    .limit(1);

  return result[0]?.isFavorite ?? 0;
};
