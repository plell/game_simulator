import { Text } from "@react-three/drei";
import { CuboidArgs, CuboidCollider, RigidBody } from "@react-three/rapier";
import { useEffect, useMemo, useRef, useState } from "react";
import { Group, Vector3 } from "three";
import useGame from "../../../Stores/useGame";

const args: CuboidArgs = [30, 2, 0.2];
const z = 3;

type UserData = {
  id: number | undefined;
};

export const Boundaries = () => {
  const ref = useRef<Group | null>(null);

  const setDamage = useGame((s) => s.setDamage);
  const damage = useGame((s) => s.damage);
  const setBite = useGame((s) => s.setBite);

  return (
    <group ref={ref}>
      <CuboidCollider
        position={[0, 0, z]}
        args={args}
        sensor
        onIntersectionEnter={({ rigidBody }) => {
          console.log("rigidBody", rigidBody);
          // keep track of who is biting
          const { id } = rigidBody?.userData as UserData;
          if (id) {
            setBite(id);
          }
        }}
      />

      <mesh position-z={z}>
        <boxGeometry args={args} />
        <meshStandardMaterial color={"red"} />
      </mesh>
    </group>
  );
};

export default Boundaries;
