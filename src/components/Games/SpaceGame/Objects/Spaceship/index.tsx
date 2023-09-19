import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Group, Vector3 } from "three";
import { useFollowCursor } from "../../../hooks/controllers/useFollowCursor";
import { Projectiles } from "../../../common/Projectiles";

type Props = {
  position: [x: number, y: number, z: number];
};

export const Spaceship = ({ position }: Props) => {
  const ref = useRef<Group | null>(null);
  const playerRef = useRef<Group | null>(null);

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
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color='pink' />
        </mesh>
      </group>

      <Projectiles player={playerRef} />
    </group>
  );
};
