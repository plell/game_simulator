import { useFrame } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CylinderGeometry, Group, Vector3 } from "three";
import useGame from "../../../../../Stores/useGame";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";

type Props = {
  position: Vector3;
  delay: number;
  id: number;
};

const reuseableVec = new Vector3();
const reuseableVec2 = new Vector3();

const geometry = new CylinderGeometry(1, 1, 1);

export const Hammer = () => {
  const ref = useRef<Group | null>(null);

  useFrame(({ mouse, clock }) => {
    if (ref.current) {
      const elapsed = clock.getElapsedTime();

      const pos = ref.current.position;
      const destination = reuseableVec2.set(mouse.x * 10, pos.y, pos.z);
      pos.lerp(destination, 0.09);
    }
  });

  return (
    <group ref={ref} position={[0, 3, 4]} rotation-x={Math.PI * -0.25}>
      <group position-y={2}>
        <mesh castShadow geometry={geometry}>
          <meshStandardMaterial color='blue' transparent opacity={0.6} />
        </mesh>
        <mesh castShadow position-y={-1} geometry={geometry}>
          <cylinderGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color='yellow' transparent opacity={0.6} />
        </mesh>
        <mesh castShadow position-y={-2} geometry={geometry}>
          <cylinderGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color='red' transparent opacity={0.6} />
        </mesh>
        <mesh castShadow position-y={-3.5}>
          <cylinderGeometry args={[0.2, 0.2, 2]} />
          <meshStandardMaterial color='white' transparent opacity={0.6} />
        </mesh>
      </group>
    </group>
  );
};

export default Hammer;
