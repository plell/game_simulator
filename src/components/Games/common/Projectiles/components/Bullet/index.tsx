import { useFrame } from "@react-three/fiber";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useEffect, useMemo, useRef, useState } from "react";
import { Group, Vector3 } from "three";
import { Projectile } from "../../../../../../Stores/types";

type Props = {
  self: Projectile;
};

const impulse = new Vector3(0, 1.4, 0);

export const Bullet = ({ self }: Props) => {
  const body = useRef<RapierRigidBody | null>(null);

  useFrame(() => {
    if (body.current) {
      body.current.applyImpulse(impulse, true);
    }
  });

  const position = useMemo(() => self?.position || [0, 0, 0], [self]);

  return (
    <RigidBody ref={body} position={position}>
      <mesh>
        <sphereGeometry args={[0.7, 10, 10]} />
        <meshStandardMaterial color={"black"} />
      </mesh>
    </RigidBody>
  );
};
