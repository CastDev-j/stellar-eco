"use client";

import { useState } from "react";
import * as THREE from "three";

interface PlanetMenuItem {
  name: string;
  englishName: string;
}

const PLANETS: PlanetMenuItem[] = [
  { name: "Todos", englishName: "" },
  { name: "Sol", englishName: "Sun" },
  { name: "Mercurio", englishName: "Mercury" },
  { name: "Venus", englishName: "Venus" },
  { name: "Tierra", englishName: "Earth" },
  { name: "Marte", englishName: "Mars" },
  { name: "Júpiter", englishName: "Jupiter" },
  { name: "Saturno", englishName: "Saturn" },
  { name: "Urano", englishName: "Uranus" },
  { name: "Neptuno", englishName: "Neptune" },
];

interface PlanetNavigationMenuProps {
  onPlanetSelect: (planetName: string) => void;
  selectedPlanet?: string;
}

export default function PlanetNavigationMenu({
  onPlanetSelect,
  selectedPlanet,
}: PlanetNavigationMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectPlanet = (englishName: string) => {
    onPlanetSelect(englishName);
    setIsOpen(false);
  };

  const selectedPlanetLabel =
    PLANETS.find((p) => p.englishName === selectedPlanet)?.name || "Navegación";

  return (
    <div className="fixed top-6 right-6 z-40">
      <div className="hidden md:flex gap-2 flex-wrap justify-end max-w-xs">
        {PLANETS.map((planet) => (
          <button
            key={planet.englishName}
            onClick={() => handleSelectPlanet(planet.englishName)}
            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
              selectedPlanet === planet.englishName
                ? "bg-blue-600 text-white shadow-lg scale-105"
                : "bg-stone-800/60 hover:bg-stone-700/80 text-stone-100 border border-stone-700/40"
            }`}
          >
            {planet.name}
          </button>
        ))}
      </div>
      ={" "}
      <div className="md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-stone-800/80 hover:bg-stone-700/90 text-stone-50 px-4 py-2 rounded-lg font-medium border border-stone-700/40 flex items-center gap-2 transition-colors"
        >
          <span>{selectedPlanetLabel}</span>
          <svg
            className={`w-4 h-4 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute top-full right-0 mt-2 bg-neutral-950/95 backdrop-blur-md border border-stone-700/40 rounded-lg shadow-2xl overflow-hidden">
            {PLANETS.map((planet) => (
              <button
                key={planet.englishName}
                onClick={() => handleSelectPlanet(planet.englishName)}
                className={`w-full px-4 py-3 text-left text-sm font-medium transition-colors border-b border-stone-700/20 last:border-0 ${
                  selectedPlanet === planet.englishName
                    ? "bg-blue-600/80 text-white"
                    : "text-stone-100 hover:bg-stone-800/60"
                }`}
              >
                {planet.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
