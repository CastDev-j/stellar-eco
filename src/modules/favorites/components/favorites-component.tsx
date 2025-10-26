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
    favorites.iss.length +
    favorites.solarSystem.length +
    favorites.epic.length +
    favorites.imageLibrary.length;

  return (
    <Container className="space-y-8" padding={false}>
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

      {favorites.iss.length > 0 && (
        <section className="space-y-3">
          <Subtitle variant="h4">ISS Tracker ({favorites.iss.length})</Subtitle>
          <List variant="indigo">
            {favorites.iss.map((item) => {
              const refData =
                typeof item.referenceData === "string"
                  ? JSON.parse(item.referenceData)
                  : item.referenceData;

              const date = new Date(refData.timestamp * 1000);
              const formattedDate = date.toLocaleString("es-MX", {
                dateStyle: "medium",
                timeStyle: "short",
              });

              return (
                <ListItem key={item.id}>
                  <span className="text-red-500">[Sin enlace disponible]</span>{" "}
                  - Fecha:{" "}
                  <Highlight variant="yellow">{formattedDate}</Highlight>, Lat:{" "}
                  {refData.latitude.toFixed(2)}°, Lon:{" "}
                  {refData.longitude.toFixed(2)}°, Alt:{" "}
                  {refData.altitude.toFixed(0)} km
                </ListItem>
              );
            })}
          </List>
        </section>
      )}

      {favorites.solarSystem.length > 0 && (
        <section className="space-y-3">
          <Subtitle variant="h4">
            Solar System Bodies ({favorites.solarSystem.length})
          </Subtitle>
          <List variant="indigo">
            {favorites.solarSystem.map((item) => {
              const refData =
                typeof item.referenceData === "string"
                  ? JSON.parse(item.referenceData)
                  : item.referenceData;

              return (
                <ListItem key={item.id}>
                  <span className="text-red-500">[Sin enlace disponible]</span>{" "}
                  - Cuerpo celeste:{" "}
                  <Highlight variant="yellow">{refData.bodyName}</Highlight>{" "}
                  (ID: {refData.bodyId})
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
    </Container>
  );
};

export default FavoritesComponent;
