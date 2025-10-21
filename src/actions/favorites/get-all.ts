"use server";

import { db } from "@/lib/turso";
import { favoritesTable } from "@/db/schema";
import type { Favorite } from "@/interfaces/favorite";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export async function getAllFavorites(): Promise<Favorite[]> {
  const { userId } = await auth();

  if (!userId) {
    return [];
  }

  const rows = await db
    .select()
    .from(favoritesTable)
    .where(eq(favoritesTable.userId, userId));
  return rows as Favorite[];
}
