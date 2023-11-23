import { Suspense, useCallback, useMemo, useRef, useState } from "react";
import { Group, MeshBasicMaterial, Vector3 } from "three";
import { Cloud, Clouds } from "@react-three/drei";

import { Spaceship } from "./Objects/Spaceship";
import { Enemy } from "./Objects/Enemy";
import { useFrame } from "@react-three/fiber";
import { Projectiles } from "../common/Projectiles";
import { Goal } from "./Objects/Goal";
import { GameProgress } from "../common/GameProgress";
import { ErrorBoundary } from "react-error-boundary";

export type Refs = Record<string, Group>;
const mouseVec3 = new Vector3();

export const SpaceGame = () => {
  const ref = useRef<Group | null>(null);

  const playerRef = useRef<Group | null>(null);
  const mouseRef = useRef<Vector3>(mouseVec3);
  const [score, setScore] = useState(0);
  const [subScore, setSubScore] = useState(0);

  const [level, setLevel] = useState(1);

  const projectilesRef = useRef<Refs>({});

  const addToSubScore = useCallback(() => {
    setSubScore(subScore + 1);
  }, [setSubScore, subScore]);

  const resetSubScore = useCallback(() => {
    setSubScore(0);
  }, [setSubScore, subScore]);

  const enemies = useMemo(() => {
    const b: any = [];

    for (let i = 0; i < 10; i++) {
      const id = i + "-bird";
      b.push(
        <Enemy
          key={id}
          playerRef={playerRef}
          projectilesRef={projectilesRef}
          onDeath={addToSubScore}
          onCrash={resetSubScore}
        />
      );
    }

    return b;
  }, [playerRef, projectilesRef, subScore, setSubScore]);

  return (
    <group ref={ref} position={[0, 0, 0]}>
      <directionalLight position={[5, 5, 100]} intensity={1} />

      <ErrorBoundary fallback={null}>
        <CloudSpace />
      </ErrorBoundary>

      <GameProgress
        position={new Vector3(0, 3, 10)}
        type='bar'
        max={10}
        score={subScore}
        level={1}
        color='#cccccc'
        hideText
        setLevel={() => {
          setSubScore(0);
          setScore(score + 1);
        }}
        scale={0.03}
      />

      <GameProgress
        position={new Vector3(0, 5, 10)}
        type='points'
        max={4}
        score={score}
        level={level}
        levelPrefix='RANK '
        setLevel={() => {
          setLevel(level + 1);
          setScore(0);
        }}
        scale={0.1}
      />

      <group position-y={-6}>
        <Spaceship
          score={score}
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
          <meshStandardMaterial transparent opacity={0} wireframe />
        </mesh>
      </group>

      <Goal
        player={playerRef}
        addToScore={(s: number) => setScore(score + s)}
      />

      <Projectiles
        level={level}
        refs={projectilesRef}
        player={playerRef}
        launchPosition={[0, -4.7, 0]}
      />

      {enemies}

      <mesh receiveShadow position-z={-30}>
        <planeGeometry args={[145, 80]} />
        <meshStandardMaterial color={"#555555"} />
      </mesh>
    </group>
  );
};

const CloudSpace = () => {
  const cloudRef = useRef<any | null>(null);
  const cloudRef2 = useRef<any | null>(null);

  useFrame((_, delta) => {
    const movement = 7 * delta;

    if (cloudRef.current) {
      cloudRef.current.position.y -= movement;

      if (cloudRef.current.position.y < -40) {
        cloudRef.current.position.y = 40;

        cloudRef.current.seed = Math.floor(Math.random() * 1000);
      }
    }

    if (cloudRef2.current) {
      cloudRef2.current.position.y -= movement;

      if (cloudRef2.current.position.y < -40) {
        cloudRef2.current.position.y = 40;
        cloudRef2.current.seed = Math.floor(Math.random() * 1000);
      }
    }
  });
  return (
    <group>
      <Suspense fallback={null}>
        <Clouds material={MeshBasicMaterial}>
          <Cloud
            ref={cloudRef}
            position-z={3}
            opacity={0.5}
            speed={0.4} // Rotation speed
            bounds={[30, 30, 2]}
            seed={22}
            color={"#aaaaaa"}
          />

          <Cloud
            ref={cloudRef2}
            position-y={25}
            position-z={10}
            bounds={[30, 20, 2]}
            opacity={0.7}
            speed={0.7} // Rotation speed
            seed={1}
            color={"#888888"}
          />
        </Clouds>
      </Suspense>
    </group>
  );
};
