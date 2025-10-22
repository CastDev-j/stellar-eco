"use client";

import { useRef } from "react";
import { Title } from "@/components/ui/title";
import { Paragraph } from "@/components/ui/paragraph";
import Button from "@/components/ui/button";
import { IoMdCalendar, IoMdImages } from "react-icons/io";
import { IoArrowBack } from "react-icons/io5";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRouter } from "next/navigation";

const EPICNotFound = () => {
  const iconRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useGSAP(() => {
    const tl = gsap.timeline();

    tl.fromTo(
      iconRef.current,
      {
        scale: 0,
        rotation: -180,
        opacity: 0,
      },
      {
        scale: 1,
        rotation: 0,
        opacity: 1,
        duration: 0.8,
        ease: "back.out(1.7)",
      }
    );

    tl.fromTo(
      titleRef.current,
      {
        y: 30,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
      },
      "-=0.3"
    );

    tl.fromTo(
      buttonRef.current,
      {
        y: 20,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
      },
      "-=0.2"
    );
  }, []);

  const handleGoBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/epic");
    }
  };

  const handleClearFilters = () => {
    router.push("/epic");
  };

  return (
    <div className="flex flex-col justify-center items-center sm:min-h-152 min-h-168 text-center gap-6 py-12">
      <div ref={iconRef} className="flex justify-center">
        <div className="w-24 h-24 rounded-full flex items-center justify-center">
          <IoMdImages className="size-16 text-indigo-500" />
        </div>
      </div>

      <div ref={titleRef} className="space-y-3">
        <Title variant="h2" align="center">
          No se encontraron imágenes
        </Title>
        <Paragraph
          size="lg"
          align="center"
          className="max-w-2xl text-stone-600"
        >
          No hay imágenes disponibles con los filtros seleccionados. Intenta con
          otra fecha o combinación de filtros.
        </Paragraph>
      </div>

      <div ref={buttonRef} className="flex flex-col sm:flex-row gap-3 mt-2">
        <Button onClick={handleGoBack} variant="ghost" className="gap-2">
          <IoArrowBack className="size-4" />
          Volver atrás
        </Button>
        <Button onClick={handleClearFilters} className="gap-2">
          <IoMdCalendar className="size-4" />
          Limpiar filtros
        </Button>
      </div>

      <div className="mt-4">
        <Paragraph size="sm" className="text-stone-500">
          Tip: Las imágenes EPIC están disponibles desde{" "}
          <span className="font-medium">junio 2015</span> hasta la fecha actual
        </Paragraph>
      </div>
    </div>
  );
};

export default EPICNotFound;
