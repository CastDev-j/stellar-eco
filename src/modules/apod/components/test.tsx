"use client";

import { getAllFavorites } from "@/actions/favorites/get-all";
import FavoriteButton from "@/components/favorite-button";
import { Favorite, ReferenceData } from "@/interfaces/favorite";
import { useQuery } from "@tanstack/react-query";

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

  const handleFavoriteChange = (isFavorite: boolean) => {
    console.log("Favorite status changed:", isFavorite);
    refetch();
  };

  if (isLoading) {
    return <div>Cargando favoritos...</div>;
  }

  if (error) {
    return <div>Error al cargar favoritos: {error.message}</div>;
  }

  return (
    <ol className="space-y-4">
      {favorites.map((item, index) => (
        <li key={item.id}>
          {index + 1}.- {item.id} - {JSON.stringify(item.referenceData)}
          <FavoriteButton
            type={item.type}
            referenceData={item.referenceData as ReferenceData}
            userId={item.userId}
            initialIsFavorite={item.isFavorite}
            onFavoriteChange={handleFavoriteChange}
          />
        </li>
      ))}
    </ol>
  );
};

export default APODTEST;
