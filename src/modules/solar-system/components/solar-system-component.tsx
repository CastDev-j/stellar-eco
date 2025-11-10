"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import getSolarSystemBodies, {
  type SolarSystemBody,
} from "@/actions/solar-system/get-solar-system-bodies";
import QueryError from "@/components/ui/error";
import FavoriteButton from "@/components/favorite-button";
import { useAuth } from "@clerk/nextjs";
import { toggleFavorite } from "@/actions/favorites/toggle-favorite";
import { toggleFavoriteInLocalStorage } from "@/actions/favorites-ls/toggle-favorite";
import { SolarSystemFavorite } from "@/interfaces/favorite";
import { getSolarSystemFavoritesFromLocalStorage } from "@/actions/solar-system/get-solar-system-favorites-local-storage";
import SolarSystem from "./solar-system";
import * as THREE from "three";

interface Props {
  initialFavorites?: SolarSystemFavorite[] | null;
}

interface SelectedPlanetInfo {
  body: SolarSystemBody;
  name: string;
  info: string;
  position: THREE.Vector3;
}

const PLANET_INFO_MAP: Record<string, string> = {
  Sun: "El Sol es la estrella central de nuestro Sistema Solar. Es una esfera de plasma caliente que proporciona luz y calor a todos los planetas. Su masa representa el 99.86% de la masa total del Sistema Solar.",
  Mercury:
    "Mercurio es el planeta más pequeño y cercano al Sol. Su superficie está cubierta de cráteres y experimenta temperaturas desde -173°C hasta 427°C.",
  Venus:
    "Venus tiene una atmósfera densa de CO₂ con nubes de ácido sulfúrico. Es el planeta más caliente del Sistema Solar con 462°C en superficie debido al efecto invernadero extremo.",
  Earth:
    "La Tierra es el único planeta conocido con vida. El 71% de su superficie está cubierta de agua líquida. Tiene una atmósfera rica en nitrógeno y oxígeno que protege la vida.",
  Mars: "Marte, el planeta rojo, tiene los volcanes más grandes del Sistema Solar (Monte Olimpo) y evidencia de agua líquida antigua. Tiene dos lunas: Fobos y Deimos.",
  Jupiter:
    "Júpiter es el planeta más grande del Sistema Solar. Su Gran Mancha Roja es una tormenta anticiclónica más grande que la Tierra que ha durado al menos 350 años.",
  Saturn:
    "Saturno es famoso por sus espectaculares anillos compuestos principalmente de partículas de hielo y roca. Es el planeta menos denso, podría flotar en agua.",
  Uranus:
    "Urano rota de lado con un eje de inclinación de 98°. Su atmósfera contiene metano que le da su característico color azul verdoso.",
  Neptune:
    "Neptuno tiene los vientos más rápidos del Sistema Solar, alcanzando velocidades de hasta 2,100 km/h. Es el planeta más alejado del Sol desde que Plutón fue reclasificado.",
};

const SolarSystemComponent = ({ initialFavorites }: Props) => {
  const { userId } = useAuth();
  const [selectedBody, setSelectedBody] = useState<SelectedPlanetInfo | null>(
    null
  );
  const [favorites, setFavorites] = useState<Map<string, number>>(new Map());
  const [, setLoadingFavorites] = useState(true);
  const infoRef = useRef<HTMLDivElement>(null);

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

  const handlePlanetSelected = (
    name: string,
    info: string,
    position: THREE.Vector3
  ) => {
    const body = bodies?.find((b) => b.englishName === name);
    if (body) {
      setSelectedBody({ body, name, info, position });
    }
  };

  const handleNavigatePlanet = (direction: "next" | "prev") => {
    if (!selectedBody || !bodies) return;

    const currentIndex = bodies.findIndex(
      (b) => b.englishName === selectedBody.name
    );
    if (currentIndex === -1) return;

    let nextIndex: number;
    if (direction === "next") {
      nextIndex = (currentIndex + 1) % bodies.length;
    } else {
      nextIndex = (currentIndex - 1 + bodies.length) % bodies.length;
    }

    const nextBody = bodies[nextIndex];
    const nextBodyInfo =
      PLANET_INFO_MAP[nextBody.englishName] || selectedBody.info;
    handlePlanetSelected(
      nextBody.englishName,
      nextBodyInfo,
      selectedBody.position
    );
  };

  if (error) {
    return (
      <QueryError
        error={error}
        title="Error accediendo a la API de Solar System"
      />
    );
  }

  return (
    <div className="relative w-full h-screen min-h-screen bg-black overflow-hidden">
      <div className="w-full h-full">
        <SolarSystem
          scale={0.3}
          onPlanetClick={handlePlanetSelected}
          selectedPlanetName={selectedBody?.name}
          isLoadingBodies={isLoading}
        />
      </div>

      {selectedBody && (
        <div
          ref={infoRef}
          className="fixed bottom-6 left-6 right-6 md:right-auto md:bottom-6 z-30 animate-slide-up md:max-w-sm"
        >
          <div className="bg-neutral-950/90 backdrop-blur-md text-stone-50 p-4 md:p-6 rounded-xl border border-stone-800/40 shadow-2xl max-h-[40vh] md:max-h-none overflow-y-hidden">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <h3 className="text-lg md:text-xl font-semibold truncate">
                {selectedBody.body.englishName}
              </h3>
              <button
                onClick={() => setSelectedBody(null)}
                className="text-stone-400 hover:text-stone-200 transition-colors text-lg ml-2 shrink-0"
              >
                ✕
              </button>
            </div>

            <p className="text-stone-300 text-xs md:text-sm leading-relaxed mb-3 md:mb-4 line-clamp-2 md:line-clamp-3">
              {selectedBody.info}
            </p>

            <div className="space-y-1 md:space-y-2 mb-3 md:mb-4">
              {selectedBody.body.meanRadius && (
                <div className="flex justify-between text-xs">
                  <span className="text-stone-400">Radio</span>
                  <span className="text-stone-100 font-medium">
                    {(selectedBody.body.meanRadius / 1000).toFixed(1)}k km
                  </span>
                </div>
              )}
              {selectedBody.body.gravity && (
                <div className="flex justify-between text-xs">
                  <span className="text-stone-400">Gravedad</span>
                  <span className="text-stone-100 font-medium">
                    {selectedBody.body.gravity.toFixed(1)} m/s²
                  </span>
                </div>
              )}
              {selectedBody.body.density && (
                <div className="flex justify-between text-xs">
                  <span className="text-stone-400">Densidad</span>
                  <span className="text-stone-100 font-medium">
                    {selectedBody.body.density.toFixed(2)} g/cm³
                  </span>
                </div>
              )}
            </div>

            <div className="flex gap-2 justify-between items-center">
              <button
                onClick={() => handleNavigatePlanet("prev")}
                className="bg-stone-800/50 hover:bg-stone-700/70 transition-colors px-3 py-2 rounded-lg text-xs font-medium"
              >
                ← Anterior
              </button>

              <FavoriteButton
                isFavorite={favorites.get(selectedBody.body.id) ?? 0}
                onFavoriteChange={(newStatus) =>
                  handleFavoriteChange(selectedBody.body.id, newStatus)
                }
                showText={false}
                blackMode
              />

              <button
                onClick={() => handleNavigatePlanet("next")}
                className="bg-stone-800/50 hover:bg-stone-700/70 transition-colors px-3 py-2 rounded-lg text-xs font-medium"
              >
                Siguiente →
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-up {
          animation: slideUp 0.4s ease-out;
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default SolarSystemComponent;
