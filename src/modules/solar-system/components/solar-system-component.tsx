"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Container } from "@/components/ui/container";
import { Paragraph } from "@/components/ui/paragraph";
import { Subtitle } from "@/components/ui/subtitle";
import { Highlight } from "@/components/ui/highlight";
import getSolarSystemBodies, {
  type SolarSystemBody,
} from "@/actions/solar-system/get-solar-system-bodies";
import SolarSystemLoading from "./solar-system-loader";
import QueryError from "@/components/ui/error";
import FavoriteButton from "@/components/favorite-button";
import { useAuth } from "@clerk/nextjs";
import { toggleFavorite } from "@/actions/favorites/toggle-favorite";
import { toggleFavoriteInLocalStorage } from "@/actions/favorites-ls/toggle-favorite";
import { SolarSystemFavorite } from "@/interfaces/favorite";
import { getSolarSystemFavoritesFromLocalStorage } from "@/actions/solar-system/get-solar-system-favorites-local-storage";

interface Props {
  initialFavorites?: SolarSystemFavorite[] | null;
}

const SolarSystemComponent = ({ initialFavorites }: Props) => {
  const { userId } = useAuth();
  const [selectedBody, setSelectedBody] = useState<SolarSystemBody | null>(
    null
  );
  const [favorites, setFavorites] = useState<Map<string, number>>(new Map());
  const [, setLoadingFavorites] = useState(true);

  const {
    data: bodies,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["solar-system-bodies"],
    queryFn: () => getSolarSystemBodies(),
    staleTime: 300_000,
  });

  useEffect(() => {
    const loadFavorites = async () => {
      if (!bodies) return;

      setLoadingFavorites(true);
      const favMap = new Map<string, number>();

      if (userId && initialFavorites) {
        initialFavorites.forEach((fav) => {
          try {
            const data =
              typeof fav.referenceData === "string"
                ? JSON.parse(fav.referenceData)
                : fav.referenceData;

            if (data.bodyId) {
              favMap.set(data.bodyId, fav.isFavorite || 0);
            }
          } catch (error) {
            console.error("Error parsing favorite data:", error);
          }
        });
      } else {
        const localFavorites = await getSolarSystemFavoritesFromLocalStorage();

        localFavorites.forEach((fav) => {
          try {
            const data =
              typeof fav.referenceData === "string"
                ? JSON.parse(fav.referenceData)
                : fav.referenceData;

            if (data.bodyId) {
              favMap.set(data.bodyId, fav.isFavorite ?? 0);
            }
          } catch (error) {
            console.error("Error parsing favorite data:", error);
          }
        });
      }

      bodies.forEach((body) => {
        if (!favMap.has(body.id)) {
          favMap.set(body.id, 0);
        }
      });

      setFavorites(favMap);
      setLoadingFavorites(false);
    };

    loadFavorites();
  }, [bodies, userId, initialFavorites]);

  const handleFavoriteChange = async (
    bodyId: string,
    currentStatus: number
  ) => {
    const body = bodies?.find((b) => b.id === bodyId);
    if (!body) return;

    try {
      let newState;
      if (userId) {
        newState = await toggleFavorite({
          type: "solar_system",
          userId,
          newStatus: currentStatus,
          bodyId: body.id,
          bodyName: body.englishName,
        });
      } else {
        newState = await toggleFavoriteInLocalStorage({
          userId: "guest",
          type: "solar_system",
          newStatus: currentStatus,
          bodyId: body.id,
          bodyName: body.englishName,
        });
      }

      setFavorites((prev) => {
        const newMap = new Map(prev);
        newMap.set(bodyId, newState.isFavorite || 0);
        return newMap;
      });
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  if (isLoading) return <SolarSystemLoading />;

  if (error) {
    return (
      <QueryError
        error={error}
        title="Error accediendo a la API de Solar System"
      />
    );
  }

  if (!bodies) return null;

  return (
    <Container className="space-y-8" padding={false}>
      <section className="space-y-4">
        <Subtitle variant="h4">Planetas del Sistema Solar</Subtitle>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bodies.map((body) => (
            <div
              key={body.id}
              className="p-4 bg-stone-50 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
              onClick={() => setSelectedBody(body)}
            >
              <div className="flex items-center justify-between mb-2">
                <Paragraph size="lg" className="font-semibold">
                  {body.englishName}
                </Paragraph>
                <FavoriteButton
                  isFavorite={favorites.get(body.id) ?? 0}
                  onFavoriteChange={(newStatus) =>
                    handleFavoriteChange(body.id, newStatus)
                  }
                  showText={false}
                />
              </div>

              <div className="space-y-2">
                {body.meanRadius && (
                  <Paragraph size="sm" className="text-stone-600">
                    Radio:{" "}
                    <Highlight variant="indigo">
                      {body.meanRadius.toLocaleString()} km
                    </Highlight>
                  </Paragraph>
                )}

                {body.gravity && (
                  <Paragraph size="sm" className="text-stone-600">
                    Gravedad:{" "}
                    <Highlight variant="green">
                      {body.gravity.toFixed(2)} m/s²
                    </Highlight>
                  </Paragraph>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {selectedBody && (
        <section className="space-y-4 p-6 bg-stone-50 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <Subtitle variant="h4">{selectedBody.englishName}</Subtitle>
            <FavoriteButton
              isFavorite={favorites.get(selectedBody.id) ?? 0}
              onFavoriteChange={(newStatus) =>
                handleFavoriteChange(selectedBody.id, newStatus)
              }
              showText={true}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedBody.meanRadius && (
              <div>
                <Paragraph size="sm" className="text-stone-500">
                  Radio medio
                </Paragraph>
                <Paragraph size="lg">
                  <Highlight variant="indigo">
                    {selectedBody.meanRadius.toLocaleString()} km
                  </Highlight>
                </Paragraph>
              </div>
            )}

            {selectedBody.gravity && (
              <div>
                <Paragraph size="sm" className="text-stone-500">
                  Gravedad
                </Paragraph>
                <Paragraph size="lg">
                  <Highlight variant="green">
                    {selectedBody.gravity.toFixed(2)} m/s²
                  </Highlight>
                </Paragraph>
              </div>
            )}

            {selectedBody.density && (
              <div>
                <Paragraph size="sm" className="text-stone-500">
                  Densidad
                </Paragraph>
                <Paragraph size="lg">
                  <Highlight variant="yellow">
                    {selectedBody.density.toFixed(2)} g/cm³
                  </Highlight>
                </Paragraph>
              </div>
            )}

            {selectedBody.mass && (
              <div>
                <Paragraph size="sm" className="text-stone-500">
                  Masa
                </Paragraph>
                <Paragraph size="lg">
                  {selectedBody.mass.massValue} × 10
                  <sup>{selectedBody.mass.massExponent}</sup> kg
                </Paragraph>
              </div>
            )}
          </div>
        </section>
      )}
    </Container>
  );
};

export default SolarSystemComponent;
