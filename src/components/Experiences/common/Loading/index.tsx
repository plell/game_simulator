import { CameraControls, Float, Text } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { Group, Mesh, Vector3 } from "three";
import { Particles } from "../Particles";

type Props = {
  text?: string;
  position?: Vector3;
};

export const Loading = ({ text, position }: Props) => {
  const ref = useRef<Mesh | null>(null);
  const textRef = useRef<Text | null>(null);

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
      {text && (
        <Float position={position || [0, 20, 74]} floatIntensity={10} speed={6}>
          <Text ref={textRef} scale={4}>
            {text}
          </Text>
        </Float>
      )}

      <Particles />
    </group>
  );
};
