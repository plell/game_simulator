import { useMemo, useRef } from "react";
import { Group, Vector3 } from "three";
import { Cloud } from "@react-three/drei";
import useGame from "../../../Stores/useGame";
import { experienceProperties } from "../../../Stores/constants";

import { Spaceship } from "./Objects/Spaceship";
import { Enemy } from "./Objects/Enemy";
import { useFrame } from "@react-three/fiber";
import { Projectiles } from "../common/Projectiles";

export type Refs = Record<string, Group>;
const mouseVec3 = new Vector3();

export const SpaceGame = () => {
  const ref = useRef<Group | null>(null);
  const cloudRef = useRef<Group | null>(null);
  const cloudRef2 = useRef<Group | null>(null);
  const playerRef = useRef<Group | null>(null);
  const mouseRef = useRef<Vector3>(mouseVec3);
  const enemiesRef = useRef<Refs>({});
  const projectilesRef = useRef<Refs>({});

  const game = useGame((s) => s.game);

  useFrame((_, delta) => {
    const movement = 7 * delta;

    if (cloudRef.current) {
      cloudRef.current.position.y -= movement;

      if (cloudRef.current.position.y < -25) {
        cloudRef.current.position.y = 25;
      }
    }

    if (cloudRef2.current) {
      cloudRef2.current.position.y -= movement;

      if (cloudRef2.current.position.y < -25) {
        cloudRef2.current.position.y = 25;
      }
    }
  });

  const enemies = useMemo(() => {
    const b: any = [];

    for (let i = 0; i < 10; i++) {
      const id = i + "-bird";
      b.push(
        <Enemy key={id} playerRef={playerRef} projectilesRef={projectilesRef} />
      );
    }

    return b;
  }, [playerRef, projectilesRef]);

  return (
    <group ref={ref} position={experienceProperties[game]?.gamePosition}>
      <directionalLight position={[5, 5, 100]} intensity={3} />

      <group ref={cloudRef}>
        <Cloud
          opacity={0.5}
          speed={0.4} // Rotation speed
          width={20} // Width of the full cloud
          depth={1.5} // Z-dir depth
          segments={20} // Number of particles
        />
      </group>

      <group ref={cloudRef2} position-y={25}>
        <Cloud
          opacity={0.7}
          speed={0.7} // Rotation speed
          width={30} // Width of the full cloud
          depth={1} // Z-dir depth
          segments={20} // Number of particles
        />
      </group>

      <group position-y={-6}>
        <Spaceship
          position={[0, 0, 0]}
          mouseRef={mouseRef}
          playerRef={playerRef}
        />
        <mesh
          onPointerMove={(e) => {
            const { x, y, z } = e.point;
            mouseRef.current.set(x, y, z);
          }}
        >
          <planeGeometry args={[145, 80]} />
          <meshStandardMaterial transparent opacity={0} />
        </mesh>
      </group>

      <Projectiles
        refs={projectilesRef}
        player={playerRef}
        launchPosition={[0, -4, 0]}
      />

      {enemies}

      <mesh receiveShadow position-z={-20}>
        <planeGeometry args={[145, 80]} />
        <meshStandardMaterial color={"skyblue"} />
      </mesh>
    </group>
  );
};
