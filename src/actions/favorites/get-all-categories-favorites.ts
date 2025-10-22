"use server";

import { db } from "@/lib/turso";
import { favoritesTable } from "@/db/schema";
import type {
  APODFavorite,
  MarsRoverFavorite,
  EPICFavorite,
  ImageLibraryFavorite,
  APODReference,
  MarsRoverReference,
  EPICReference,
  ImageLibraryReference,
} from "@/interfaces/favorite";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";

export interface CategorizedFavorites {
  apod: APODFavorite[];
  marsRover: MarsRoverFavorite[];
  epic: EPICFavorite[];
  imageLibrary: ImageLibraryFavorite[];
}

export async function getAllCategoriesFavorites(): Promise<CategorizedFavorites> {
  const { userId } = await auth();

  if (!userId) {
    return {
      apod: [],
      marsRover: [],
      epic: [],
      imageLibrary: [],
    };
  }

  const rows = await db
    .select()
    .from(favoritesTable)
    .where(
      and(eq(favoritesTable.userId, userId), eq(favoritesTable.isFavorite, 1))
    );

  const categorized: CategorizedFavorites = {
    apod: [],
    marsRover: [],
    epic: [],
    imageLibrary: [],
  };

  rows.forEach((row) => {
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

  return categorized;
}
