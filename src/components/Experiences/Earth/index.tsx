import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { DoubleSide, Group, Light, Mesh, MeshStandardMaterial } from "three";
import useGame from "../../../Stores/useGame";
import { experienceProperties } from "../../../Stores/constants";
import {
  bumpMapTexture,
  cloudsMapTexture,
  earthMapTexture,
  galaxyMapTexture,
  waterMapTexture,
} from "../assets";
import { Loader } from "@react-three/drei";

const EARTH_RADIUS = 6;

export const Earth = () => {
  const ref = useRef<Mesh | null>(null);
  const groupRef = useRef<Group | null>(null);
  const lightRef = useRef<THREE.DirectionalLight | null>(null);
  const cloudsRef = useRef<THREE.Mesh | null>(null);

  const game = useGame((s) => s.game);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y -= 0.001;
      groupRef.current.rotation.x += 0.0009;
    }

    if (cloudsRef.current) {
      cloudsRef.current.rotation.z += 0.000008;
      cloudsRef.current.rotation.x += 0.000008;
      cloudsRef.current.rotation.y += 0.000008;
    }
  });

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
          <meshStandardMaterial
            alphaMap={cloudsMapTexture}
            map={cloudsMapTexture}
            transparent
          />
        </mesh>

        <mesh>
          <sphereGeometry args={[EARTH_RADIUS * 30, 200, 200]} />
          <meshStandardMaterial
            map={galaxyMapTexture}
            opacity={0.4}
            side={DoubleSide}
            transparent
          />
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
        map: earthMapTexture, // Earth color map
        bumpMap: bumpMapTexture, // Bump map for surface details
        aoMap: bumpMapTexture, // Ambient occlusion map for shading
        roughnessMap: bumpMapTexture, // Specular map for shininess
        metalnessMap: waterMapTexture,
        toneMapped: true,
        roughness: 16, // Adjust roughness as needed
        metalness: 0, // Adjust metalness as needed
      }),
    [earthMapTexture, bumpMapTexture, waterMapTexture]
  );

  return <meshStandardMaterial {...material} />;
};
