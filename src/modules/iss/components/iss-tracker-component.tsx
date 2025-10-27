"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import getISSPosition from "@/actions/iss/get-iss-position";
import IssTrackerLoading from "./iss-tracker-loading";
import gsap from "gsap";
import Experience from "./experience";

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
    queryFn: () => getISSPosition({ queryKey: ["iss-position"] }),
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev <= 1 ? 5 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!position) return;
    const tweenObj = {
      latitude: displayValues.latitude,
      longitude: displayValues.longitude,
      altitude: displayValues.altitude,
      velocity: displayValues.velocity,
    };

    gsap.to(tweenObj, {
      latitude: position.latitude,
      longitude: position.longitude,
      altitude: position.altitude,
      velocity: position.velocity,
      duration: 5.5,
      ease: "power1.out",
      onUpdate: () => {
        setDisplayValues({
          latitude: tweenObj.latitude,
          longitude: tweenObj.longitude,
          altitude: tweenObj.altitude,
          velocity: tweenObj.velocity,
        });
      },
    });

    [latRef, lonRef, altRef, velRef].forEach((ref) => {
      if (ref.current) {
        gsap.fromTo(
          ref.current,
          { scale: 1 },
          { scale: 1.06, duration: 0.25, yoyo: true, repeat: 1 }
        );
      }
    });

    setCountdown(5);
  }, [position]);

  if (isLoading) return <IssTrackerLoading />;

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-indigo-500 text-center">
          <p>Error al cargar datos</p>
          <button
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 bg-blue-600 rounded"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!position) return null;

  return (
    <div className="relative w-full h-screen min-h-screen ">
      <div className="absolute inset-0">
        <Experience
          issPosition={{
            latitude: displayValues.latitude,
            longitude: displayValues.longitude,
            altitude: displayValues.altitude,
          }}
        />
      </div>
    </div>
  );
};

export default ISSTrackerComponent;
