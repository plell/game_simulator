import {
  MutableRefObject,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Group,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PointLight,
  TorusKnotGeometry,
  Vector3,
} from "three";

import useGame from "../../../Stores/useGame";
import { experienceProperties } from "../../../Stores/constants";

import { useFrame } from "@react-three/fiber";

import { RapierRigidBody, RigidBody } from "@react-three/rapier";

const mouseVec3 = new Vector3();
const pointLightVec3 = new Vector3();

const radius = 20;

export const LeafBlower = () => {
  const ref = useRef<Group | null>(null);
  const cursorRef = useRef<Group | null>(null);
  const mouseRef = useRef<Vector3>(mouseVec3);
  const pointLightRef = useRef<PointLight | null>(null);

  const game = useGame((s) => s.game);

  const mouseDown = useGame((s) => s.mouseDown);

  useFrame(({ camera, mouse }) => {
    // const { x, y, z } = experienceProperties[game].cameraPosition;
    // // camera.position.lerp(vec3.set(x, y, z * -(mouse.y - 0.1)), 0.01);

    if (cursorRef.current && mouseRef.current) {
      cursorRef.current.position.lerp(mouseRef.current, 0.1);
      if (pointLightRef.current) {
        pointLightRef.current.position.lerp(
          pointLightVec3.set(mouseRef.current.x, 50, mouseRef.current.z),
          0.1
        );
      }
    }
  });

  const leaves = useMemo(() => {
    const l = [];

    for (let i = 0; i < 20; i++) {
      l.push(<Leaf key={`leaf-${i}`} offset={i} mouseRef={mouseRef} />);
    }

    return l;
  }, [cursorRef]);

  return (
    <group ref={ref} position={experienceProperties[game]?.gamePosition}>
      <directionalLight intensity={3} />
      <pointLight
        ref={pointLightRef}
        castShadow
        intensity={6000}
        color={"#ffffff"}
      />

      {leaves}
      <group ref={cursorRef}>
        <mesh rotation-x={Math.PI * -0.5}>
          <torusGeometry args={[radius, 1]} />
          <meshBasicMaterial color={mouseDown ? "blue" : "white"} />
        </mesh>
        <mesh>
          <sphereGeometry args={[radius, 20]} />
          <meshStandardMaterial
            wireframe
            color={mouseDown ? "blue" : "white"}
            transparent
            opacity={0.2}
          />
        </mesh>
      </group>

      <RigidBody friction={5} type={"fixed"}>
        <mesh
          receiveShadow
          rotation-x={Math.PI * -0.5}
          onPointerMove={(e) => {
            const { x, y, z } = e.point;
            mouseRef.current.set(x, y, z);
          }}
        >
          <boxGeometry args={[7000, 10000, 1]} />
          <meshStandardMaterial color={"gray"} />
        </mesh>
      </RigidBody>
    </group>
  );
};

type LeafProps = {
  offset: number;
  mouseRef: MutableRefObject<Vector3>;
};

const geometry = new TorusKnotGeometry();
const material = new MeshStandardMaterial({ color: "lime" });

const translationVec = new Vector3();
const forceVec = new Vector3();

const Leaf = ({ offset, mouseRef }: LeafProps) => {
  const ref = useRef<RapierRigidBody | null>(null);
  const mouseDown = useGame((s) => s.mouseDown);

  const wind = useMemo(() => {
    return new Vector3(1, 1, 1);
  }, []);

  useFrame(() => {
    if (ref.current) {
      ref.current.applyImpulse(wind, true);
      if (mouseDown) {
        const { x, y, z } = ref.current.translation();
        const position = translationVec.set(x, y, z);
        if (position.distanceTo(mouseRef.current) < radius) {
          const xDirection = x - mouseRef.current.x;
          const zDirection = z - mouseRef.current.z;
          const forces = {
            x: xDirection * 10,
            y: 50,
            z: zDirection * 10,
          };

          const force = forceVec.set(forces.x, forces.y, forces.z);
          ref.current.applyImpulse(force, true);
        }
      }
    }
  });

  return (
    <RigidBody gravityScale={2} ref={ref} position={[0, 30 + offset * 6, 0]}>
      <mesh castShadow geometry={geometry} material={material} />
    </RigidBody>
  );
};
