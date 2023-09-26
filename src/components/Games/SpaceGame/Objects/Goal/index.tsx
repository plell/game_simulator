import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import { Group, Mesh } from "three";

const width = 30;

const getRandomX = () => {
  return Math.random() * width - width / 2;
};

export const Goal = () => {
  const ref = useRef<Mesh | null>(null);
  const [rate, setRate] = useState(1);

  useFrame(({ clock }) => {
    if (ref?.current) {
      const elapsed = clock.getElapsedTime();
      const rotation = Math.PI * 0.35;
      ref.current.rotation.x = rotation + Math.sin(elapsed * 4) * 0.05;

      ref.current.position.y -= 0.08;
      ref.current.position.x = Math.sin(elapsed * rate) * 15;

      if (ref.current.position.y < -30) {
        ref.current.position.y = 30;
        setRate(Math.random() * 4);
      }
    }
  });
  return (
    <group>
      <mesh ref={ref} position-y={30} rotation-x={Math.PI * 0.5}>
        <torusGeometry args={[2.4, 0.2]} />
        <meshNormalMaterial />
      </mesh>
    </group>
  );
};
