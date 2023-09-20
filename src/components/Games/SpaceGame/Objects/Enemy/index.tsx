import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useEffect, useLayoutEffect, useRef } from "react";

import { Timeout } from "../../../CrocGame/Objects/Croc";
import { useGLTF } from "@react-three/drei";
import { Vector3 } from "three";

const movementInterval = 1000;

const width = 30;

const getRandomX = () => {
  return Math.random() * width - width / 2;
};

const getRandomY = () => {
  return 20 + Math.random() * 14 - 14 / 2;
};

export const Enemy = () => {
  const body = useRef<RapierRigidBody | null>(null);
  let timeout: Timeout = null;

  const model = useGLTF("./models/bird.gltf");

  model.scene.children.forEach((mesh) => {
    mesh.userData = { type: "bird" };
    mesh.castShadow = true;
    mesh.receiveShadow = true;
  });

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
      const impulse = { x: getRandomX() / width, y: -0.5, z: 0 };

      body.current.applyImpulse(impulse, true);

      if (body.current.translation().y < -10) {
        body.current.setTranslation(new Vector3(0, 10, 0), true);
      }
    }
  };

  return (
    <group position={[getRandomX(), getRandomY(), 0]}>
      <RigidBody ref={body} mass={0.4}>
        <primitive
          rotation-y={Math.PI * -0.5}
          rotation-x={Math.PI * 0.5}
          object={model.scene.clone()}
          scale={0.2}
        />
      </RigidBody>
    </group>
  );
};

useGLTF.preload("./models/bird.gltf");
