import { useFrame } from "@react-three/fiber";
import { RapierRigidBody } from "@react-three/rapier";
import { useEffect, useRef } from "react";
import { Mesh, MeshBasicMaterial, RingGeometry } from "three";

type Props = {
  active: boolean;
  body?: React.MutableRefObject<RapierRigidBody | null>;
};

const ringGeo = new RingGeometry(2, 8, 20);
const meshMat = new MeshBasicMaterial({ color: "black" });

export const Damage = ({ body, active }: Props) => {
  const ref = useRef<Mesh | null>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scale.set(0, 0, 0);
    }
  }, [active]);

  useFrame((_, delta) => {
    if (active && ref.current) {
      const scale = ref.current.scale.x + 2 * delta;
      ref.current.scale.set(scale, scale, scale);
    }

    if (body?.current && ref?.current) {
      const trans = body?.current.translation();
      ref.current.position.set(trans.x, trans.y, trans.z);
    }
  });

  return <mesh ref={ref} geometry={ringGeo} material={meshMat} />;
};
