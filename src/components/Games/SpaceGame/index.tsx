import { Fragment, useMemo, useRef, useState } from "react";
import { Group, Vector3 } from "three";
import { Cloud, Select, Stars } from "@react-three/drei";
import useGame from "../../../Stores/useGame";
import { gamePositions } from "../../../Stores/constants";
import { Lights } from "../../Lights";
import { Spaceship } from "./Objects/Spaceship";
import { Enemy } from "./Objects/Enemy";
import { useFrame } from "@react-three/fiber";

export const SpaceGame = () => {
  const ref = useRef<Group | null>(null);
  const cloudRef = useRef<Group | null>(null);
  const cloudRef2 = useRef<Group | null>(null);
  const enemies = useState<any>([]);

  const game = useGame((s) => s.game);

  useFrame(() => {
    if (cloudRef.current) {
      cloudRef.current.position.y -= 0.1;

      if (cloudRef.current.position.y < -25) {
        cloudRef.current.position.y = 25;
      }
    }

    if (cloudRef2.current) {
      cloudRef2.current.position.y -= 0.1;

      if (cloudRef2.current.position.y < -25) {
        cloudRef2.current.position.y = 25;
      }
    }
  });

  return (
    <group ref={ref} position={gamePositions[game]?.gamePosition}>
      <Lights />

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
      <Spaceship position={[0, -6, 0]} />

      <Enemy />
      <Enemy />
      <Enemy />
      <Enemy />
      <Enemy />
      <Enemy />
      <Enemy />
      <Enemy />
      <Enemy />

      <mesh receiveShadow position-z={-10}>
        <planeGeometry args={[45, 40]} />
        <meshStandardMaterial color={"skyblue"} />
      </mesh>
    </group>
  );
};

export default SpaceGame;
