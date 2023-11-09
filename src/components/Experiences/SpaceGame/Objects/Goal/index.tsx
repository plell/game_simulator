import { useFrame } from "@react-three/fiber";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { Color, Group, MathUtils, MeshStandardMaterial, Vector3 } from "three";
import { useObjectsIntersect } from "../../../hooks/useObjectsIntersect";
import gsap from "gsap";

type Props = {
  player: MutableRefObject<Group | null>;
  addToScore?: (s: number) => void;
};

const white = new Color("white");

export const Goal = ({ player, addToScore }: Props) => {
  const ref = useRef<Group | null>(null);
  const materialRef = useRef<MeshStandardMaterial | null>(null);
  const [touched, setTouched] = useState(false);
  const [rate, setRate] = useState(1);

  const { objectsIntersect } = useObjectsIntersect(ref, player);

  useEffect(() => {
    if (objectsIntersect) {
      setTouched(true);
    }
  }, [objectsIntersect]);

  useEffect(() => {
    if (touched && addToScore) {
      addToScore(1);
    }
  }, [touched]);

  const reset = () => {
    if (ref?.current) {
      ref.current.position.y = 30;
      ref.current.scale.set(1, 1, 1);
      ref.current.rotation.y = 0;
      ref.current.position.z = 0;
    }
    if (materialRef?.current) {
      materialRef.current.emissive.set("gold");
      materialRef.current.opacity = 1;
      materialRef.current.visible = true;
      materialRef.current.emissiveIntensity = 1;
    }
    setRate(Math.random() * 2);
    setTouched(false);
  };

  useFrame(({ clock }) => {
    if (ref?.current) {
      const elapsed = clock.getElapsedTime();
      const rotation = Math.PI * 0.35;
      ref.current.rotation.x = rotation + Math.sin(elapsed * 4) * 0.05;

      ref.current.position.y -= 0.1;
      ref.current.position.x = Math.sin(elapsed * rate) * 15;

      if (touched) {
        const newScale = MathUtils.lerp(ref.current.scale.x, 10, 0.008);

        ref.current.scale.set(newScale, newScale, 1);

        if (materialRef?.current) {
          materialRef.current.emissive.lerp(white, 0.2);
          materialRef.current.opacity = MathUtils.lerp(
            materialRef.current.opacity,
            0,
            0.3
          );
          materialRef.current.emissiveIntensity = MathUtils.lerp(
            materialRef.current.emissiveIntensity,
            3,
            0.3
          );

          if (
            materialRef.current.opacity < 0.0001 &&
            materialRef.current.visible
          ) {
            materialRef.current.visible = false;
          }
        }
      }

      if (ref.current.position.y < -30) {
        reset();
      }
    }
  });

  return (
    <group position-y={30} ref={ref}>
      <mesh rotation-x={Math.PI}>
        <torusGeometry args={[2, 0.2]} />
        <meshStandardMaterial
          ref={materialRef}
          transparent
          emissive={"gold"}
          emissiveIntensity={2}
        />
      </mesh>
    </group>
  );
};
