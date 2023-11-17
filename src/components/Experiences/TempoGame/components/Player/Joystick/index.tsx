import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Mesh, RingGeometry, Vector3 } from "three";

const reuseableVector3a = new Vector3();
const reuseableVector3b = new Vector3();
const mouseVec3 = new Vector3();

const ringGeo = new RingGeometry(1, 0.9, undefined, undefined, undefined, 1);

export const Joystick = () => {
  const ref = useRef<Mesh | null>(null);
  useFrame(({ mouse }) => {
    const { x, y } = mouse;

    if (ref.current) {
      const lookAtVector = new Vector3().subVectors(
        reuseableVector3a.set(x * 100, y * 100, 0),
        ref.current.position
      );
      ref.current.lookAt(lookAtVector);
      //   ref.current.rotation.z = (-normalizedY + normalizedX) * Math.PI;
    }
  });

  return (
    <group rotation-x={Math.PI * 0.68 + Math.PI} position-z={10}>
      <mesh ref={ref} geometry={ringGeo} rotation-x={Math.PI}>
        <meshBasicMaterial transparent />
      </mesh>
    </group>
  );
};
