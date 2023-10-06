import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { DoubleSide, Group, Light, Mesh, MeshStandardMaterial } from "three";
import useGame from "../../../Stores/useGame";
import { experienceProperties } from "../../../Stores/constants";

import { Loader } from "@react-three/drei";

const EARTH_RADIUS = 6;

export const Earth = () => {
  const ref = useRef<Mesh | null>(null);
  const groupRef = useRef<Group | null>(null);
  const lightRef = useRef<THREE.DirectionalLight | null>(null);
  const cloudsRef = useRef<THREE.Mesh | null>(null);

  const game = useGame((s) => s.game);

  return (
    <group position={experienceProperties[game]?.gamePosition}>
      <directionalLight ref={lightRef} intensity={3} position={[0, 0, 90]} />

      <group ref={groupRef}>
        <mesh ref={ref} userData={{ type: "earth" }}>
          <sphereGeometry args={[EARTH_RADIUS, 200, 200]} />
          <EarthMaterial />
        </mesh>

        <mesh ref={cloudsRef}>
          <sphereGeometry args={[EARTH_RADIUS + 0.1, 200, 200]} />
          <meshStandardMaterial transparent />
        </mesh>

        <mesh>
          <sphereGeometry args={[EARTH_RADIUS * 30, 200, 200]} />
          <meshStandardMaterial opacity={0.4} side={DoubleSide} transparent />
        </mesh>
      </group>

      {/* {data?.links.map((link, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <CurvedLine key={`curved-${i}`} link={link} />
      ))} */}
    </group>
  );
};

const EarthMaterial = () => {
  // Create the material
  const material = useMemo(
    () =>
      new MeshStandardMaterial({
        toneMapped: true,
        roughness: 16, // Adjust roughness as needed
        metalness: 0, // Adjust metalness as needed
      }),
    []
  );

  return <meshStandardMaterial {...material} />;
};
