import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { BasePlanet } from "./planets/base";
import SolarSystemLoading from "./solar-system-loader";

interface SolarSystemProps {
  onPlanetClick?: (name: string, info: string, position: THREE.Vector3) => void;
  scale?: number;
  selectedPlanetName?: string | null;
  isLoadingBodies?: boolean;
}

interface CameraControlRef {
  target: THREE.Vector3;
}

const CameraController = ({
  targetPosition,
  cameraRef,
  orbitControlsRef,
  selectedPlanetName,
  planetsData,
}: {
  targetPosition: THREE.Vector3 | null;
  cameraRef: React.MutableRefObject<THREE.PerspectiveCamera>;
  orbitControlsRef: React.MutableRefObject<any>;
  selectedPlanetName?: string | null;
  planetsData: any[];
}) => {
  useFrame((state) => {
    if (cameraRef.current && orbitControlsRef.current) {
      const camera = cameraRef.current;
      const controls = orbitControlsRef.current;

      if (!selectedPlanetName) {
        const targetLerp = 0.08;
        controls.target.lerp(new THREE.Vector3(0, 0, 0), targetLerp);
        controls.minDistance = 3.5;
        controls.update();
        return;
      }

      const selectedPlanet = planetsData.find(
        (p) => p.name === selectedPlanetName
      );

      if (selectedPlanet) {
        let followPosition = new THREE.Vector3(0, 0, 0);

        if (selectedPlanet.orbitRadius > 0) {
          const time = state.clock.elapsedTime;
          const angle =
            time * selectedPlanet.orbitSpeed + selectedPlanet.orbitOffset;
          followPosition.x = Math.cos(angle) * selectedPlanet.orbitRadius;
          followPosition.z = Math.sin(angle) * selectedPlanet.orbitRadius;
        }

        const targetLerp = 0.08;
        controls.target.lerp(followPosition, targetLerp);

        const baseDistance = 5;
        const sizeMultiplier = Math.max(0.3, 2.5 - selectedPlanet.size * 0.8);
        const targetDistance = baseDistance * sizeMultiplier;

        const minDistanceDynamic = Math.max(
          selectedPlanet.size * 1.5 + 0.5,
          1.2
        );
        controls.minDistance = minDistanceDynamic;

        const currentDistance = camera.position.distanceTo(controls.target);
        const newDistance = THREE.MathUtils.lerp(
          currentDistance,
          targetDistance,
          0.05
        );

        const direction = camera.position
          .clone()
          .sub(controls.target)
          .normalize();
        camera.position.copy(
          direction.multiplyScalar(newDistance).add(controls.target)
        );

        controls.update();
      }
    }
  });

  return null;
};

