import { useEffect, useMemo, useRef, useState } from "react";
import {
  Color,
  CylinderGeometry,
  Group,
  MathUtils,
  MeshBasicMaterial,
} from "three";

import { useFrame } from "@react-three/fiber";
import { normalScale, data, rainbowColors } from "./constants";
import { Instance, Instances, useGLTF } from "@react-three/drei";

const sprinkleMaterial = new MeshBasicMaterial();
const sprinkleGeometry = new CylinderGeometry(0.2, 0.2, 1.3);

useGLTF.preload("./models/donut_less.glb");

export const Donut = () => {
  const donut = useGLTF("./models/donut_less.glb");

  const ref = useRef<Group | null>(null);
  const sprinkleRef = useRef<Group | null>(null);
  const donutRef = useRef<Group | null>(null);

  useFrame((_, delta) => {
    if (ref?.current) {
      const newScale = ref.current.scale.lerp(normalScale, 0.2);
      ref.current.scale.set(newScale.x, newScale.y, newScale.z);
      ref.current.rotation.y -= 0.6 * delta;
    }
    if (sprinkleRef.current) {
      sprinkleRef.current.rotation.y += 0.2 * delta;
      sprinkleRef.current.rotation.z += 0.1 * delta;
    }
  });

  return (
    <>
      <directionalLight intensity={3} />
      <hemisphereLight args={["#ffffff", "yellow"]} intensity={2} />

      <Instances
        range={500}
        material={sprinkleMaterial}
        geometry={sprinkleGeometry}
      >
        <group ref={sprinkleRef} position={[0, 0, 0]}>
          {data.map((props, i) => (
            <Sprinkle key={i} {...props} />
          ))}
        </group>
      </Instances>

      <group ref={ref}>
        <primitive
          ref={donutRef}
          object={donut.scene}
          scale={1}
          rotation-x={Math.PI * 0.3}
        />
      </group>
    </>
  );
};

const white = new Color("#ffffff");

function Sprinkle({ random, color = new Color(), ...props }) {
  const ref = useRef<typeof Instance | null>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime() + random * 10000;
    if (ref.current) {
      ref.current.rotation.set(
        Math.cos(t / 4) / 2,
        Math.sin(t / 4) / 2,
        Math.cos(t / 1.5) / 2
      );
      ref.current.position.y = Math.sin(t / 1.5) / 2;
    }
  });
  return (
    <group {...props}>
      <Instance ref={ref} color={white} />
    </group>
  );
}
