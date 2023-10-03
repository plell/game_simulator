import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useEffect, useLayoutEffect, useRef } from "react";

import { Timeout } from "../../../CrocGame/Objects/Croc";
import { useGLTF } from "@react-three/drei";
import { Group, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";

const movementInterval = 1000;

const width = 30;

const getRandomX = () => {
  return Math.random() * width - width / 2;
};

const getRandomY = () => {
  return 20 + Math.random() * 14 - 14 / 2;
};

export const Enemy = () => {
  const ref = useRef<Group | null>(null);

  const reset = () => {
    if (ref?.current) {
      ref.current.position.y = 30;
    }
  };

  useFrame(({ clock }) => {
    if (ref?.current) {
      ref.current.position.y -= 0.1;

      if (ref.current.position.y < -30) {
        reset();
      }
    }
  });

  return (
    <group ref={ref} position={[getRandomX(), getRandomY(), 0]}>
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={"red"} />
      </mesh>
    </group>
  );
};

useGLTF.preload("./models/bird.gltf");
