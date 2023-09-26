import { useFrame } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CylinderGeometry, Group, Vector3 } from "three";
import useGame from "../../../../../Stores/useGame";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useFollowCursor } from "../../../hooks/controllers/useFollowCursor";
import { Fire } from "../../../common/Fire";

type Props = {
  position: Vector3;
  delay: number;
  id: number;
};

const geometry = new CylinderGeometry(1, 1, 1);

export const Hammer = () => {
  const ref = useRef<Group | null>(null);

  useFollowCursor({ ref });

  return (
    <group position={[0, 5, 4]}>
      <group ref={ref} rotation-x={Math.PI * -0.25}>
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
    </group>
  );
};

export default Hammer;
