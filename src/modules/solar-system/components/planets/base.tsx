import React, { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

const planetVertexShader = `
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vWorldPosition;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewMatrix * modelPosition;
    vec3 modelNormal = (modelMatrix * vec4(normal, 0.0)).xyz;
    
    vUv = uv;
    vNormal = normalize(modelNormal);
    vPosition = modelPosition.xyz;
    vWorldPosition = modelPosition.xyz;
}
`;

const planetFragmentShader = `
uniform sampler2D uSurfaceTexture;
uniform vec3 uSunPosition;
uniform vec3 uAtmosphereDayColor;
uniform vec3 uAtmosphereTwilightColor;
uniform bool uHasAtmosphere;
uniform float uAtmosphereStrength;
uniform bool uIsSun;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vWorldPosition;

void main() {
    vec3 viewDirection = normalize(vPosition - cameraPosition);
    vec3 normal = normalize(vNormal);
    
    vec3 color = texture2D(uSurfaceTexture, vUv).rgb;
    
    if (uIsSun) {
        color = color * 2.5 + vec3(0.3, 0.2, 0.0);
        gl_FragColor = vec4(color, 1.0);
        return;
    }
    
    vec3 lightDir = normalize(uSunPosition - vWorldPosition);
    float sunOrientation = dot(lightDir, normal);
    
    float diffuse = max(sunOrientation, 0.0);
    
    float ambient = 0.20;
    
    float distance = length(uSunPosition - vWorldPosition);
    float attenuation = 1.0 / (1.0 + 0.004 * distance);
    
    float lighting = (diffuse * attenuation + ambient);
    color *= lighting;
    
    // Mejor soporte para atmósfera en el shader del planeta
    if (uHasAtmosphere) {
        float fresnel = 1.0 - abs(dot(viewDirection, normal));
        fresnel = pow(fresnel, 2.5);
        
        float atmosphereDayMix = smoothstep(-0.5, 1.0, sunOrientation);
        vec3 atmosphereColor = mix(uAtmosphereTwilightColor, uAtmosphereDayColor, atmosphereDayMix);
        
        // Atmósfera más visible en los bordes
        color = mix(color, atmosphereColor, fresnel * 0.4);
    }
    
    gl_FragColor = vec4(color, 1.0);
}
`;

const atmosphereVertexShader = `
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vWorldPosition;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewMatrix * modelPosition;
    vec3 modelNormal = (modelMatrix * vec4(normal, 0.0)).xyz;
    
    vNormal = normalize(modelNormal);
    vPosition = modelPosition.xyz;
    vWorldPosition = modelPosition.xyz;
}
`;

const atmosphereFragmentShader = `
uniform vec3 uSunPosition;
uniform vec3 uAtmosphereDayColor;
uniform vec3 uAtmosphereTwilightColor;

varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vWorldPosition;

void main() {
    vec3 viewDirection = normalize(vPosition - cameraPosition);
    vec3 normal = normalize(vNormal);
    
    vec3 lightDir = normalize(uSunPosition - vWorldPosition);
    float sunOrientation = dot(lightDir, normal);
    
    // Color según la posición del sol
    float atmosphereDayMix = smoothstep(-0.8, 0.8, sunOrientation);
    vec3 atmosphereColor = mix(uAtmosphereTwilightColor, uAtmosphereDayColor, atmosphereDayMix);
    
    // Fresnel más fuerte para mayor visibilidad
    float fresnel = 1.0 - abs(dot(viewDirection, normal));
    fresnel = pow(fresnel, 2.0);
    
    // Edge glow más visible
    float edgeAlpha = abs(dot(viewDirection, normal));
    edgeAlpha = smoothstep(0.0, 0.5, edgeAlpha);
    
    // Day alpha con transición más suave
    float dayAlpha = smoothstep(-0.8, 0.5, sunOrientation);
    
    // Atmósfera más intensa
    float alpha = dayAlpha * edgeAlpha * fresnel * 0.95;
    
    gl_FragColor = vec4(atmosphereColor, alpha);
}
`;

interface BasePlanetProps {
  name: string;
  texturePath: string;
  size?: number;
  sunPosition: THREE.Vector3;
  atmosphereDayColor?: string;
  atmosphereTwilightColor?: string;
  hasAtmosphere?: boolean;
  atmosphereScale?: number;
  atmosphereStrength?: number;
  rotationSpeed?: number;
  orbitSpeed?: number;
  orbitRadius?: number;
  orbitOffset?: number;
  position?: [number, number, number];
  isSun?: boolean;
  hasRings?: boolean;
  info?: string;
  showLabel?: boolean;
  onPlanetClick?: (name: string, info: string, position: THREE.Vector3) => void;
}

export const BasePlanet: React.FC<BasePlanetProps> = ({
  name,
  texturePath,
  size = 2,
  sunPosition,
  atmosphereDayColor = "#00aaff",
  atmosphereTwilightColor = "#ff6600",
  hasAtmosphere = false,
  atmosphereScale = 1.08,
  atmosphereStrength = 0.3,
  rotationSpeed = 0.05,
  orbitSpeed = 0,
  orbitRadius = 0,
  orbitOffset = 0,
  position = [0, 0, 0],
  isSun = false,
  hasRings = false,
  info = "",
  showLabel = false,
  onPlanetClick,
}) => {
  const groupRef = useRef<THREE.Group>(null!);
  const planetRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = React.useState(false);

  const texture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const tex = loader.load(texturePath);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 16;
    return tex;
  }, [texturePath]);

  const atmosphereColors = useMemo(
    () => ({
      day: new THREE.Color(atmosphereDayColor),
      twilight: new THREE.Color(atmosphereTwilightColor),
    }),
    [atmosphereDayColor, atmosphereTwilightColor]
  );

  const planetUniforms = useMemo(
    () => ({
      uSurfaceTexture: { value: texture },
      uSunPosition: { value: sunPosition },
      uAtmosphereDayColor: { value: atmosphereColors.day },
      uAtmosphereTwilightColor: { value: atmosphereColors.twilight },
      uHasAtmosphere: { value: hasAtmosphere },
      uAtmosphereStrength: { value: atmosphereStrength },
      uIsSun: { value: isSun },
    }),
    [
      texture,
      sunPosition,
      atmosphereColors,
      hasAtmosphere,
      atmosphereStrength,
      isSun,
    ]
  );

  const atmosphereUniforms = useMemo(
    () => ({
      uSunPosition: { value: sunPosition },
      uAtmosphereDayColor: { value: atmosphereColors.day },
      uAtmosphereTwilightColor: { value: atmosphereColors.twilight },
    }),
    [sunPosition, atmosphereColors]
  );

  useFrame((state) => {
    if (groupRef.current && orbitSpeed > 0) {
      const angle = state.clock.elapsedTime * orbitSpeed + orbitOffset;
      groupRef.current.position.x = Math.cos(angle) * orbitRadius;
      groupRef.current.position.z = Math.sin(angle) * orbitRadius;
    }

    if (planetRef.current && rotationSpeed > 0) {
      const deltaTime = state.clock.getDelta();
      planetRef.current.rotation.y += rotationSpeed * deltaTime;
    }
  });

  useEffect(() => {
    if (onPlanetClick) {
      document.body.style.cursor = hovered ? "pointer" : "auto";
    }
  }, [hovered, onPlanetClick]);

  const handleClick = () => {
    if (onPlanetClick && info && groupRef.current) {
      const position = new THREE.Vector3();
      groupRef.current.getWorldPosition(position);
      onPlanetClick(name, info, position);
    }
  };

  return (
    <group ref={groupRef} position={position}>
      {isSun && (
        <pointLight
          position={[0, 0, 0]}
          intensity={5}
          distance={150}
          decay={2}
          color="#fff8b0"
        />
      )}

      <mesh
        ref={planetRef}
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[size, 64, 64]} />
        <shaderMaterial
          vertexShader={planetVertexShader}
          fragmentShader={planetFragmentShader}
          uniforms={planetUniforms}
        />
      </mesh>

      {hasAtmosphere && !isSun && (
        <mesh scale={atmosphereScale}>
          <sphereGeometry args={[size, 64, 64]} />
          <shaderMaterial
            vertexShader={atmosphereVertexShader}
            fragmentShader={atmosphereFragmentShader}
            uniforms={atmosphereUniforms}
            side={THREE.BackSide}
            transparent
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      )}

      {hasRings && (
        <mesh rotation={[Math.PI / 2.5, 0, 0]}>
          <ringGeometry args={[size * 1.5, size * 2.3, 64]} />
          <meshStandardMaterial
            color="#d4c4a8"
            side={THREE.DoubleSide}
            transparent
            opacity={0.8}
            roughness={0.8}
            metalness={0.2}
          />
        </mesh>
      )}

      {showLabel && (
        <Html
          position={[0, size + 0.5, 0]}
          center
          distanceFactor={8}
          style={{
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          <div className="bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap backdrop-blur-sm border border-white/20">
            {name}
          </div>
        </Html>
      )}
    </group>
  );
};
