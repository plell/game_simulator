import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { Group, Vector3 } from "three";

export const Loading = () => {
  const ref = useRef<Group | null>(null);
  useFrame(() => {});

  return (
    <group ref={ref}>
      <mesh>
        <torusGeometry args={[2, 3]} />
        <meshPhongMaterial />
      </mesh>
    </group>
  );
};
