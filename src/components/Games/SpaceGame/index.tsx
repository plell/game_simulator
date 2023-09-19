import { Fragment, useMemo, useRef } from "react";
import { Group, Vector3 } from "three";
import { Cloud, Select, Stars } from "@react-three/drei";
import useGame from "../../../Stores/useGame";
import { gamePositions } from "../../../Stores/constants";
import { Lights } from "../../Lights";
import { Spaceship } from "./Objects/Spaceship";
import { Enemy } from "./Objects/Enemy";

export const SpaceGame = () => {
  const ref = useRef<Group | null>(null);

  const game = useGame((s) => s.game);

  return (
    <group ref={ref} position={gamePositions[game].gamePosition}>
      <Lights />
      <Stars />
      <Cloud
        opacity={0.5}
        speed={0.4} // Rotation speed
        width={20} // Width of the full cloud
        depth={1.5} // Z-dir depth
        segments={20} // Number of particles
      />
      <Spaceship position={[0, -8, 0]} />
      <Enemy position={[0, 5, 0]} />
      <mesh receiveShadow position-z={-10}>
        <planeGeometry args={[26.8, 26]} />
        <meshStandardMaterial color={"#569f3e"} />
      </mesh>
    </group>
  );
};

export default SpaceGame;
