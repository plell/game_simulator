import { Fragment, useMemo, useRef, useState } from "react";
import { Group, Vector3 } from "three";

import useGame from "../../../Stores/useGame";
import { experienceProperties } from "../../../Stores/constants";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";

import { useFollowCursor } from "../hooks/controllers/useFollowCursor";

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

  return (
    <group ref={ref} position={experienceProperties[game]?.gamePosition}>
      <directionalLight position={[5, 50, 0]} intensity={4} />

      {cakesLayers.map((c, i) => {
        return <CakeLayer {...c} key={i + "-cake"} />;
      })}

      <RigidBody type='fixed'>
        <mesh receiveShadow position-y={-10} rotation-x={Math.PI * -0.5}>
          <planeGeometry args={[300, 300]} />
          <meshStandardMaterial color={"purple"} />
        </mesh>
      </RigidBody>
    </group>
  );
};

const CakeLayer = ({ height, radius, color, position, isBottom }: CakeData) => {
  const body = useRef<RapierRigidBody | null>(null);

  if (isBottom) {
    useFollowCursor({ ref: body });
  }

  return (
    <group position={position}>
      <RigidBody
        gravityScale={isBottom ? 0 : 1}
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
