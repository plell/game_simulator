import { useFrame } from "@react-three/fiber";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { Group } from "three";
import { useObjectsIntersect } from "../../../hooks/useObjectsIntersect";

type Props = {
  player: MutableRefObject<Group | null>;
};

export const Goal = ({ player }: Props) => {
  const ref = useRef<Group | null>(null);
  const [touched, setTouched] = useState(false);
  const [rate, setRate] = useState(1);

  const { objectsIntersect } = useObjectsIntersect(ref, player);

  useEffect(() => {
    if (objectsIntersect) {
      console.log("yes they intersect!");
      setTouched(true);
    } else {
      console.log("no they dont!");
    }
  }, [objectsIntersect]);

  const reset = () => {
    if (ref?.current) {
      ref.current.position.y = 30;
      ref.current.scale.x = 1;
      ref.current.rotation.y = 0;
      ref.current.position.z = 0;
    }
    setRate(Math.random() * 2);
    setTouched(false);
  };

  useFrame(({ clock }) => {
    if (ref?.current) {
      const elapsed = clock.getElapsedTime();
      const rotation = Math.PI * 0.35;
      ref.current.rotation.x = rotation + Math.sin(elapsed * 4) * 0.05;

      ref.current.position.y -= 0.08;
      ref.current.position.x = Math.sin(elapsed * rate) * 15;

      if (touched) {
        ref.current.rotation.y += 0.1;
        ref.current.position.z += 0.2;
      }

      if (ref.current.position.y < -30) {
        reset();
      }
    }
  });

  return (
    <group position-y={30} ref={ref}>
      <mesh rotation-x={Math.PI}>
        <torusGeometry args={[0.4, 0.2]} />
        <meshNormalMaterial />
      </mesh>
    </group>
  );
};
