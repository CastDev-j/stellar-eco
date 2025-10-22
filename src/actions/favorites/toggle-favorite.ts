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

export async function toggleFavorite(
  props: ToggleFavoriteProps
): Promise<Favorite> {
  const { type, userId, newStatus } = props;

  switch (type) {
    case "image_library":
      return upsertNasaImageVideoFavorite(userId, props.nasaId, newStatus);

    case "apod":
      return upsertApodFavorite(userId, props.date, newStatus);

    case "mars_rover":
      return upsertMarsRoverFavorite(
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

const upsertApodFavorite = async (
  userId: string,
  date: string,
  newStatus: number
): Promise<Favorite> => {
  const referenceData = JSON.stringify({ date });

  const [result] = await db
    .insert(favoritesTable)
    .values({
      userId,
      type: "apod",
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

const upsertMarsRoverFavorite = async (
  userId: string,
  roverData: {
    photoId: string;
    rover: "curiosity" | "opportunity" | "spirit" | "perseverance";
    sol: number;
    camera: string;
  },
  newStatus: number
): Promise<Favorite> => {
  const referenceData = JSON.stringify(roverData);

  const [result] = await db
    .insert(favoritesTable)
    .values({
      userId,
      type: "mars_rover",
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
