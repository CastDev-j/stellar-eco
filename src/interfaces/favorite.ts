import type { favoritesTable } from "@/db/schema";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

export type Favorite = InferSelectModel<typeof favoritesTable>;
export type NewFavorite = InferInsertModel<typeof favoritesTable>;

export interface ISSReference {
  timestamp: number;
  latitude: number;
  longitude: number;
  altitude: number;
}

export interface SolarSystemReference {
  bodyId: string;
  bodyName: string;
}

export interface EPICReference {
  eventDate: Date;
}

export interface ImageLibraryReference {
  nasaId: string;
}

export type ReferenceData =
  | ISSReference
  | SolarSystemReference
  | EPICReference
  | ImageLibraryReference;

export type ISSFavorite = Favorite & {
  type: "iss";
  referenceData: ISSReference;
};

export type SolarSystemFavorite = Favorite & {
  type: "solar_system";
  referenceData: SolarSystemReference;
};

export type EPICFavorite = Favorite & {
  type: "epic";
  referenceData: EPICReference;
};

export type ImageLibraryFavorite = Favorite & {
  type: "image_library";
  referenceData: ImageLibraryReference;
};

export type TypedFavorite =
  | ISSFavorite
  | SolarSystemFavorite
  | EPICFavorite
  | ImageLibraryFavorite;
