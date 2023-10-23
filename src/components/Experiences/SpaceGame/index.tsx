import { useMemo, useRef, useState } from "react";
import { Group, Vector3 } from "three";
import { Cloud } from "@react-three/drei";
import useGame from "../../../Stores/useGame";
import { experienceProperties } from "../../../Stores/constants";

import { Spaceship } from "./Objects/Spaceship";
import { Enemy } from "./Objects/Enemy";
import { useFrame } from "@react-three/fiber";
import { Projectiles } from "../common/Projectiles";
import { Goal } from "./Objects/Goal";
import { GameProgress } from "../common/GameProgress";

export type Refs = Record<string, Group>;
const mouseVec3 = new Vector3();

export const SpaceGame = () => {
  const ref = useRef<Group | null>(null);
  const cloudRef = useRef<Group | null>(null);
  const cloudRef2 = useRef<Group | null>(null);
  const playerRef = useRef<Group | null>(null);
  const mouseRef = useRef<Vector3>(mouseVec3);
  const [score, setScore] = useState(0);

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

      <GameProgress
        position={new Vector3(0, 6, 10)}
        type='points'
        max={4}
        score={score}
        setLevel={(l) => {
          console.log("setLevel");
        }}
        level={0}
        levelSuffix=''
        scale={0.1}
      />

      <group>
        <group ref={cloudRef} position-z={-10}>
          <Cloud
            opacity={0.5}
            speed={0.4} // Rotation speed
            width={20} // Width of the full cloud
            depth={1.5} // Z-dir depth
            segments={20} // Number of particles
          />
        </group>

        <group ref={cloudRef2} position-y={25} position-z={10}>
          <Cloud
            opacity={0.7}
            speed={0.7} // Rotation speed
            width={30} // Width of the full cloud
            depth={1} // Z-dir depth
            segments={20} // Number of particles
          />
        </group>
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

      <Goal
        player={playerRef}
        addToScore={(s: number) => setScore(score + s)}
      />

      <Projectiles
        refs={projectilesRef}
        player={playerRef}
        launchPosition={[0, -4, 0]}
      />

      {enemies}

      <mesh receiveShadow position-z={-30}>
        <planeGeometry args={[145, 80]} />
        <meshStandardMaterial color={"skyblue"} />
      </mesh>
    </group>
  );
};
