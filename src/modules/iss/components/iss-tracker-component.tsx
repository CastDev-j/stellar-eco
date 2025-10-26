"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Container } from "@/components/ui/container";
import { Paragraph } from "@/components/ui/paragraph";
import { Subtitle } from "@/components/ui/subtitle";
import { Highlight } from "@/components/ui/highlight";
import { Button } from "@/components/ui/button";
import getISSPosition from "@/actions/iss/get-iss-position";
import IssTrackerLoading from "./iss-tracker-loading";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

gsap.registerPlugin(useGSAP);

const ISSTrackerComponent = () => {
  const latRef = useRef<HTMLSpanElement>(null);
  const lonRef = useRef<HTMLSpanElement>(null);
  const altRef = useRef<HTMLSpanElement>(null);
  const velRef = useRef<HTMLSpanElement>(null);

  const [displayValues, setDisplayValues] = useState({
    latitude: 0,
    longitude: 0,
    altitude: 0,
    velocity: 0,
  });

  const [countdown, setCountdown] = useState(5);

  const {
    data: position,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["iss-position"],
    queryFn: getISSPosition,
    refetchInterval: 5000,
    staleTime: 4000,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) return 5;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!position) return;

    gsap.to(displayValues, {
      latitude: position.latitude,
      duration: 5,
      ease: "none",
      onUpdate: function () {
        if (latRef.current) {
          latRef.current.textContent = displayValues.latitude.toFixed(4) + "°";
        }
      },
    });

    gsap.to(displayValues, {
      longitude: position.longitude,
      duration: 5,
      ease: "none",
      onUpdate: function () {
        if (lonRef.current) {
          lonRef.current.textContent = displayValues.longitude.toFixed(4) + "°";
        }
      },
    });

    gsap.to(displayValues, {
      altitude: position.altitude,
      duration: 5,
      ease: "none",
      onUpdate: function () {
        if (altRef.current) {
          altRef.current.textContent =
            displayValues.altitude.toFixed(0) + " km";
        }
      },
    });

    gsap.to(displayValues, {
      velocity: position.velocity,
      duration: 5,
      ease: "none",
      onUpdate: function () {
        if (velRef.current) {
          velRef.current.textContent =
            displayValues.velocity.toFixed(0) + " km/h";
        }
      },
    });

    [latRef, lonRef, altRef, velRef].forEach((ref) => {
      if (ref.current) {
        gsap.fromTo(
          ref.current,
          { scale: 1, opacity: 1 },
          {
            scale: 1.05,
            opacity: 0.7,
            duration: 0.2,
            yoyo: true,
            repeat: 1,
            ease: "power2.inOut",
          }
        );
      }
    });

    setCountdown(5);
  }, [position]);

  if (isLoading) return <IssTrackerLoading />;

  if (error) {
    return (
      <Container className="space-y-8">
        <Paragraph align="center" className="text-red-500">
          {error instanceof Error ? error.message : "Error desconocido"}
        </Paragraph>
        <Button onClick={() => refetch()}>Reintentar</Button>
      </Container>
    );
  }

  if (!position) return null;

  const date = new Date(position.timestamp * 1000);
  const formattedDate = date.toLocaleString("es-MX", {
    dateStyle: "medium",
    timeStyle: "medium",
  });

  return (
    <Container className="space-y-8">
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <Subtitle variant="h4">Posición Actual</Subtitle>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6  rounded-xl border border-indigo-200 shadow-sm hover:shadow-md transition-shadow">
            <Paragraph size="sm" className="text-indigo-600 font-semibold mb-2">
              Latitud
            </Paragraph>
            <div className="text-4xl font-bold tracking-tight">
              <span ref={latRef}>{position.latitude.toFixed(4)}°</span>
            </div>
          </div>

          <div className="p-6  rounded-xl border border-indigo-200 shadow-sm hover:shadow-md transition-shadow">
            <Paragraph size="sm" className="text-indigo-600 font-semibold mb-2">
              Longitud
            </Paragraph>
            <div className="text-4xl font-bold tracking-tight">
              <span ref={lonRef}>{position.longitude.toFixed(4)}°</span>
            </div>
          </div>

          <div className="p-6 rounded-xl border border-green-200 shadow-sm hover:shadow-md transition-shadow">
            <Paragraph size="sm" className="text-green-600 font-semibold mb-2">
              Altitud
            </Paragraph>
            <div className="text-4xl font-bold tracking-tight">
              <span ref={altRef}>{position.altitude.toFixed(0)} km</span>
            </div>
          </div>

          <div className="p-6  rounded-xl border border-yellow-200 shadow-sm hover:shadow-md transition-shadow">
            <Paragraph size="sm" className="text-yellow-600 font-semibold mb-2">
              Velocidad
            </Paragraph>
            <div className="text-4xl font-bold tracking-tight">
              <span ref={velRef}>{position.velocity.toFixed(0)} km/h</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-stone-100 rounded-lg border border-stone-200">
          <Paragraph size="sm" className="text-stone-500 text-center mb-1">
            Última actualización
          </Paragraph>
          <Paragraph size="base" className="font-medium text-center">
            {formattedDate}
          </Paragraph>
        </div>

        <Paragraph size="sm" align="center" className="text-stone-500">
          Próxima actualización en{" "}
          <span className="font-semibold text-indigo-600">{countdown}</span>{" "}
          segundo{countdown !== 1 ? "s" : ""}
        </Paragraph>
      </section>
    </Container>
  );
};

export default ISSTrackerComponent;
