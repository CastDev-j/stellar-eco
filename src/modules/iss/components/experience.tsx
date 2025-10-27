"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { Html, OrbitControls } from "@react-three/drei";

interface ISSPosition {
  latitude: number;
  longitude: number;
  altitude?: number;
}

const latLonToVector3 = (lat: number, lon: number, radius: number) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
};

const ISSMarker = ({ latitude, longitude, altitude = 420 }: ISSPosition) => {
  const issRef = useRef<THREE.Group>(null!);
  const currentPosition = useRef(new THREE.Vector3());
  const earthRadius = 1.5;
  const orbitRadius = earthRadius + (altitude / 6371) * earthRadius;

  useEffect(() => {
    const newPosition = latLonToVector3(latitude, longitude, orbitRadius);
    currentPosition.current.copy(newPosition);
  }, [latitude, longitude, altitude, orbitRadius]);

  useFrame(() => {
    if (issRef.current) {
      issRef.current.position.copy(currentPosition.current);
      issRef.current.lookAt(0, 0, 0);
    }
  });

  return (
    <>
      <group ref={issRef}>
        <Html distanceFactor={6} center transform>
          <div className="relative">
            <div className="size-1 bg-transparent rounded-full outline-2 outline-indigo-500"></div>
          </div>
        </Html>
        <Html distanceFactor={2} center position={[-0.05, 0.175, 0.05]}>
          <div className="relative">
            <div className="absolute text-white text-xs bg-indigo-500 bg-opacity-75 px-2 py-1 rounded shadow-lg w-32 flex flex-col gap-1">
              <p className="flex items-center">Lat: {latitude.toFixed(2)}</p>
              <p className="flex items-center">Lon: {longitude.toFixed(2)}</p>
              <p className="flex items-center">Alt: {altitude.toFixed(2)} km</p>
            </div>
          </div>
        </Html>
      </group>
    </>
  );
};

const CameraRig = ({ issPosition }: { issPosition?: ISSPosition }) => {
  const { camera } = useThree();
  const hasCompleted = useRef(false);
  const [baseDistance, setBaseDistance] = useState(2.5);
  const [baseHeight, setBaseHeight] = useState(1.2);

  useEffect(() => {
    const updateCameraSettings = () => {
      const width = window.innerWidth;

      if (width < 640) {
        setBaseDistance(5.5);
        setBaseHeight(2.8);
      } else if (width < 1024) {
        setBaseDistance(5.0);
        setBaseHeight(2.5);
      } else if (width < 1536) {
        setBaseDistance(4.7);
        setBaseHeight(2.3);
      } else {
        setBaseDistance(4.5);
        setBaseHeight(2.2);
      }
    };

    updateCameraSettings();

    window.addEventListener("resize", updateCameraSettings);

    return () => window.removeEventListener("resize", updateCameraSettings);
  }, []);

  useFrame(({ clock }) => {
    if (!issPosition || hasCompleted.current) return;

    const earthRadius = 1.5;
    const orbitRadius =
      earthRadius + ((issPosition.altitude ?? 420) / 6371) * earthRadius;
    const issVec = latLonToVector3(
      issPosition.latitude,
      issPosition.longitude,
      orbitRadius
    );

    const desired = issVec
      .clone()
      .normalize()
      .multiplyScalar(orbitRadius + baseDistance);
    desired.y += baseHeight;

    camera.position.lerp(desired, 0.02);

    const lookAtTarget = new THREE.Vector3();
    lookAtTarget.lerp(issVec, 0.02);
    camera.lookAt(lookAtTarget);

    if (clock.elapsedTime > 3) {
      hasCompleted.current = true;
    }
  });

  return null;
};

