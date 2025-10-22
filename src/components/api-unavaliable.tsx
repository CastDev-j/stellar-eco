"use client";

import gsap from "gsap";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { Title } from "@/components/ui/title";
import { Paragraph } from "@/components/ui/paragraph";
import { HiOutlineExclamationTriangle } from "react-icons/hi2";

gsap.registerPlugin(useGSAP);

const warningColor = "oklch(75% 0.15 60)";

interface Props {
  errorMessage: string;
}

export default function ApiUnavailable({ errorMessage }: Props) {
  const iconRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
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

  return (
    <div className="flex flex-col justify-center items-center sm:min-h-162 min-h-168 text-center gap-6 px-4">
      <div className="relative flex items-center justify-center">
        <div
          ref={pulseRef}
          className="absolute size-56 rounded-full border-4 border-yellow-500/30"
          style={{ opacity: 0.5 }}
        />

        <div
          ref={iconRef}
          className="relative flex size-56 items-center justify-center rounded-full opacity-0"
        >
          <div className="absolute inset-0 rounded-full " />
          <HiOutlineExclamationTriangle
            className="relative z-10"
            style={{ color: warningColor }}
            size={120}
            strokeWidth={1.5}
          />
        </div>
      </div>

      <div ref={titleRef} className="space-y-2 opacity-0">
        <Title variant="h3" align="center">
          Servicio temporalmente no disponible
        </Title>
      </div>

      <div ref={subtitleRef} className="opacity-0 space-y-3">
        <Paragraph
          size="base"
          align="center"
          className="max-w-md text-stone-600"
        >
          {errorMessage}
        </Paragraph>
        <Paragraph size="sm" align="center" className="max-w-md text-stone-500">
          Sentimos los inconvenientes que esto pueda causar.
        </Paragraph>
      </div>
    </div>
  );
}
