import { useFrame } from "@react-three/fiber";

import { useEffect, useMemo, useRef, useState } from "react";
import { Color, Group, MeshStandardMaterial } from "three";
import { Projectile } from "../../../../../../Stores/types";

type Props = {
  self: Projectile;
  removeMe: (id: string) => void;
};

const highlightMaterial = new MeshStandardMaterial({
  emissive: new Color("red"),
  emissiveIntensity: 20,
  opacity: 1,
  toneMapped: false,
  transparent: true,
});

export const Bullet = ({ self, removeMe }: Props) => {
  const ref = useRef<Group | null>(null);

  const [dead, setDead] = useState(false);

  useEffect(() => {
    if (dead) {
      console.log("removeMe");
      removeMe(self.id);
    }

    return () => {
      console.log("im removed!");
    };
  }, [dead]);

  useFrame(() => {
    if (ref.current) {
      ref.current.position.y += 0.3;

      if (ref.current.position.y > 50) {
        setDead(true);
      }
    }
  });

  return (
    <group ref={ref} position={self?.position}>
      <mesh material={highlightMaterial}>
        <sphereGeometry args={[0.3, 10, 10]} />
      </mesh>
    </group>
  );
};
