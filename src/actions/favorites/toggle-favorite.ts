"use server";

import { db } from "@/lib/turso";
import { favoritesTable } from "@/db/schema";
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

export async function toggleFavorite(
  props: ToggleFavoriteProps
): Promise<Favorite> {
  const { type, userId, newStatus } = props;

  switch (type) {
    case "image_library":
      return upsertNasaImageVideoFavorite(userId, props.nasaId, newStatus);

    case "iss":
      return upsertISSFavorite(
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
      return upsertSolarSystemFavorite(
        userId,
        {
          bodyId: props.bodyId,
          bodyName: props.bodyName,
        },
        newStatus
      );

    case "epic":
      return upsertEpicFavorite(userId, props.date, newStatus);

    default:
      throw new Error("Tipo de referencia no válido");
  }
}

const upsertNasaImageVideoFavorite = async (
  userId: string,
  nasaId: string,
  newStatus: number
): Promise<Favorite> => {
  const referenceData = JSON.stringify({ nasaId });

  const [result] = await db
    .insert(favoritesTable)
    .values({
      userId,
      type: "image_library",
      referenceData,
      isFavorite: newStatus,
    })
    .onConflictDoUpdate({
      target: [
        favoritesTable.userId,
        favoritesTable.type,
        favoritesTable.referenceData,
      ],
      set: { isFavorite: newStatus },
    })
    .returning();

  return result;
};

const upsertISSFavorite = async (
  userId: string,
  issData: {
    timestamp: number;
    latitude: number;
    longitude: number;
    altitude: number;
  },
  newStatus: number
): Promise<Favorite> => {
  const referenceData = JSON.stringify(issData);

  const [result] = await db
    .insert(favoritesTable)
    .values({
      userId,
      type: "iss",
      referenceData,
      isFavorite: newStatus,
    })
    .onConflictDoUpdate({
      target: [
        favoritesTable.userId,
        favoritesTable.type,
        favoritesTable.referenceData,
      ],
      set: { isFavorite: newStatus },
    })
    .returning();

  return result;
};

const upsertSolarSystemFavorite = async (
  userId: string,
  solarSystemData: {
    bodyId: string;
    bodyName: string;
  },
  newStatus: number
): Promise<Favorite> => {
  const referenceData = JSON.stringify(solarSystemData);

  const [result] = await db
    .insert(favoritesTable)
    .values({
      userId,
      type: "solar_system",
      referenceData,
      isFavorite: newStatus,
    })
    .onConflictDoUpdate({
      target: [
        favoritesTable.userId,
        favoritesTable.type,
        favoritesTable.referenceData,
      ],
      set: { isFavorite: newStatus },
    })
    .returning();

  return result;
};

const upsertEpicFavorite = async (
  userId: string,
  date: string,
  newStatus: number
): Promise<Favorite> => {
  const referenceData = JSON.stringify({ date });

  const [result] = await db
    .insert(favoritesTable)
    .values({
      userId,
      type: "epic",
      referenceData,
      isFavorite: newStatus,
    })
    .onConflictDoUpdate({
      target: [
        favoritesTable.userId,
        favoritesTable.type,
        favoritesTable.referenceData,
      ],
      set: { isFavorite: newStatus },
    })
    .returning();

  return result;
};
