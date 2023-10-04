import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import gsap from "gsap";
import { Bounce } from "gsap";
import { useLayoutEffect, useRef } from "react";
import { Group, Vector3 } from "three";

type Props = {
  text: string;
};

export const offset = new Vector3(0, -30, -100); // Offset from the camera's position

export const Congrats = ({ text }: Props) => {
  const ref = useRef<Group>(null);

  useFrame(({ camera }) => {
    if (ref.current) {
      // Create a new copy of the offset
      const offsetCopy = offset.clone();

      // Apply the camera's rotation to the offset copy
      offsetCopy.applyQuaternion(camera.quaternion);

      // Copy the camera's position and rotation to the panel
      ref.current.position.copy(camera.position);
      ref.current.quaternion.copy(camera.quaternion);

      // Add the rotated offset to the panel's position
      ref.current.position.add(offsetCopy);
    }
  });

  useLayoutEffect(() => {
    // if (ref.current) {
    //   const start = new Vector3(40, 0, 0);
    //   const end = new Vector3(-40, 0, 0);
    //   const values = {
    //     x: 0,
    //     y: 0,
    //     z: 0,
    //     zRotate: 0,
    //   };
    //   gsap.to(values, {
    //     duration: 2,
    //     keyframes: {
    //       ease: Bounce.easeOut,
    //       "0%": { x: 30, y: 0, z: 0, zRotate: 0 },
    //       "50%": { x: 0, y: 0, z: 20, zRotate: Math.PI },
    //       "100%": { x: -30, y: 0, z: 0, zRotate: 0 },
    //     },
    //     onUpdate: () => {
    //       if (ref?.current) {
    //         const { x, y, z, zRotate } = values;
    //         // ref.current.position.set(x, y, z);
    //         // ref.current.rotation.z = zRotate;
    //       }
    //     },
    //   });
    // }
  }, []);

  return (
    <group ref={ref}>
      <Text>{text}</Text>
      <mesh>
        <boxGeometry args={[10, 10, 10]} />
        <meshStandardMaterial color='red' />
      </mesh>
    </group>
  );
};
