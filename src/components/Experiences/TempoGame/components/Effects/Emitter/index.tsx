import { useFrame } from "@react-three/fiber";
import { RapierRigidBody } from "@react-three/rapier";
import { useEffect, useRef } from "react";
import { Mesh, Vector3 } from "three";

type Props = {
  active: boolean;
  position: Vector3;
  body?: React.MutableRefObject<RapierRigidBody | null>;
};

export const Emitter = ({ body, active, position }: Props) => {
  const ref = useRef<Mesh | null>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scale.set(0, 0, 0);
    }
  }, [active]);

  useFrame((_, delta) => {
    if (active && ref.current) {
      const scale = ref.current.scale.x + 6 * delta;
      ref.current.scale.set(scale, scale, scale);
    }

    if (body?.current && ref?.current) {
      const trans = body?.current.translation();
      ref.current.position.set(trans.x, trans.y, trans.z);
    }
  });

  return (
    <mesh position={position} ref={ref}>
      <ringGeometry args={[2, 3, 20]} />
      <meshStandardMaterial wireframe color="purple" />
    </mesh>
  );
};
