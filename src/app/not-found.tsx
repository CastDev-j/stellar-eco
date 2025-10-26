"use client";

import gsap from "gsap";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { Container } from "@/components/ui/container";
import { Title } from "@/components/ui/title";
import { Paragraph } from "@/components/ui/paragraph";
import { HiOutlineQuestionMarkCircle } from "react-icons/hi2";
import Link from "next/link";

gsap.registerPlugin(useGSAP);

const notFoundColor = "oklch(65% 0.18 275)";

export default function NotFound() {
  const iconRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const pulseRef = useRef<HTMLDivElement>(null);

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

    gsap.to(iconRef.current, {
      rotation: 15,
      duration: 1.2,
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

  return (
    <Container>
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
            <HiOutlineQuestionMarkCircle
              className="relative z-10"
              style={{ color: notFoundColor }}
              size={120}
              strokeWidth={1.5}
            />
          </div>
        </div>

        <div ref={titleRef} className="space-y-2 opacity-0">
          <Title variant="h3" align="center">
            Página no encontrada
          </Title>
          <Title
            variant="h3"
            align="center"
            className="font-bold text-indigo-600"
          >
            404
          </Title>
        </div>

        <div ref={subtitleRef} className="opacity-0 space-y-3">
          <Paragraph
            size="base"
            align="center"
            className="max-w-md text-stone-600"
          >
            La página que estás buscando no existe o ha sido movida.
          </Paragraph>
          <Paragraph
            size="sm"
            align="center"
            className="max-w-md text-stone-500"
          >
            Verifica la URL o regresa a la página principal para continuar
            explorando.
          </Paragraph>
        </div>

        <div ref={buttonRef} className="opacity-0">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-200 font-medium"
          >
            <span>Volver al inicio</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </Container>
  );
}
