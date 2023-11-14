import { useFrame } from "@react-three/fiber";
import { MutableRefObject, useRef } from "react";
import { Group, Vector3 } from "three";

type Props = {
  mouseRef: MutableRefObject<Vector3>;
};

export const Cursor = ({ mouseRef }: Props) => {
  const ref = useRef<Group | null>(null);

  useFrame(({ clock }) => {
    if (ref?.current) {
      const elapsedTime = clock.getElapsedTime();

      ref.current.position.lerp(mouseRef.current, 0.1);

      const scale = (Math.cos(elapsedTime * 6) + 4) / 6;

      ref.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group ref={ref}>
      <mesh castShadow>
        <circleGeometry />
        <meshBasicMaterial color='#fff' transparent opacity={0.2} />
      </mesh>
    </group>
  );
};

export default Cursor;
