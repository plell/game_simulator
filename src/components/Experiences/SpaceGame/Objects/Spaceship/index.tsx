import { MutableRefObject } from "react";
import { Group, Vector3 } from "three";
import { useGLTF } from "@react-three/drei";

import { useFrame } from "@react-three/fiber";

type Props = {
  position: [x: number, y: number, z: number];
  playerRef: MutableRefObject<Group | null>;
  mouseRef: MutableRefObject<Vector3>;
};

const tiltStrength = 0.1;
const reuseableVec3 = new Vector3();

useGLTF.preload("./models/spaceship.glb");

export const Spaceship = ({ position, playerRef, mouseRef }: Props) => {
  const model = useGLTF("./models/spaceship.glb");

  useFrame(() => {
    if (mouseRef.current && playerRef?.current) {
      const mouse = mouseRef.current;

      const playerPosition = playerRef.current.position;
      const rotation = playerRef.current.rotation;

      playerPosition.lerp(reuseableVec3.set(mouse.x, mouse.y / 2 + 4, 0), 0.09);

      rotation.y = (mouse.x - playerPosition.x) * tiltStrength;
    }
  });

  return (
    <>
      <group position={position}>
        <group ref={playerRef}>
          <primitive
            rotation-y={Math.PI * -0.5}
            rotation-x={Math.PI * 0.5}
            object={model.scene.clone()}
            scale={0.14}
          />
        </group>
      </group>
    </>
  );
};
