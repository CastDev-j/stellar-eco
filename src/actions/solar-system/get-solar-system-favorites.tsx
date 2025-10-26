"use server";

import { db } from "@/lib/turso";
import { favoritesTable } from "@/db/schema";
import type {
  SolarSystemFavorite,
  SolarSystemReference,
} from "@/interfaces/favorite";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";

export async function getSolarSystemFavorites(): Promise<
  SolarSystemFavorite[]
> {
  const { userId } = await auth();

  if (!userId) {
    return [];
  }

  const rows = await db
    .select()
    .from(favoritesTable)
    .where(
      and(
        eq(favoritesTable.userId, userId),
        eq(favoritesTable.isFavorite, 1),
        eq(favoritesTable.type, "solar_system")
      )
    );

  return rows.map((row) => ({
    ...row,
    referenceData:
      typeof row.referenceData === "string"
        ? JSON.parse(row.referenceData)
        : row.referenceData,
  })) as SolarSystemFavorite[];
}
