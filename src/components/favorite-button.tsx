"use client";

import type { NewFavorite, ReferenceData } from "@/interfaces/favorite";
import { useRef, useState } from "react";
import { FaStar } from "react-icons/fa6";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Button from "./ui/button";
import { sleep } from "@/lib/sleep";

interface Props {
  isFavorite?: number | null;
  onFavoriteChange?: (isFavorite: number) => void;
  showText?: boolean;
}

const FavoriteButton = (props: Props) => {
  const { isFavorite = null, onFavoriteChange, showText = true } = props;

  const [isLoading, setIsLoading] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const starRef = useRef<HTMLDivElement>(null);
  const sparklesRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (starRef.current && isFavorite) {
      const tl = gsap.timeline();

      tl.fromTo(
        starRef.current,
        { scale: 0.5, rotation: -180 },
        {
          scale: 1,
          rotation: 0,
          duration: 0.5,
          ease: "back.out(1.7)",
        }
      )
        .to(starRef.current, {
          scale: 1.3,
          duration: 0.2,
          yoyo: true,
          repeat: 1,
          ease: "power2.inOut",
        })
        .to(starRef.current, {
          scale: 1,
          duration: 0.1,
          ease: "power2.out",
        });
    }
  }, [isFavorite]);

  const createSparkles = () => {
    if (!sparklesRef.current) return;

    const sparkles = [];
    const colors = ["#FFD700", "#FFED4E", "#FFF9C4", "#FFA726"];

    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const distance = 70;
      const sparkle = document.createElement("div");

      sparkle.className = "absolute w-1 h-1 rounded-full";
      sparkle.style.backgroundColor = colors[i % colors.length];
      sparkle.style.left = "50%";
      sparkle.style.top = "50%";
      sparkle.style.transform = "translate(-50%, -50%)";

      sparklesRef.current.appendChild(sparkle);
      sparkles.push(sparkle);

      gsap.fromTo(
        sparkle,
        {
          scale: 0,
          x: 0,
          y: 0,
          opacity: 3,
        },
        {
          scale: 1.5,
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance,
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
          onComplete: () => {
            sparkle.remove();
          },
        }
      );
    }
  };

  const handleMouseEnter = () => {
    if (starRef.current && !isLoading) {
      gsap.to(starRef.current, {
        scale: 1.2,
        rotation: 10,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  };

  const handleMouseLeave = () => {
    if (starRef.current && !isLoading) {
      gsap.to(starRef.current, {
        scale: 1,
        rotation: 0,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  };

  const toggleFavorite = async () => {
    if (isLoading) return;

    setIsLoading(true);

    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut",
      });
    }

    if (starRef.current) {
      const tl = gsap.timeline();

      tl.to(starRef.current, {
        rotation: 360,
        scale: 1.4,
        duration: 0.4,
        ease: "back.out(1.5)",
      }).to(starRef.current, {
        scale: 1,
        duration: 0.2,
        ease: "power2.out",
      });
    }

    await sleep(400);

    const newFavoriteState = isFavorite == 1 ? 0 : 1;
    onFavoriteChange?.(newFavoriteState);

    if (newFavoriteState) {
      createSparkles();
    }

    await sleep(200);
    setIsLoading(false);
  };

  return (
    <Button
      onClick={toggleFavorite}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      disabled={isLoading}
      variant="ghost"
      className={`relative flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 overflow-visible ${
        isFavorite
          ? "hover:bg-yellow-50 bg-yellow-50 text-yellow-400 ring-yellow-200 focus:ring-yellow-200 hover:ring-2 hover:ring-offset-2"
          : "bg-stone-50 hover:bg-stone-50 text-stone-400 ring-stone-200 focus:ring-stone-200 border border-stone-200/50 hover:ring-2 hover:ring-offset-2"
      } ${isLoading ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}`}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      <div ref={sparklesRef} className="absolute inset-0 pointer-events-none" />

      <div ref={starRef} className="relative transition-transform duration-300">
        <FaStar
          className={`w-5 h-5 transition-all duration-300 ${
            isFavorite ? "fill-current" : "text-stone-400 hover:text-yellow-400"
          } ${isLoading ? "animate-pulse" : ""}`}
        />
      </div>

      {showText && (
        <span
          className={`font-medium text-sm transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap ${
            isFavorite ? "text-yellow-700" : "text-stone-600"
          }`}
        >
          {isFavorite ? "En favoritos" : "Agregar a favoritos"}
        </span>
      )}
    </Button>
  );
};

export default FavoriteButton;
