import { MutableRefObject, useEffect, useState } from "react";
import { Group, Vector3 } from "three";
import { useGLTF } from "@react-three/drei";

import { useFrame } from "@react-three/fiber";
import gsap, { Power2 } from "gsap";

type Props = {
  position: [x: number, y: number, z: number];
  playerRef: MutableRefObject<Group | null>;
  mouseRef: MutableRefObject<Vector3>;
  score: number;
};

const tiltStrength = 0.14;
const reuseableVec3 = new Vector3();

useGLTF.preload("./models/spaceship_bw.glb");

export const Spaceship = ({ position, playerRef, mouseRef, score }: Props) => {
  const model = useGLTF("./models/spaceship_bw.glb");
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (playerRef?.current && score > 0) {
      setAnimating(true);
      gsap
        .to(playerRef?.current.rotation, {
          duration: 2,
          ease: Power2.easeOut,
          keyframes: {
            "0%": new Vector3(0, 0, 0),
            "100%": new Vector3(0, Math.PI * 4, 0),
          },
          onComplete: () => {
            setAnimating(false);
          },
        })
        .play();
    }
  }, [score]);

  useFrame(() => {
    if (mouseRef.current && playerRef?.current) {
      const mouse = mouseRef.current;

      const playerPosition = playerRef.current.position;
      const rotation = playerRef.current.rotation;

      playerPosition.lerp(reuseableVec3.set(mouse.x, mouse.y / 2 + 4, 0), 0.09);

      if (!animating) {
        rotation.y = (mouse.x - playerPosition.x) * tiltStrength;
      }
    }
  });

  return (
    <>
      <group position={position}>
        <group ref={playerRef}>
          <primitive
            rotation-y={Math.PI * -0.5}
            rotation-x={Math.PI * 0.5}
            object={model.scene.clone()}
            scale={0.14}
          />
        </group>
      </group>
    </>
  );
};
