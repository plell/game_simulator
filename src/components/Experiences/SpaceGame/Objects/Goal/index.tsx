import { useFrame } from "@react-three/fiber";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { Group } from "three";
import { useObjectsIntersect } from "../../../hooks/useObjectsIntersect";
import { Stars, Trail } from "@react-three/drei";
import { Particles } from "../../../common/Particles";

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
    setRate(Math.random() * 4);
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
    <Trail
      width={20} // Width of the line
      color={"white"} // Color of the line
      length={20} // Length of the line
      decay={2} // How fast the line fades away
      local={false} // Wether to use the target's world or local positions
      stride={0} // Min distance between previous and current point
      interval={1} // Number of frames to wait before next calculation
      target={undefined} // Optional target. This object will produce the trail.
      attenuation={(width) => width} // A function to define the width in each point along it.
    >
      <group position-y={30} ref={ref}>
        <mesh rotation-x={Math.PI}>
          <torusGeometry args={[0.4, 0.2]} />
          <meshNormalMaterial />
        </mesh>
      </group>
    </Trail>
  );
};