const SolarSystem = ({
  onPlanetClick,
  scale = 1,
  selectedPlanetName,
  isLoadingBodies = false,
}: SolarSystemProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showLabels, setShowLabels] = useState(false);
  const [cameraPosition, setCameraPosition] = useState<
    [number, number, number]
  >([25 * scale, 10 * scale, 25 * scale]);
  const [targetPlanetPosition, setTargetPlanetPosition] =
    useState<THREE.Vector3 | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const orbitControlsRef = useRef<any>(null);
  const canvasRef = useRef<THREE.Camera>(null!);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null!);

  const sunPosition = useMemo(() => new THREE.Vector3(0, 0, 0), []);

  const planetsData = useMemo(
    () => [
      {
        name: "Sun",
        texturePath: "/textures/solar-system/sun.jpg",
        size: 0.5,
        hasAtmosphere: false,
        atmosphereDayColor: "#ffff00",
        atmosphereTwilightColor: "#ff8800",
        atmosphereStrength: 0,
        rotationSpeed: 0.001,
        orbitSpeed: 0,
        orbitRadius: 0,
        orbitOffset: 0,
        info: "El Sol es la estrella central de nuestro Sistema Solar. Es una esfera de plasma caliente que proporciona luz y calor a todos los planetas. Su masa representa el 99.86% de la masa total del Sistema Solar.",
        isSun: true,
      },
      {
        name: "Mercury",
        texturePath: "/textures/solar-system/mercury.jpg",
        size: 0.4,
        hasAtmosphere: true,
        atmosphereDayColor: "#cccccc",
        atmosphereTwilightColor: "#999999",
        atmosphereStrength: 0.1,
        rotationSpeed: 0.002,
        orbitSpeed: 0.047,
        orbitRadius: 4.5,
        orbitOffset: 0,
        info: "Mercurio es el planeta más pequeño y cercano al Sol. Su superficie está cubierta de cráteres y experimenta temperaturas desde -173°C hasta 427°C.",
      },
      {
        name: "Venus",
        texturePath: "/textures/solar-system/venus.jpg",
        size: 0.75,
        hasAtmosphere: true,
        atmosphereDayColor: "#ffdd88",
        atmosphereTwilightColor: "#ff8844",
        atmosphereStrength: 0.45,
        rotationSpeed: 0.001,
        orbitSpeed: 0.035,
        orbitRadius: 7,
        orbitOffset: 1.2,
        info: "Venus tiene una atmósfera densa de CO₂ con nubes de ácido sulfúrico. Es el planeta más caliente del Sistema Solar con 462°C en superficie debido al efecto invernadero extremo.",
      },
      {
        name: "Earth",
        texturePath: "/textures/solar-system/earth.jpg",
        size: 0.8,
        hasAtmosphere: true,
        atmosphereDayColor: "#66aaff",
        atmosphereTwilightColor: "#1144ff",
        atmosphereStrength: 0.5,
        rotationSpeed: 0.002,
        orbitSpeed: 0.03,
        orbitRadius: 9.5,
        orbitOffset: 2.5,
        info: "La Tierra es el único planeta conocido con vida. El 71% de su superficie está cubierta de agua líquida. Tiene una atmósfera rica en nitrógeno y oxígeno que protege la vida.",
      },
      {
        name: "Mars",
        texturePath: "/textures/solar-system/mars.jpg",
        size: 0.45,
        hasAtmosphere: true,
        atmosphereDayColor: "#ff8844",
        atmosphereTwilightColor: "#ff4422",
        atmosphereStrength: 0.28,
        rotationSpeed: 0.003,
        orbitSpeed: 0.024,
        orbitRadius: 12,
        orbitOffset: 4.1,
        info: "Marte, el planeta rojo, tiene los volcanes más grandes del Sistema Solar (Monte Olimpo) y evidencia de agua líquida antigua. Tiene dos lunas: Fobos y Deimos.",
      },
      {
        name: "Jupiter",
        texturePath: "/textures/solar-system/jupiter.jpg",
        size: 1.6,
        hasAtmosphere: true,
        atmosphereDayColor: "#ffcc88",
        atmosphereTwilightColor: "#cc8844",
        atmosphereStrength: 0.38,
        rotationSpeed: 0.004,
        orbitSpeed: 0.013,
        orbitRadius: 16,
        orbitOffset: 0.8,
        info: "Júpiter es el planeta más grande del Sistema Solar. Su Gran Mancha Roja es una tormenta anticiclónica más grande que la Tierra que ha durado al menos 350 años.",
      },
      {
        name: "Saturn",
        texturePath: "/textures/solar-system/saturn.jpg",
        size: 1.4,
        hasAtmosphere: true,
        hasRings: true,
        atmosphereDayColor: "#ffdd99",
        atmosphereTwilightColor: "#ddaa66",
        atmosphereStrength: 0.32,
        rotationSpeed: 0.003,
        orbitSpeed: 0.009,
        orbitRadius: 20,
        orbitOffset: 2.3,
        info: "Saturno es famoso por sus espectaculares anillos compuestos principalmente de partículas de hielo y roca. Es el planeta menos denso, podría flotar en agua.",
      },
      {
        name: "Uranus",
        texturePath: "/textures/solar-system/uranus.jpg",
        size: 1.1,
        hasAtmosphere: true,
        atmosphereDayColor: "#88ccff",
        atmosphereTwilightColor: "#66aaff",
        atmosphereStrength: 0.36,
        rotationSpeed: 0.003,
        orbitSpeed: 0.006,
        orbitRadius: 24,
        orbitOffset: 3.9,
        info: "Urano rota de lado con un eje de inclinación de 98°. Su atmósfera contiene metano que le da su característico color azul verdoso.",
      },
      {
        name: "Neptune",
        texturePath: "/textures/solar-system/neptune.jpg",
        size: 1.05,
        hasAtmosphere: true,
        atmosphereDayColor: "#4488ff",
        atmosphereTwilightColor: "#2244aa",
        atmosphereStrength: 0.4,
        rotationSpeed: 0.003,
        orbitSpeed: 0.005,
        orbitRadius: 28,
        orbitOffset: 5.1,
        info: "Neptuno tiene los vientos más rápidos del Sistema Solar, alcanzando velocidades de hasta 2,100 km/h. Es el planeta más alejado del Sol desde que Plutón fue reclasificado.",
      },
    ],
    []
  );

  useEffect(() => {
    const updateCameraPosition = () => {
      const width = window.innerWidth;
      if (width < 640) setCameraPosition([32 * scale, 18 * scale, 32 * scale]);
      else if (width < 1024)
        setCameraPosition([28 * scale, 11 * scale, 28 * scale]);
      else if (width < 1536)
        setCameraPosition([26 * scale, 10 * scale, 26 * scale]);
      else setCameraPosition([25 * scale, 10 * scale, 25 * scale]);
    };

    updateCameraPosition();
    window.addEventListener("resize", updateCameraPosition);
    return () => window.removeEventListener("resize", updateCameraPosition);
  }, [scale]);

  useEffect(() => {
    // Si los datos todavía se están cargando, esperar a que terminen
    if (isLoadingBodies) {
      setIsLoaded(false);
      return;
    }

    // Una vez que los datos están listos, esperar 1 segundo antes de mostrar
    const timer = setTimeout(() => setIsLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, [isLoadingBodies]);

  useEffect(() => {
    if (isLoaded && overlayRef.current) {
      overlayRef.current.style.opacity = "0";
      setTimeout(() => {
        if (overlayRef.current) overlayRef.current.style.display = "none";
      }, 1000);
    }
  }, [isLoaded]);

  const handlePlanetClick = (
    name: string,
    info: string,
    position: THREE.Vector3
  ) => {
    setTargetPlanetPosition(position.clone());

    if (onPlanetClick) {
      onPlanetClick(name, info, position);
    }
  };

  return (
    <>
      <div
        ref={overlayRef}
        className="absolute inset-0 w-full h-full bg-black z-10 transition-opacity duration-1000 flex items-center justify-center"
      >
        <SolarSystemLoading />
      </div>

      <div className="absolute inset-0 w-full h-full">
        <Canvas
          className="w-full h-full"
          camera={{ position: cameraPosition, fov: 45 }}
          gl={{ antialias: true, alpha: false }}
          onCreated={(state) => {
            cameraRef.current = state.camera as THREE.PerspectiveCamera;
          }}
        >
          <ambientLight intensity={3} />

          <CameraController
            targetPosition={targetPlanetPosition}
            cameraRef={cameraRef}
            orbitControlsRef={orbitControlsRef}
            selectedPlanetName={selectedPlanetName}
            planetsData={planetsData}
          />

          <OrbitControls
            ref={orbitControlsRef}
            minDistance={3.5}
            maxDistance={35}
            enablePan={false}
            maxPolarAngle={Math.PI / 1.8}
            minPolarAngle={Math.PI / 6}
          />

          {/* Sol en el centro */}
          <pointLight
            position={[0, 0, 0]}
            intensity={8}
            distance={200}
            decay={2}
            color="#fff8b0"
          />

          <Stars />

          {planetsData.map((planet) => (
            <BasePlanet
              key={planet.name}
              name={planet.name}
              texturePath={planet.texturePath}
              size={planet.size}
              sunPosition={sunPosition}
              atmosphereDayColor={planet.atmosphereDayColor}
              atmosphereTwilightColor={planet.atmosphereTwilightColor}
              hasAtmosphere={planet.hasAtmosphere}
              atmosphereStrength={planet.atmosphereStrength}
              rotationSpeed={planet.rotationSpeed}
              orbitSpeed={planet.orbitSpeed}
              orbitRadius={planet.orbitRadius}
              orbitOffset={planet.orbitOffset}
              hasRings={planet.hasRings}
              info={planet.info}
              showLabel={showLabels}
              onPlanetClick={handlePlanetClick}
              isSun={planet.isSun}
            />
          ))}
        </Canvas>
      </div>
    </>
  );
};

const Stars = () => {
  const starsRef = useRef<THREE.Points>(null!);

  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(15000);
    const colors = new Float32Array(15000);

    for (let i = 0; i < 5000; i++) {
      const i3 = i * 3;
      const radius = 100 + Math.random() * 100;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      const color = Math.random();
      colors[i3] = color > 0.8 ? 0.8 + Math.random() * 0.2 : 1;
      colors[i3 + 1] = color > 0.8 ? 0.9 + Math.random() * 0.1 : 1;
      colors[i3 + 2] = 1;
    }

    return [positions, colors];
  }, []);

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.08} vertexColors sizeAttenuation />
    </points>
  );
};

export default SolarSystem;
