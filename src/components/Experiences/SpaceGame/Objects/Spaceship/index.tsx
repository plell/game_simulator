import { MutableRefObject, useRef } from "react";
import { Group, Vector3 } from "three";
import { useFollowCursor } from "../../../hooks/controllers/useFollowCursor";
import { useGLTF } from "@react-three/drei";
import { Goal } from "../Goal";
import { useFrame } from "@react-three/fiber";

type Props = {
  position: [x: number, y: number, z: number];
  playerRef: MutableRefObject<Group | null>;
  mouseRef: MutableRefObject<Vector3>;
};

const tiltStrength = 0.1;
const reuseableVec3 = new Vector3();

export const Spaceship = ({ position, playerRef, mouseRef }: Props) => {
  const model = useGLTF("./models/spaceship_simple.gltf");

  useFrame(() => {
    if (mouseRef.current && playerRef?.current) {
      const mouse = mouseRef.current;

      const playerPosition = playerRef.current.position;
      const rotation = playerRef.current.rotation;

      playerPosition.lerp(reuseableVec3.set(mouse.x, mouse.y / 2, 0), 0.09);

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
            scale={0.12}
          />
        </group>
      </group>

      <Goal player={playerRef} />
    </>
  );
};

useGLTF.preload("./models/spaceship_simple.gltf");
