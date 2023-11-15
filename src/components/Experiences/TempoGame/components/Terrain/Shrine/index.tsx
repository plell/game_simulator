import { RigidBody } from "@react-three/rapier";
import useGame from "../../../Stores/useGame";
import { useEffect, useRef } from "react";
import { ConeGeometry, Mesh, MeshStandardMaterial } from "three";
import { useFrame } from "@react-three/fiber";

const shrineGeo = new ConeGeometry();
const material = new MeshStandardMaterial({
  emissiveIntensity: 2,
  emissive: "#9d3d3a",
});

export const Shrine = () => {
  const worldTile = useGame((s) => s.worldTile);
  const { shrine } = worldTile;

  const ref = useRef<Mesh | null>(null);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.z += 2 * delta;
      ref.current.rotation.x += 1 * delta;
      ref.current.rotation.y -= 1 * delta;
    }
  });

  useEffect(() => {
    if (material && shrine) {
      material.emissive.set(shrine.color);
    }
  }, [shrine]);

  if (!shrine) {
    return null;
  }

  return (
    <mesh
      position={shrine.position}
      position-z={8}
      ref={ref}
      geometry={shrineGeo}
      material={material}
    />
  );
};
