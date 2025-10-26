"use server";

import { db } from "@/lib/turso";
import { favoritesTable } from "@/db/schema";
import type {
  ISSFavorite,
  SolarSystemFavorite,
  EPICFavorite,
  ImageLibraryFavorite,
  ISSReference,
  SolarSystemReference,
  EPICReference,
  ImageLibraryReference,
} from "@/interfaces/favorite";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";

export interface CategorizedFavorites {
  iss: ISSFavorite[];
  solarSystem: SolarSystemFavorite[];
  epic: EPICFavorite[];
  imageLibrary: ImageLibraryFavorite[];
}

export async function getAllCategoriesFavorites(): Promise<CategorizedFavorites> {
  const { userId } = await auth();

  if (!userId) {
    return {
      iss: [],
      solarSystem: [],
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
    iss: [],
    solarSystem: [],
    epic: [],
    imageLibrary: [],
  };

  rows.forEach((row) => {
    const parsedReferenceData =
      typeof row.referenceData === "string"
        ? JSON.parse(row.referenceData)
        : row.referenceData;

    switch (row.type) {
      case "iss":
        categorized.iss.push({
          ...row,
          referenceData: parsedReferenceData as ISSReference,
        } as ISSFavorite);
        break;
      case "solar_system":
        categorized.solarSystem.push({
          ...row,
          referenceData: parsedReferenceData as SolarSystemReference,
        } as SolarSystemFavorite);
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
