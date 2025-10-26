"use client";

import { useState, useEffect } from "react";
import { Container } from "@/components/ui/container";
import { Paragraph } from "@/components/ui/paragraph";
import { Subtitle } from "@/components/ui/subtitle";
import { Highlight } from "@/components/ui/highlight";
import { Button } from "@/components/ui/button";
import { FaHeart, FaRegHeart } from "react-icons/fa";

interface SolarSystemBody {
  id: string;
  name: string;
  englishName: string;
  isPlanet: boolean;
  mass?: {
    massValue: number;
    massExponent: number;
  };
  vol?: {
    volValue: number;
    volExponent: number;
  };
  density?: number;
  gravity?: number;
  meanRadius?: number;
}

const SolarSystemComponent = () => {
  const [bodies, setBodies] = useState<SolarSystemBody[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBody, setSelectedBody] = useState<SolarSystemBody | null>(
    null
  );
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchBodies = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://api.le-systeme-solaire.net/rest/bodies?filter[]=isPlanet,eq,true"
        );

        if (!response.ok) {
          throw new Error("Error al obtener datos del sistema solar");
        }

        const data = await response.json();
        setBodies(data.bodies);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchBodies();
  }, []);

  const toggleFavorite = (bodyId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(bodyId)) {
        newFavorites.delete(bodyId);
      } else {
        newFavorites.add(bodyId);
      }
      return newFavorites;
    });
  };

  if (loading) {
    return (
      <Container className="space-y-8">
        <Paragraph align="center">
          Cargando datos del sistema solar...
        </Paragraph>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="space-y-8">
        <Paragraph align="center" className="text-red-500">
          {error}
        </Paragraph>
      </Container>
    );
  }

  return (
    <Container className="space-y-8">
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
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(body.id);
                  }}
                >
                  {favorites.has(body.id) ? (
                    <FaHeart className="text-red-500" />
                  ) : (
                    <FaRegHeart />
                  )}
                </Button>
              </div>

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
          ))}
        </div>
      </section>

      {selectedBody && (
        <section className="space-y-4 p-6 bg-stone-50 rounded-lg">
          <Subtitle variant="h4">{selectedBody.englishName}</Subtitle>

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
