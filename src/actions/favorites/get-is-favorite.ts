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

export async function getIsFavorite(
  props: GetIsFavoriteProps
): Promise<number> {
  const { type, userId } = props;

  switch (type) {
    case "image_library":
      return getNasaImageFavoriteStatus(userId, props.nasaId);

    case "iss":
      return getISSFavoriteStatus(userId, {
        timestamp: props.timestamp,
        latitude: props.latitude,
        longitude: props.longitude,
        altitude: props.altitude,
      });

    case "solar_system":
      return getSolarSystemFavoriteStatus(userId, {
        bodyId: props.bodyId,
        bodyName: props.bodyName,
      });

    case "epic":
      return getEpicFavoriteStatus(userId, props.date);

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

const getISSFavoriteStatus = async (
  userId: string,
  issData: {
    timestamp: number;
    latitude: number;
    longitude: number;
    altitude: number;
  }
): Promise<number> => {
  const referenceData = JSON.stringify(issData);

  const result = await db
    .select({ isFavorite: favoritesTable.isFavorite })
    .from(favoritesTable)
    .where(
      and(
        eq(favoritesTable.userId, userId),
        eq(favoritesTable.type, "iss"),
        eq(favoritesTable.referenceData, referenceData)
      )
    )
    .limit(1);

  return result[0]?.isFavorite ?? 0;
};

const getSolarSystemFavoriteStatus = async (
  userId: string,
  solarSystemData: {
    bodyId: string;
    bodyName: string;
  }
): Promise<number> => {
  const referenceData = JSON.stringify(solarSystemData);

  const result = await db
    .select({ isFavorite: favoritesTable.isFavorite })
    .from(favoritesTable)
    .where(
      and(
        eq(favoritesTable.userId, userId),
        eq(favoritesTable.type, "solar_system"),
        eq(favoritesTable.referenceData, referenceData)
      )
    )
    .limit(1);

  return result[0]?.isFavorite ?? 0;
};

const getEpicFavoriteStatus = async (
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
        eq(favoritesTable.type, "epic"),
        eq(favoritesTable.referenceData, referenceData)
      )
    )
    .limit(1);

  return result[0]?.isFavorite ?? 0;
};
