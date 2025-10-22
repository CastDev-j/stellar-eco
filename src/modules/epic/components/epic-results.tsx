"use client";

import React, { useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Container } from "@/components/ui/container";
import { Paragraph } from "@/components/ui/paragraph";
import { Highlight } from "@/components/ui/highlight";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { cn } from "@/lib/cn";
import EPICNotFound from "./epic-not-found";
import { EPICImage } from "../interfaces/epic-image";
import FavoriteButton from "@/components/favorite-button";
import { EPICReference } from "@/interfaces/favorite";
import { useSearchParams } from "next/navigation";
import Skeleton from "@/components/ui/skeleton";

interface Props {
  data: {
    collection?: {
      items?: EPICImage[];
    };
  };
}

const EPICResults: React.FC<Props> = ({ data }) => {
  const searchParams = useSearchParams();

  const dateParam = searchParams.get("date") || "";
  const items = data?.collection?.items || [];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState<number>(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  React.useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  const getImageUrl = (item: EPICImage) => {
    const date = new Date(item.date);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `https://epic.gsfc.nasa.gov/archive/enhanced/${year}/${month}/${day}/jpg/${item.image}.jpg`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (items.length === 0) {
    return <EPICNotFound />;
  }

  const handleFavoriteChange = (isFavorite: number) => {};

  return (
    <Container className="space-y-6" padding={false}>
      <div className="flex justify-between max-w-4xl mx-auto items-center">
        <Paragraph size="lg" align="center">
          <Highlight variant="indigo">{items.length}</Highlight>{" "}
          {items.length === 1 ? "imagen encontrada" : "imágenes encontradas"}
        </Paragraph>
        <FavoriteButton
          onFavoriteChange={handleFavoriteChange}
          isFavorite={isFavorite}
        />
      </div>

      <div className="space-y-4">
        <div className="relative max-w-2xl mx-auto">
          <div className="overflow-hidden rounded-lg" ref={emblaRef}>
            <div className="flex">
              {items.map((item, index) => (
                <div
                  key={item.identifier || index}
                  className="flex-[0_0_100%] min-w-0"
                >
                  <div className="relative w-full bg-stone-200">
                    <img
                      src={getImageUrl(item)}
                      alt={item.caption || `Imagen de la Tierra ${index + 1}`}
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/70 to-transparent p-4">
                      <p className="text-white text-sm">
                        {formatDate(item.date)}
                      </p>
                      {item.caption && (
                        <p className="text-white/90 text-xs mt-1">
                          {item.caption}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {items.length > 1 && (
            <>
              <button
                onClick={scrollPrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-stone-800 p-3 rounded-full shadow-lg transition-all z-10"
                aria-label="Imagen anterior"
              >
                <FaChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={scrollNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-stone-800 p-3 rounded-full shadow-lg transition-all z-10"
                aria-label="Imagen siguiente"
              >
                <FaChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {items.length > 1 && (
          <div className="flex gap-2 justify-center flex-wrap max-w-4xl mx-auto">
            {items.map((item, index) => (
              <button
                key={item.identifier || index}
                onClick={() => scrollTo(index)}
                className={cn(
                  "w-16 h-16 rounded-md overflow-hidden border-2 transition-all",
                  selectedIndex === index
                    ? "border-indigo-600 scale-110"
                    : "border-transparent opacity-60 hover:opacity-100"
                )}
              >
                <img
                  src={getImageUrl(item)}
                  alt={`Miniatura ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
};

export default EPICResults;
