"use client";

import { getAllFavorites } from "@/actions/favorites/get-all";
import { Paragraph } from "@/components/ui/paragraph";
import { Title } from "@/components/ui/title";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const APODTEST = () => {
  const {
    data: favorites = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["favorites"],
    queryFn: getAllFavorites,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    refetch();
  }, []);

  if (isLoading) {
    return <div>Cargando favoritos...</div>;
  }

  if (error) {
    return <div>Error al cargar favoritos: {error.message}</div>;
  }

  return (
    <ol className="space-y-4">
      <Title variant="h3">
        Tienes un total de {favorites.length} favoritos
      </Title>

      <Paragraph size="sm" className="text-red-500">
        Este componente es de prueba, ignora su formato
      </Paragraph>

      {favorites.map((item, index) => (
        <li key={item.id} className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="text-sm text-gray-700 truncate">
              {index + 1}.- {item.id} - {JSON.stringify(item.referenceData)}
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
};

export default APODTEST;
