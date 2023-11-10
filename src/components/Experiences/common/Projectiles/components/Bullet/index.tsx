import { useFrame } from "@react-three/fiber";

import { MutableRefObject, useEffect, useState } from "react";
import {
  BoxGeometry,
  CircleGeometry,
  Color,
  Group,
  MeshBasicMaterial,
  MeshStandardMaterial,
  SphereGeometry,
  Vector3,
} from "three";
import { Projectile } from "../../../../../../Stores/types";
import { Refs } from "../../../../SpaceGame";
import { DEAD_ZONE_Y } from "../../../../../../Stores/constants";

type Props = {
  self: Projectile;
  removeMe: (id: string) => void;
  refs: MutableRefObject<Refs>;
  material?: MeshBasicMaterial | MeshStandardMaterial;
  geometry?: SphereGeometry | CircleGeometry | BoxGeometry;
};

const highlightMaterial = new MeshStandardMaterial({
  emissive: new Color("red"),
  emissiveIntensity: 20,
  opacity: 1,
  toneMapped: false,
  transparent: true,
});

const sphereGeometry = new SphereGeometry(0.3, 10, 10);

export const Bullet = ({ refs, self, removeMe, material, geometry }: Props) => {
  const [dead, setDead] = useState(false);

  useEffect(() => {
    if (dead) {
      removeMe(self.id);
    }
  }, [dead]);

  useFrame((_, delta) => {
    const ref = refs.current[self.id];
    if (ref) {
      ref.position.y += self.direction.y;
      ref.position.x += self.direction.x;
      ref.position.z += self.direction.z;
      ref.rotation.z += 6 * delta;

      if (ref.position.y > DEAD_ZONE_Y - 1) {
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
      <mesh
        material={material || highlightMaterial}
        geometry={geometry || sphereGeometry}
      />
    </group>
  );
};
