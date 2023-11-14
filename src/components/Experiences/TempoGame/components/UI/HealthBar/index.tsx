import { Plane } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { Mesh, MeshBasicMaterial, PlaneGeometry } from "three";

interface HealthBarProps {
  health: number;
}

const barWidth = 1;
const barHeight = 0.2;

const planeGeo = new PlaneGeometry(barWidth, barHeight);
const whiteMaterial = new MeshBasicMaterial({ color: "white" });
const redMaterial = new MeshBasicMaterial({ color: "red" });

export const HealthBar = ({ health }: HealthBarProps) => {
  const ref = useRef<Mesh | null>(null);

  useEffect(() => {
    // Update the width of the health bar based on the health value
    const newScale = health / 100;

    if (ref.current) {
      // Only update the width if it's within valid range

      ref.current.scale.x = newScale;
    }
  }, [health]);

  return (
    <group position={[0, 0.9, 1]}>
      {/* Empty health bar */}
      <mesh geometry={planeGeo} material={whiteMaterial} />

      {/* Filled health bar */}
      <mesh
        ref={ref}
        geometry={planeGeo}
        material={redMaterial}
        position-z={0.02}
      />
    </group>
  );
};

export default HealthBar;
