"use client";

import { getAllCategoriesFavorites } from "@/actions/favorites/get-all-categories-favorites";
import { Paragraph } from "@/components/ui/paragraph";
import { Title } from "@/components/ui/title";
import { Subtitle } from "@/components/ui/subtitle";
import { List, ListItem } from "@/components/ui/list";
import { Container } from "@/components/ui/container";
import { Highlight } from "@/components/ui/highlight";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import Link from "next/link";
import QueryError from "@/components/ui/error";
import FavoritesNotFound from "./favorites-not-found";
import FavoritesLoading from "./favorites-loading";
import { useAuth } from "@clerk/nextjs";
import { getAllCategoriesFavoritesFromLocalStorage } from "@/actions/favorites-ls/get-all-categories-favorites";

const FavoritesComponent = () => {
  const { userId } = useAuth();

  const queryFunction = userId
    ? getAllCategoriesFavorites
    : getAllCategoriesFavoritesFromLocalStorage;

  const {
    data: favorites,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["favorites"],
    queryFn: queryFunction,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    refetch();
  }, []);

  if (isLoading) return <FavoritesLoading />;

  if (error)
    return <QueryError error={error} title="Error al cargar favoritos" />;

  if (!favorites) return <FavoritesNotFound />;

  const totalFavorites =
    favorites.apod.length +
    favorites.marsRover.length +
    favorites.epic.length +
    favorites.imageLibrary.length;

  return (
    <Container className="space-y-8">
      {totalFavorites != 0 && (
        <section className="space-y-2">
          <Title variant="h2" align="center">
            Mis Favoritos del Cosmos
          </Title>
          <Paragraph size="lg" align="center">
            Tienes un total de{" "}
            <Highlight variant="indigo">{totalFavorites}</Highlight> favoritos
            guardados
          </Paragraph>
        </section>
      )}

      {favorites.apod.length > 0 && (
        <section className="space-y-3">
          <Subtitle variant="h4">
            Astronomy Picture of the Day ({favorites.apod.length})
          </Subtitle>
          <List variant="indigo">
            {favorites.apod.map((item) => {
              const refData =
                typeof item.referenceData === "string"
                  ? JSON.parse(item.referenceData)
                  : item.referenceData;

              return (
                <ListItem key={item.id}>
                  <span className="text-red-500">[Sin enlace disponible]</span>{" "}
                  - Fecha:{" "}
                  <Highlight variant="yellow">{refData.date}</Highlight>
                </ListItem>
              );
            })}
          </List>
        </section>
      )}

      {favorites.marsRover.length > 0 && (
        <section className="space-y-3">
          <Subtitle variant="h4">
            Mars Rover Photos ({favorites.marsRover.length})
          </Subtitle>
          <List variant="indigo">
            {favorites.marsRover.map((item) => {
              const refData =
                typeof item.referenceData === "string"
                  ? JSON.parse(item.referenceData)
                  : item.referenceData;

              return (
                <ListItem key={item.id}>
                  <span className="text-red-500">[Sin enlace disponible]</span>{" "}
                  - Rover:{" "}
                  <Highlight variant="yellow">{refData.rover}</Highlight>, Sol:{" "}
                  {refData.sol}, Cámara: {refData.camera}
                </ListItem>
              );
            })}
          </List>
        </section>
      )}

      {favorites.epic.length > 0 && (
        <section className="space-y-3">
          <Subtitle variant="h4">
            Earth Polychromatic Imaging ({favorites.epic.length})
          </Subtitle>
          <List variant="indigo">
            {favorites.epic.map((item) => {
              const refData =
                typeof item.referenceData === "string"
                  ? JSON.parse(item.referenceData)
                  : item.referenceData;
              const epicUrl = `/epic?date=${refData.date}`;

              return (
                <ListItem key={item.id}>
                  <Link
                    href={epicUrl}
                    className="text-indigo-600 hover:text-indigo-800 hover:underline font-medium"
                  >
                    Ver imagen EPIC
                  </Link>{" "}
                  - Fecha: <Highlight variant="green">{refData.date}</Highlight>
                </ListItem>
              );
            })}
          </List>
        </section>
      )}

      {favorites.imageLibrary.length > 0 && (
        <section className="space-y-3">
          <Subtitle variant="h4">
            NASA Image Library ({favorites.imageLibrary.length})
          </Subtitle>
          <List variant="indigo">
            {favorites.imageLibrary.map((item) => {
              const refData =
                typeof item.referenceData === "string"
                  ? JSON.parse(item.referenceData)
                  : item.referenceData;
              const imageUrl = `/nasa/${refData.nasaId}`;

              return (
                <ListItem key={item.id}>
                  <Link
                    href={imageUrl}
                    className="text-indigo-600 hover:text-indigo-800 hover:underline font-medium"
                  >
                    Ver imagen
                  </Link>{" "}
                  - NASA ID:{" "}
                  <Highlight variant="yellow">{refData.nasaId}</Highlight>
                </ListItem>
              );
            })}
          </List>
        </section>
      )}

      {totalFavorites === 0 && <FavoritesNotFound />}

      <section className="pt-4 border-t border-stone-200">
        <Paragraph size="sm" align="center" className="text-stone-950/70">
          Esta funcionalidad solo está disponible para usuarios registrados en
          la plataforma
        </Paragraph>
      </section>
    </Container>
  );
};

export default FavoritesComponent;
