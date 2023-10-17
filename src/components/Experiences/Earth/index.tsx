import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  DoubleSide,
  Group,
  Light,
  Mesh,
  MeshStandardMaterial,
  MathUtils,
} from "three";
import useGame from "../../../Stores/useGame";
import { experienceProperties } from "../../../Stores/constants";

import { Loader } from "@react-three/drei";

import vertexShader from "./shaders/vertexShader";
import fragmentShader from "./shaders/fragmentShader";

const EARTH_RADIUS = 6;

export const Earth = () => {
  const ref = useRef<Mesh | null>(null);
  const groupRef = useRef<Group | null>(null);
  const lightRef = useRef<THREE.DirectionalLight | null>(null);
  const cloudsRef = useRef<THREE.Mesh | null>(null);

  const game = useGame((s) => s.game);

  return (
    <group position={experienceProperties[game]?.gamePosition}>
      {/* <directionalLight ref={lightRef} intensity={3} position={[0, 0, 90]} /> */}

      <Planet />
    </group>
  );
};

const Planet = () => {
  // This reference will give us direct access to the mesh
  const ref = useRef<Mesh | null>(null);
  const [hover, setHover] = useState(false);

  const uniforms = useMemo(
    () => ({
      u_intensity: {
        value: 0.3,
      },
      u_time: {
        value: 0.0,
      },
      u_color: {
        value: 0.0,
      },
    }),
    []
  );

  useFrame((state) => {
    const { clock } = state;
    if (ref?.current) {
      ref.current.material.uniforms.u_time.value = 0.2 * clock.getElapsedTime();

      ref.current.material.uniforms.u_intensity.value = MathUtils.lerp(
        ref.current.material.uniforms.u_intensity.value,
        hover ? 0.95 : 0.25,
        0.3
      );

      ref.current.material.uniforms.u_color.value = MathUtils.lerp(
        ref.current.material.uniforms.u_color.value,
        hover ? 2 : 1,
        0.3
      );
    }
  });

  return (
    <mesh
      ref={ref}
      position={[0, 0, 0]}
      scale={4}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <icosahedronGeometry args={[2, 20]} />
      <shaderMaterial
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms}
        wireframe={false}
      />
    </mesh>
  );
};
