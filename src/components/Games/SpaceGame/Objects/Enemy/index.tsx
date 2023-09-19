import { useFrame } from "@react-three/fiber";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useEffect, useLayoutEffect, useRef } from "react";
import { Group, Vector3 } from "three";
import { Timeout } from "../../../CrocGame/Objects/Croc";

const movementInterval = 1200;

const width = 30;

const getRandomX = () => {
  return Math.random() * width - width / 2;
};

const getRandomY = () => {
  return 13 + Math.random() * 14 - 14 / 2;
};

export const Enemy = () => {
  const body = useRef<RapierRigidBody | null>(null);
  let timeout: Timeout = null;

  useEffect(() => {
    doMovementTimeout();

    return function cleanup() {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, []);

  const doMovementTimeout = () => {
    timeout = setTimeout(() => {
      applyForce();
      doMovementTimeout();
    }, movementInterval);
  };

  const applyForce = () => {
    if (body.current) {
      const impulse = { x: getRandomX() / width, y: -2, z: 0 };

      body.current.applyImpulse(impulse, true);
    }
  };

  return (
    <group position={[getRandomX(), getRandomY(), 0]}>
      <RigidBody ref={body} mass={0.4}>
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color='red' />
        </mesh>
      </RigidBody>
    </group>
  );
};
