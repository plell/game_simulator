import { MutableRefObject, useRef } from "react";
import { Group, Vector3 } from "three";
import { useFollowCursor } from "../../../hooks/controllers/useFollowCursor";
import { Projectiles } from "../../../common/Projectiles";
import { useGLTF } from "@react-three/drei";
import { Goal } from "../Goal";

type Props = {
  position: [x: number, y: number, z: number];
  playerRef: MutableRefObject<Group | null>;
};

export const Spaceship = ({ position, playerRef }: Props) => {
  const ref = useRef<Group | null>(null);

  const model = useGLTF("./models/spaceship_simple.gltf");

  useFollowCursor({ ref: playerRef, lockY: false });

  return (
    <>
      <group ref={ref} position={position}>
        <group ref={playerRef}>
          <primitive
            rotation-y={Math.PI * -0.5}
            rotation-x={Math.PI * 0.5}
            object={model.scene.clone()}
            scale={0.2}
          />
        </group>
      </group>

      <Goal player={playerRef} />
    </>
  );
};

useGLTF.preload("./models/spaceship_simple.gltf");
