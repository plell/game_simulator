import { useFrame } from "@react-three/fiber";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useRef } from "react";
import { Group, Vector3 } from "three";

type Props = {
  position: [x: number, y: number, z: number];
};

const reuseableVec = new Vector3();

export const Enemy = ({ position }: Props) => {
  const body = useRef<RapierRigidBody | null>(null);

  useFrame(({ clock }) => {
    if (body.current) {
      const elapsedTime = clock.getElapsedTime();
      // const translation = body.current.translation();

      const x = position[0] + Math.sin(elapsedTime);
      const y = position[1] + Math.cos(elapsedTime);

      // console.log("x", x);

      // body.current.setTranslation(
      //   new Vector3(Math.sin(elapsedTime), Math.sin(elapsedTime), 0),
      //   true
      // );
    }
  });

  return (
    <group position={position}>
      <RigidBody ref={body}>
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color='red' />
        </mesh>
      </RigidBody>
    </group>
  );
};
