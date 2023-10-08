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
  Matrix4,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PointLight,
  Quaternion,
  TorusKnotGeometry,
  Vector3,
} from "three";

import useGame from "../../../Stores/useGame";
import { experienceProperties } from "../../../Stores/constants";

import { useFrame } from "@react-three/fiber";

import {
  InstancedRigidBodies,
  RapierRigidBody,
  RigidBody,
} from "@react-three/rapier";
import { Instance, Instances, Sky, Trail } from "@react-three/drei";
import { useControls } from "leva";

const mouseVec3 = new Vector3();
const pointLightVec3 = new Vector3();

const translationVec = new Vector3();
const forceVec = new Vector3();

const radius = 20;

export const LeafBlower = () => {
  const ref = useRef<Group | null>(null);
  const cursorRef = useRef<Group | null>(null);
  const mouseRef = useRef<Vector3>(mouseVec3);
  const pointLightRef = useRef<PointLight | null>(null);
  const blowerPower = useMemo(() => 8, []);

  const instancedRigidBodiesRef = useRef<RapierRigidBody[] | null>(null);

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

  const sunParams = useControls("sun", {
    position: {
      value: [0.7789999999999998, 0.20099999999999996, -8.760353553682876e-17],
    },
  });

  const groundParams = useControls("ground", {
    color: "#ffad69",
  });

  const leafCount = useMemo(() => 100, []);

  const leafInstances = useMemo(() => {
    const instances = [];

    for (let i = 0; i < leafCount; i += 1) {
      instances.push({
        key: i,
        position: [
          (Math.random() - 0.5) * 100,
          6,
          30 + (Math.random() - 0.5) * 100,
        ],
        rotation: [Math.random(), Math.random(), Math.random()],
      });
    }
    return instances;
  }, []);

  useFrame(() => {
    // for every leaf!
    if (instancedRigidBodiesRef?.current?.length) {
      instancedRigidBodiesRef?.current?.forEach((rb) => {
        if (mouseDown) {
          const { x, y, z } = rb.translation();
          const position = translationVec.set(x, y, z);
          if (position.distanceTo(mouseRef.current) < radius) {
            const xDirection = x - mouseRef.current.x;
            const zDirection = z - mouseRef.current.z;
            const forces = {
              x: xDirection * blowerPower,
              y: 30,
              z: zDirection * blowerPower,
            };

            const force = forceVec.set(forces.x, forces.y, forces.z);
            rb.applyImpulse(force, true);
          }
        }
      });
    }
  });
  return (
    <group ref={ref} position={experienceProperties[game]?.gamePosition}>
      <directionalLight intensity={2} />

      <Sky
        distance={450000}
        sunPosition={sunParams.position}
        // inclination={0}
        // azimuth={0.25}
      />
      <pointLight
        ref={pointLightRef}
        castShadow
        intensity={4000}
        color={"#ffffff"}
      />

      <InstancedRigidBodies
        gravityScale={3}
        instances={leafInstances}
        ref={instancedRigidBodiesRef}
      >
        <instancedMesh castShadow receiveShadow args={[null, null, leafCount]}>
          <boxGeometry args={[3, 0.4, 4]} />
          <meshStandardMaterial color={"#ff5757"} />
        </instancedMesh>
      </InstancedRigidBodies>

      {/* <Instances material={material} geometry={geometry}>
        {leaves.map((l, i) => {
          return <Leaf key={i} {...l} />;
        })}
      </Instances> */}

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
          <boxGeometry args={[7000, 10000, 10]} />
          <meshStandardMaterial color={groundParams.color} />
        </mesh>
      </RigidBody>
    </group>
  );
};