const Earth = () => {
  const earthRef = useRef<THREE.Mesh>(null!);
  const materialRef = useRef<THREE.ShaderMaterial>(null!);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const darkColor = "#0c0a09";
  const lightColor = "#ffffff";
  const darkThreshold = 0.2;
  const lightThreshold = 0.8;

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(
      "/textures/simple-earth/planet-texture.jpg",
      (loadedTexture) => {
        loadedTexture.colorSpace = THREE.SRGBColorSpace;
        loadedTexture.wrapS = THREE.ClampToEdgeWrapping;
        loadedTexture.wrapT = THREE.ClampToEdgeWrapping;
        loadedTexture.anisotropy = 4;
        loadedTexture.minFilter = THREE.LinearFilter;
        loadedTexture.magFilter = THREE.LinearFilter;
        loadedTexture.needsUpdate = true;
        setTexture(loadedTexture);
        setIsLoading(false);
      },
      undefined,
      (error) => {
        console.error("Error cargando textura:", error);
        setIsLoading(false);
      }
    );
  }, []);

  const vertexShader = `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    
    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = -mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  const fragmentShader = `
    uniform sampler2D map;
    uniform vec3 darkColor;
    uniform vec3 lightColor;
    uniform float darkThreshold;
    uniform float lightThreshold;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    
    void main() {
      vec4 texColor = texture2D(map, vUv);
      
      float brightness = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));
      
      vec3 finalColor = texColor.rgb;
      
      if (brightness < darkThreshold) {
        finalColor = darkColor;
      }
      else if (brightness > lightThreshold) {
        finalColor = lightColor;
      }
      
      vec3 viewDir = normalize(vViewPosition);
      float fresnel = 1.0 - abs(dot(vNormal, viewDir));
      fresnel = pow(fresnel, 3.5);
      
      vec3 rimColor = vec3(0.5, 0.5, 0.5);
      float rimIntensity = 0.3;
      
      finalColor = mix(finalColor, rimColor, fresnel * rimIntensity);
      
      gl_FragColor = vec4(finalColor, texColor.a);
    }
  `;

  return (
    <mesh ref={earthRef}>
      <sphereGeometry args={[1.5, 64, 64]} />
      {texture ? (
        <shaderMaterial
          ref={materialRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={{
            map: { value: texture },
            darkColor: { value: new THREE.Color(darkColor) },
            lightColor: { value: new THREE.Color(lightColor) },
            darkThreshold: { value: darkThreshold },
            lightThreshold: { value: lightThreshold },
          }}
          toneMapped={false}
        />
      ) : (
        <meshBasicMaterial color={darkColor} />
      )}
    </mesh>
  );
};

const Experience = ({ issPosition }: { issPosition?: ISSPosition }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [cameraPosition, setCameraPosition] = useState<
    [number, number, number]
  >([6, 3, 6]);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateCameraPosition = () => {
      const width = window.innerWidth;

      if (width < 640) {
        setCameraPosition([8, 4, 8]);
      } else if (width < 1024) {
        setCameraPosition([7, 3.5, 7]);
      } else if (width < 1536) {
        setCameraPosition([6.5, 3, 6.5]);
      } else {
        setCameraPosition([6, 3, 6]);
      }
    };

    updateCameraPosition();

    window.addEventListener("resize", updateCameraPosition);

    return () => window.removeEventListener("resize", updateCameraPosition);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isLoaded && overlayRef.current) {
      overlayRef.current.style.opacity = "0";
      setTimeout(() => {
        if (overlayRef.current) overlayRef.current.style.display = "none";
      }, 1000);
    }
  }, [isLoaded]);

  return (
    <>
      <div
        ref={overlayRef}
        className="absolute inset-0 w-full h-full bg-black z-10 transition-opacity duration-1000"
      />
      <div className="absolute inset-0 w-full h-full">
        <Canvas
          className="w-full h-full"
          camera={{ position: cameraPosition, fov: 45 }}
          gl={{ antialias: true }}
        >
          <OrbitControls minDistance={4} maxDistance={10} enablePan={false} />
          <Earth />
          {issPosition && <ISSMarker {...issPosition} />}
          {issPosition && <CameraRig issPosition={issPosition} />}
        </Canvas>
      </div>
    </>
  );
};

export default Experience;
