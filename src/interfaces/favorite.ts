import type { favoritesTable } from "@/db/schema";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

export type Favorite = InferSelectModel<typeof favoritesTable>;
export type NewFavorite = InferInsertModel<typeof favoritesTable>;

export interface APODReference {
  date: string;
}

export interface MarsRoverReference {
  rover: "curiosity" | "opportunity" | "spirit" | "perseverance";
  sol: number;
  camera: string;
  photoId: string;
}

export interface EPICReference {
  eventDate: Date;
}

export interface ImageLibraryReference {
  nasaId: string;
}

export type ReferenceData =
  | APODReference
  | MarsRoverReference
  | EPICReference
  | ImageLibraryReference;

export type APODFavorite = Favorite & {
  type: "apod";
  referenceData: APODReference;
};

export type MarsRoverFavorite = Favorite & {
  type: "mars_rover";
  referenceData: MarsRoverReference;
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
  | APODFavorite
  | MarsRoverFavorite
  | EPICFavorite
  | ImageLibraryFavorite;
