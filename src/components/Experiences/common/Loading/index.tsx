import { CameraControls, Float, Text } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { Group, Mesh, Vector3 } from "three";
import { Particles } from "../Particles";
import useGame from "../../../../Stores/useGame";

type Props = {
  text?: string;
};

export const Loading = ({ text }: Props) => {
  const ref = useRef<Mesh | null>(null);
  const textRef = useRef<Text | null>(null);

  const game = useGame((s) => s.game);

  useFrame(({ clock }) => {
    if (ref.current) {
      const elapsed = clock.getElapsedTime();
      const speed = elapsed * 0.2;
      ref.current.rotation.y = speed;
      ref.current.rotation.x = -speed;
    }
  });

  return (
    <group>
      {/* <CameraControls makeDefault maxDistance={2000} /> */}

      {text && (
        <Float position={[0, 20, 74]} floatIntensity={10} speed={6}>
          <Text ref={textRef} scale={4}>
            {text}
          </Text>
        </Float>
      )}

      {/* <mesh ref={ref}>
        <torusKnotGeometry args={[40, 0.5, 280]} />
        <meshNormalMaterial />
      </mesh> */}

      <Particles />
    </group>
  );
};
