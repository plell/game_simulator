import { useFrame } from "@react-three/fiber";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useEffect, useMemo, useRef, useState } from "react";
import { Color, Group, MeshStandardMaterial, Vector3 } from "three";
import { Projectile } from "../../../../../../Stores/types";

type Props = {
  self: Projectile;
};

const impulse = new Vector3(0, 0.3, 0);

const highlightMaterial = new MeshStandardMaterial({
  emissive: new Color("red"),
  emissiveIntensity: 20,
  opacity: 1,
  toneMapped: false,
  transparent: true,
});

export const Bullet = ({ self }: Props) => {
  const body = useRef<RapierRigidBody | null>(null);

  const [dead, setDead] = useState(false);

  useFrame(() => {
    if (dead) return;

    if (body.current) {
      body.current.applyImpulse(impulse, true);

      if (body?.current?.translation().y > 50) {
        setDead(true);
      }
    }
  });

  const position = useMemo(() => self?.position || [0, 0, 0], [self]);

  if (dead) return null;

  return (
    <RigidBody ref={body} position={position}>
      <mesh material={highlightMaterial}>
        <sphereGeometry args={[0.3, 10, 10]} />
      </mesh>
    </RigidBody>
  );
};
