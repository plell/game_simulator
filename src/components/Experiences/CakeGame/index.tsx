import { Fragment, useMemo, useRef, useState } from "react";
import { Group, Vector3 } from "three";

import useGame from "../../../Stores/useGame";
import { experienceProperties } from "../../../Stores/constants";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";

import { useFollowCursor } from "../hooks/controllers/useFollowCursor";
import { useStartButton } from "../hooks/useStartButton";
import { Loading } from "../common/Loading";
import { RigidBodyData } from "../../../Stores/types";

type CakeData = {
  height: number;
  radius: number;
  isBottom?: boolean;
  color?: string;
  position: Vector3;
};

const cakesLayers: CakeData[] = [
  { height: 0.2, radius: 0.5, position: new Vector3(0, 6, 0) },
  { height: 0.8, radius: 1, position: new Vector3(0, 5, 0) },
  { height: 1, radius: 2, position: new Vector3(0, 4, 0) },
  { height: 2, radius: 3, position: new Vector3(0, 0, 0), isBottom: true },
];

export const CakeGame = () => {
  const ref = useRef<Group | null>(null);

  const game = useGame((s) => s.game);

  const { ready } = useStartButton();

  if (!ready) {
    return <Loading />;
  }

  return (
    <group ref={ref} position={experienceProperties[game]?.gamePosition}>
      <directionalLight position={[5, 50, 0]} intensity={4} />

      {cakesLayers.map((c, i) => {
        return <CakeLayer {...c} key={i + "-cake"} />;
      })}

      <RigidBody type='fixed' userData={{ type: "wall" }}>
        <mesh receiveShadow position-y={-10} rotation-x={Math.PI * -0.5}>
          <boxGeometry args={[300, 300, 5]} />
          <meshStandardMaterial color={"purple"} />
        </mesh>
      </RigidBody>
    </group>
  );
};

const CakeLayer = ({ height, radius, color, position, isBottom }: CakeData) => {
  const [dead, setDead] = useState(false);
  const body = useRef<RapierRigidBody | null>(null);

  useFollowCursor({ ref: body, lockY: !isBottom, disabled: dead });

  return (
    <group position={position}>
      <RigidBody
        onCollisionEnter={({ other }: any) => {
          const object = other.rigidBodyObject?.userData as RigidBodyData;
          if (object?.type === "wall") {
            setDead(true);
          }
        }}
        gravityScale={isBottom ? 0 : 2}
        dominanceGroup={isBottom ? 1 : 0}
        ref={body}
        type={isBottom ? "kinematicPosition" : "dynamic"}
      >
        <mesh>
          <cylinderGeometry args={[radius, radius, height]} />
          <meshStandardMaterial color={color || "pink"} />
        </mesh>
      </RigidBody>
    </group>
  );
};
