import {
  MutableRefObject,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  CylinderGeometry,
  Group,
  Mesh,
  PointLight,
  TorusGeometry,
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
import { Sky } from "@react-three/drei";
import { useControls } from "leva";
import { useObjectIntersectsMany } from "../hooks/useObjectsIntersect";
import { GameProgress } from "../common/GameProgress";
import { LevelProps } from "./constants";

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

  const [level, setLevel] = useState(1);

  const levelProperties: LevelProps = useMemo(() => {
    const randomZ = 40 + (Math.random() - 1) * 100;
    const randFactor = Math.random() - 0.5 < 0 ? -1 : 1;
    const randomX = (Math.random() - 0.5) * 60 + randomZ * randFactor * 0.2;

    const randomSize = Math.random() * 30 + 10;
    const props = {
      color: "#ff5757",
      dimensions: [randomSize, randomSize, 40, 20],
      position: [randomX, 5, randomZ],
      geometry: new CylinderGeometry(randomSize, randomSize, 40, 20),
      boundaryGeometry: new TorusGeometry(randomSize + 5, 1, 4),
      boundaryRotation: Math.PI * 0.5,
    };

    return props;
  }, [level]);

  useEffect(() => {
    if (instancedRigidBodiesRef?.current?.length) {
      const zero = new Vector3();
      instancedRigidBodiesRef?.current?.forEach((rb) => {
        rb.setAngvel(zero, true);
        rb.setLinvel(zero, true);
      });
    }
  }, [level]);

  useFrame(() => {
    if (cursorRef.current && mouseRef.current) {
      cursorRef.current.position.lerp(mouseRef.current, 0.1);
      if (pointLightRef.current) {
        pointLightRef.current.position.lerp(
          pointLightVec3.set(mouseRef.current.x, 30, mouseRef.current.z),
          0.1
        );
      }
    }
  });

  const sunParams = useControls("sun", {
    position: {
      value: [0.7, 0.1504999999999995, -8.760353553682876e-17],
    },
  });

  const groundParams = useControls("ground", {
    color: "#ffad69",
  });

  const leafCount = useMemo(() => 40, []);

  const leafInstances = useMemo(() => {
    const instances = [];

    const center = levelProperties.position;
    const radius = levelProperties.dimensions[0];

    for (let i = 0; i < leafCount; i += 1) {
      instances.push({
        key: i,
        position: [
          center[0] + (Math.random() - 0.5) * radius,
          10,
          center[2] + (Math.random() - 0.5) * radius,
        ],
        rotation: [
          Math.random() - 0.5,
          Math.random() - 0.5,
          Math.random() - 0.5,
        ],
      });
    }
    return instances;
  }, [levelProperties]);

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
              y: 40,
              z: zDirection * blowerPower,
            };

            const force = forceVec.set(forces.x, forces.y, forces.z);
            rb.applyImpulse(force, true);
            const torque = forceVec.set(
              forces.x * 0.2,
              forces.y * 0.2,
              forces.z * 0.2
            );
            rb.applyTorqueImpulse(torque, true);
          }
        }
      });
    }
  });

  const sensorRef = useRef<Mesh | null>(null);

  const intersectingObjectCountRef = useObjectIntersectsMany(
    sensorRef,
    instancedRigidBodiesRef
  );

  const gameProgressPosition = useMemo(() => new Vector3(0, 50, 0), []);

  return (
    <Suspense>
      <fog attach='fog' color='white' near={100} far={5000} />
      <group ref={ref} position={experienceProperties[game]?.gamePosition}>
        <directionalLight intensity={0.8} />
        <ambientLight intensity={0.4} />

        <GameProgress
          position={gameProgressPosition}
          type='bar'
          max={instancedRigidBodiesRef.current?.length || 1}
          score={0}
          scoreInverted
          scoreRef={intersectingObjectCountRef}
          setLevel={(l) => setLevel(l)}
          level={level}
        />

        <Sky distance={450000} sunPosition={sunParams.position} />
        <pointLight
          ref={pointLightRef}
          castShadow
          intensity={2000}
          color={mouseDown ? "white" : "gold"}
        />

        <InstancedRigidBodies
          gravityScale={3}
          instances={leafInstances}
          ref={instancedRigidBodiesRef}
        >
          <instancedMesh
            castShadow
            receiveShadow
            args={[null, null, leafCount]}
          >
            <boxGeometry args={[3, 0.4, 4]} />
            <meshStandardMaterial color={levelProperties.color} />
          </instancedMesh>
        </InstancedRigidBodies>

        <Sensor innerRef={sensorRef} levelProperties={levelProperties} />

        <group ref={cursorRef}>
          <mesh rotation-x={Math.PI * -0.5}>
            <torusGeometry args={[radius, 1]} />
            <meshBasicMaterial color={mouseDown ? "white" : "gold"} />
          </mesh>
          <mesh>
            <sphereGeometry args={[radius, 20]} />
            <meshStandardMaterial
              wireframe
              color={mouseDown ? "white" : "gold"}
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
    </Suspense>
  );
};

type SensorProps = {
  innerRef: MutableRefObject<Mesh | null>;
  levelProperties: LevelProps;
};

const Sensor = ({ innerRef, levelProperties }: SensorProps) => {
  return (
    <group position={levelProperties.position}>
      <mesh
        geometry={levelProperties.boundaryGeometry}
        rotation-x={levelProperties.boundaryRotation}
      >
        <meshStandardMaterial color={"#ffffff"} roughness={0} />
      </mesh>

      <mesh ref={innerRef} geometry={levelProperties.geometry}>
        <meshBasicMaterial transparent opacity={0} wireframe />
      </mesh>
    </group>
  );
};
