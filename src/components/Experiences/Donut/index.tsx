import { useEffect, useMemo, useRef, useState } from "react";
import {
  Color,
  CylinderGeometry,
  DirectionalLight,
  Group,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Vector3,
} from "three";

import { useCursorHover } from "../hooks/useCursorHover";
import { useFrame } from "@react-three/fiber";
import { normalScale, data } from "./constants";
import { Instance, Instances, Merged, useGLTF } from "@react-three/drei";

const sprinkleMaterial = new MeshBasicMaterial();
const sprinkleGeometry = new CylinderGeometry(0.2, 0.3, 1);

export const Donut = () => {
  const [focused, setFocused] = useState(false);

  const donut = useGLTF("./models/donut.glb");
  const sprinkle = useGLTF("./models/sprinkle.glb");

  useEffect(() => {
    donut.scene.children.forEach((mesh) => {
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    });
  }, []);

  const ref = useRef<Group | null>(null);
  const sprinkleRef = useRef<Group | null>(null);
  const donutRef = useRef<Group | null>(null);

  useCursorHover(focused);

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

      <directionalLight intensity={2} position={[0, -300, 0]} />
      <ambientLight intensity={0.4} />

      {/* <pointLight color={"#ffffff"} position={[0, 0, 0]} intensity={8} /> */}

      <pointLight color={"#ffffff"} position={[0, 20, 0]} intensity={90} />

      <hemisphereLight args={["#ffffff", "yellow"]} intensity={2} />

      <Instances
        range={200}
        material={sprinkleMaterial}
        geometry={sprinkleGeometry}
      >
        <group ref={sprinkleRef} position={[0, 0, 0]}>
          {data.map((props, i) => (
            <Shoe key={i} {...props} />
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

function Shoe({ random, color = new Color(), ...props }) {
  const ref = useRef<typeof Instance | null>(null);
  const [hovered, setHover] = useState(false);
  useFrame((state) => {
    const t = state.clock.getElapsedTime() + random * 10000;
    if (ref.current) {
      ref.current.rotation.set(
        Math.cos(t / 4) / 2,
        Math.sin(t / 4) / 2,
        Math.cos(t / 1.5) / 2
      );
      ref.current.position.y = Math.sin(t / 1.5) / 2;
      ref.current.scale.x =
        ref.current.scale.y =
        ref.current.scale.z =
          MathUtils.lerp(ref.current.scale.z, hovered ? 1.4 : 1, 0.1);
      ref.current.color.lerp(
        color.set(hovered ? "red" : "white"),
        hovered ? 1 : 0.1
      );
    }
  });
  return (
    <group {...props}>
      <Instance
        ref={ref}
        onPointerOver={(e) => (e.stopPropagation(), setHover(true))}
        onPointerOut={(e) => setHover(false)}
      />
    </group>
  );
}
