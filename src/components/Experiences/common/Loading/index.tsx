import { CameraControls, Text } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { Group, Mesh, Vector3 } from "three";
import { Particles } from "../Particles";
import { experienceProperties } from "../../../../Stores/constants";
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

  // const { camera } = useThree();

  // // revert camera position
  // useEffect(() => {
  //   return () => {
  //     const position = experienceProperties[game]?.cameraPosition;
  //     const target = experienceProperties[game]?.cameraTarget;

  //     if (position && target) {
  //       camera.position.set(position.x, position.y, position.z);
  //       camera.lookAt(target);
  //     }
  //   };
  // });

  return (
    <group>
      {/* <CameraControls makeDefault maxDistance={2000} /> */}
      <directionalLight />
      <pointLight color={"pink"} position={[0, 0, 8]} intensity={90} />

      {text && (
        <Text ref={textRef} scale={4}>
          {text}
        </Text>
      )}

      <mesh ref={ref}>
        <torusKnotGeometry args={[40, 0.5, 280]} />
        <meshNormalMaterial />
      </mesh>

      <Particles />
    </group>
  );
};
