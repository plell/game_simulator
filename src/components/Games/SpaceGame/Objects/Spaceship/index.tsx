import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Group, Vector3 } from "three";
import { useFollowCursor } from "../../../hooks/controllers/useFollowCursor";
import { Projectiles } from "../../../common/Projectiles";
import { useGLTF } from "@react-three/drei";

type Props = {
  position: [x: number, y: number, z: number];
};

export const Spaceship = ({ position }: Props) => {
  const ref = useRef<Group | null>(null);
  const playerRef = useRef<Group | null>(null);

  const model = useGLTF("./models/spaceship.gltf");

  model.scene.children.forEach((mesh) => {
    mesh.userData = { type: "spaceship" };
    mesh.castShadow = true;
    mesh.receiveShadow = true;
  });

  useFollowCursor({ ref: playerRef });

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    if (playerRef.current) {
      playerRef.current.position.y = Math.sin(elapsedTime * 1.5);
    }
  });

  return (
    <group ref={ref} position={position}>
      <group ref={playerRef}>
        <primitive
          rotation-y={Math.PI * -0.5}
          rotation-x={Math.PI * 0.5}
          object={model.scene.clone()}
          scale={0.2}
        />
      </group>

      <Projectiles player={playerRef} launchPosition={[0, 2, 0]} />
    </group>
  );
};
