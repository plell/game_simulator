import { CuboidArgs, CuboidCollider, RigidBody } from "@react-three/rapier";
import { useRef } from "react";
import { Group } from "three";
import useGame from "../../../Stores/useGame";

const args: CuboidArgs = [30, 2, 0.2];
const z = 4.5;

type UserData = {
  id: number | undefined;
};

export const Boundaries = () => {
  const ref = useRef<Group | null>(null);
  const setBite = useGame((s) => s.setBite);

  return (
    <group ref={ref}>
      <CuboidCollider
        position={[0, 0, z]}
        args={args}
        sensor
        onIntersectionEnter={({ rigidBody }) => {
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
