import { useMemo, useRef } from "react";
import { Group } from "three";
import { Cloud } from "@react-three/drei";
import useGame from "../../../Stores/useGame";
import { experienceProperties } from "../../../Stores/constants";

import { Spaceship } from "./Objects/Spaceship";
import { Enemy } from "./Objects/Enemy";
import { useFrame } from "@react-three/fiber";
import { Projectiles } from "../common/Projectiles";

export const SpaceGame = () => {
  const ref = useRef<Group | null>(null);
  const cloudRef = useRef<Group | null>(null);
  const cloudRef2 = useRef<Group | null>(null);
  const playerRef = useRef<Group | null>(null);

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

    for (let i = 0; i < 2; i++) {
      b.push(<Enemy key={i + "-bird"} />);
    }

    return b;
  }, []);

  return (
    <group ref={ref} position={experienceProperties[game]?.gamePosition}>
      <directionalLight position={[5, 5, 100]} intensity={4} />

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

      <Spaceship position={[0, -6, 0]} playerRef={playerRef} />
      <Projectiles player={playerRef} launchPosition={[0, -4, 0]} />

      {enemies}

      <mesh receiveShadow position-z={-10}>
        <planeGeometry args={[85, 40]} />
        <meshStandardMaterial color={"skyblue"} />
      </mesh>
    </group>
  );
};
