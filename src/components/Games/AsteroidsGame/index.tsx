import { Fragment, useMemo, useRef } from "react";
import { Group, Vector3 } from "three";
import { Select } from "@react-three/drei";
import useGame from "../../../Stores/useGame";

export const CrocGame = () => {
  const ref = useRef<Group | null>(null);

  return (
    <group ref={ref}>
      <mesh receiveShadow position-z={-10} rotation-x={Math.PI * -0.5}>
        <planeGeometry args={[26.8, 26]} />
        <meshStandardMaterial color={"#569f3e"} />
      </mesh>
    </group>
  );
};

export default CrocGame;
