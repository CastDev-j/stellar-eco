import {
  text,
  sqliteTable,
  integer,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const favoritesTable = sqliteTable(
  "favorites",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id").notNull(),
    type: text("type", {
      enum: ["apod", "mars_rover", "image_library", "epic"],
    }).notNull(),
    referenceData: text("reference_data", { mode: "json" }).notNull(),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
    isFavorite: integer("is_favorite"),
  },
  (table) => ({
    uniqueFavoriteIdx: uniqueIndex("unique_favorite_idx").on(
      table.userId,
      table.type,
      table.referenceData
    ),
  })
);
