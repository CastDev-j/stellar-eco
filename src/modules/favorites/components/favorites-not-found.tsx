"use client";

import gsap from "gsap";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { Title } from "@/components/ui/title";
import { Paragraph } from "@/components/ui/paragraph";
import { Button } from "@/components/ui/button";
import { FaRocket } from "react-icons/fa";
import { CiStar } from "react-icons/ci";
import { IoArrowBack } from "react-icons/io5";
import { useRouter } from "next/navigation";

gsap.registerPlugin(useGSAP);

const favoriteColor = "oklch(65% 0.20 270)";

const FavoritesNotFound = () => {
  const iconRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const pulseRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useGSAP(() => {
    const entryTl = gsap.timeline();

    entryTl.fromTo(
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

    entryTl.fromTo(
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
      "-=0.4"
    );

    entryTl.fromTo(
      subtitleRef.current,
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
      "-=0.3"
    );

    entryTl.fromTo(
      buttonsRef.current,
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

    gsap.to(iconRef.current, {
      scale: 1.1,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 0.8,
    });

    gsap.to(pulseRef.current, {
      scale: 1.8,
      opacity: 0,
      duration: 2,
      repeat: -1,
      ease: "power2.out",
    });
  });

  const handleGoBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center sm:min-h-162 min-h-168 text-center gap-6 px-4">
      <div className="relative flex items-center justify-center">
        <div
          ref={pulseRef}
          className="absolute size-56 rounded-full border-4 border-indigo-500/30"
          style={{ opacity: 0.5 }}
        />

        <div
          ref={iconRef}
          className="relative flex size-56 items-center justify-center rounded-full opacity-0"
        >
          <div className="absolute inset-0 rounded-full" />
          <CiStar
            className="relative z-10"
            style={{ color: favoriteColor }}
            size={120}
          />
        </div>
      </div>

      <div ref={titleRef} className="space-y-2 opacity-0">
        <Title variant="h3" align="center">
          No tienes favoritos guardados
        </Title>
      </div>

      <div ref={subtitleRef} className="opacity-0 space-y-3">
        <Paragraph
          size="base"
          align="center"
          className="max-w-md text-stone-600"
        >
          Aún no has guardado ninguna imagen del cosmos como favorita. Explora
          la galería de la NASA y comienza a guardar tus imágenes preferidas.
        </Paragraph>
        <Paragraph size="sm" align="center" className="max-w-md text-stone-500">
          Descubre las maravillas del universo y crea tu propia colección.
        </Paragraph>
      </div>

      <div
        ref={buttonsRef}
        className="flex flex-col sm:flex-row gap-3 mt-2 opacity-0"
      >
        <Button onClick={handleGoBack} variant="ghost" className="gap-2">
          <IoArrowBack className="size-4" />
          Volver atrás
        </Button>
        <Button onClick={() => router.push("/nasa")} className="gap-2">
          <FaRocket className="size-4" />
          Explorar imágenes
        </Button>
      </div>
    </div>
  );
};

export default FavoritesNotFound;
