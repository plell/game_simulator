import { useFrame } from "@react-three/fiber";

import { MutableRefObject, useEffect, useMemo, useRef, useState } from "react";
import { Color, Group, MeshStandardMaterial } from "three";
import { Projectile } from "../../../../../../Stores/types";
import { Refs } from "../../../../SpaceGame";

type Props = {
  self: Projectile;
  removeMe: (id: string) => void;
  refs: MutableRefObject<Refs>;
};

const highlightMaterial = new MeshStandardMaterial({
  emissive: new Color("red"),
  emissiveIntensity: 20,
  opacity: 1,
  toneMapped: false,
  transparent: true,
});

export const Bullet = ({ refs, self, removeMe }: Props) => {
  const [dead, setDead] = useState(false);

  useEffect(() => {
    if (dead) {
      removeMe(self.id);
    }
  }, [dead]);

  useFrame(() => {
    const ref = refs.current[self.id];
    if (ref) {
      ref.position.y += 0.3;

      if (ref.position.y > 50) {
        setDead(true);
      }
    }
  });

  return (
    <group
      ref={(r: Group) => (refs.current[self.id] = r)}
      position={self?.position}
      userData={{ id: self.id }}
    >
      <mesh material={highlightMaterial}>
        <sphereGeometry args={[0.3, 10, 10]} />
      </mesh>
    </group>
  );
};
