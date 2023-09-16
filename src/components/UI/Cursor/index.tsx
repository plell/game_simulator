import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Group } from "three";

export const Cursor = () => {
  const ref = useRef<Group | null>(null);

  useFrame(({ mouse, viewport, clock }) => {
    if (ref?.current) {
      const elapsedTime = clock.getElapsedTime();
      const x = (mouse.x * viewport.width) / 2;
      const y = (mouse.y * viewport.height) / 2;
      ref.current.position.set(x, y, 0);

      const scale = (Math.cos(elapsedTime * 6) + 4) / 6;

      ref.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group ref={ref}>
      <mesh castShadow>
        <circleGeometry />
        <meshBasicMaterial color='#000' transparent opacity={0.5} />
      </mesh>
    </group>
  );
};

export default Cursor;
