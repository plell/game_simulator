import { Plane } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { Mesh } from "three";

interface HealthBarProps {
  health: number;
}

export const HealthBar = ({ health }: HealthBarProps) => {
  const barWidth = 2;
  const barHeight = 0.4;
  const barColor = "red";
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
    <group position={[0, 0.9, 1.6]}>
      {/* Empty health bar */}
      <Plane args={[barWidth, barHeight]}>
        <meshStandardMaterial color='white' />
      </Plane>

      {/* Filled health bar */}
      <Plane ref={ref} args={[barWidth, barHeight]} position-z={0.02}>
        <meshStandardMaterial color={barColor} />
      </Plane>
    </group>
  );
};

export default HealthBar;
