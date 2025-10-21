"use server";

import { db } from "@/lib/turso";
import { favoritesTable } from "@/db/schema";
import type { Favorite } from "@/interfaces/favorite";

export async function getAllFavorites(): Promise<Favorite[]> {
  const rows = await db.select().from(favoritesTable);
  return rows as Favorite[];
}