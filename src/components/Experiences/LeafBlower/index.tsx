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
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PointLight,
  RepeatWrapping,
  TorusGeometry,
  Vector2,
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
import { Sky, Stars, useTexture, Text, Float } from "@react-three/drei";
import { useControls } from "leva";
import { useObjectIntersectsMany } from "../hooks/useObjectsIntersect";
import { GameProgress } from "../common/GameProgress";
import {
  LevelProps,
  arrowGeometry,
  environmentParamsByLevel,
} from "./constants";

const mouseVec3 = new Vector3();
const pointLightVec3 = new Vector3();

const translationVec = new Vector3();
const forceVec = new Vector3();

const radius = 20;

const firstLevel = 6;
const lastLevel = 12;

useTexture.preload("textures/sand/aerial_beach_01_diff_1k.jpg");
useTexture.preload("textures/sand/aerial_beach_01_disp_1k.jpg");

export const LeafBlower = () => {
  const ref = useRef<Group | null>(null);
  const cursorRef = useRef<Group | null>(null);
  const mouseRef = useRef<Vector3>(mouseVec3);
  const pointLightRef = useRef<PointLight | null>(null);
  const blowerPower = useMemo(() => 8, []);

  const instancedRigidBodiesRef = useRef<RapierRigidBody[] | null>(null);

  const game = useGame((s) => s.game);

  const mouseDown = useGame((s) => s.mouseDown);

  const [level, setLevel] = useState(firstLevel);

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

  const leafCount = useMemo(() => 20, []);

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
  const repeatTile = useMemo(() => new Vector2(80, 80), []);

  const diffMap = useTexture("textures/sand/aerial_beach_01_diff_1k.jpg");
  const dispMap = useTexture("textures/sand/aerial_beach_01_disp_1k.jpg");

  diffMap.wrapS = RepeatWrapping;
  diffMap.wrapT = RepeatWrapping;
  diffMap.repeat = repeatTile;
  dispMap.wrapS = RepeatWrapping;
  dispMap.wrapT = RepeatWrapping;
  dispMap.repeat = repeatTile;

  const hitSound = useMemo(() => new Audio("/audio/hit.mp3"), []);

  const playSound = (force: number) => {
    if (force > 0.4) {
      console.log("force", force);
      const vol = Math.max(0, Math.min(force, 0.4));
      console.log("vol", vol);
      hitSound.volume = vol;
      hitSound.currentTime = 0;
      hitSound.play();
    }
  };

  const atmosphere = useMemo(() => {
    return environmentParamsByLevel[level] || {};
  }, [level]);

  return (
    <Suspense>
      <fog
        attach='fog'
        color={"white"}
        near={100}
        far={5000}
        {...atmosphere?.fog}
      />
      {level > 7 && (
        <Stars
          radius={1100}
          depth={10}
          count={1000}
          factor={20}
          saturation={0.5}
          // fade
          speed={1}
          {...atmosphere?.stars}
        />
      )}
      <group ref={ref} position={experienceProperties[game]?.gamePosition}>
        <directionalLight
          castShadow
          intensity={atmosphere?.directionalLight?.intensity || 0.8}
        />
        <ambientLight intensity={atmosphere?.ambientLight?.intensity || 0.4} />

        <pointLight
          ref={pointLightRef}
          castShadow
          intensity={2000}
          color={mouseDown ? "white" : "gold"}
          {...atmosphere?.pointLight}
        />

        <Sky
          distance={450000}
          sunPosition={atmosphere?.sky?.position || sunParams.position}
        />

        <GameProgress
          position={gameProgressPosition}
          type='bar'
          max={instancedRigidBodiesRef.current?.length || 1}
          score={0}
          scoreInverted
          scoreRef={intersectingObjectCountRef}
          setLevel={(l) => {
            if (l < lastLevel + 1) {
              setLevel(l);
            } else {
              setLevel(firstLevel);
            }
          }}
          level={level}
          levelSuffix=':00 PM'
        />

        <group position={[0, 30, 90]}>
          <pointLight
            visible={level >= 11}
            position={[0, 0, 0]}
            castShadow
            intensity={5000}
            color={"orange"}
          />
        </group>

        <InstancedRigidBodies
          gravityScale={3}
          instances={leafInstances}
          ref={instancedRigidBodiesRef}
          // onCollisionEnter={playSound}
          // onContactForce={(payload) => {
          //   playSound(payload.totalForceMagnitude / 10000);
          // }}
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

        <Sensor
          showText={level === firstLevel}
          innerRef={sensorRef}
          levelProperties={levelProperties}
          intersectingObjectCountRef={intersectingObjectCountRef}
        />

        <group ref={cursorRef}>
          <mesh rotation-x={Math.PI * -0.5}>
            <torusGeometry args={[radius, 0.4]} />
            <meshBasicMaterial
              color={mouseDown ? "white" : "gold"}
              transparent
              opacity={0.8}
            />
          </mesh>
        </group>

        <mesh
          receiveShadow
          rotation-x={Math.PI * -0.5}
          onPointerMove={(e) => {
            const { x, y, z } = e.point;
            mouseRef.current.set(x, y, z);
          }}
        >
          <boxGeometry args={[4000, 5000, 10]} />
          <meshStandardMaterial
            map={diffMap}
            displacementMap={dispMap}
            displacementScale={0.2}
            color={groundParams.color}
          />
        </mesh>

        <RigidBody friction={5} type={"fixed"}>
          <mesh rotation-x={Math.PI * -0.5}>
            <boxGeometry args={[500, 1000, 10]} />
            <meshBasicMaterial transparent opacity={0} />
          </mesh>
        </RigidBody>
      </group>
    </Suspense>
  );
};

type SensorProps = {
  showText: boolean;
  innerRef: MutableRefObject<Mesh | null>;
  levelProperties: LevelProps;
  intersectingObjectCountRef: MutableRefObject<number>;
};

const textMaterial = new MeshBasicMaterial({ transparent: true, opacity: 0.7 });

const Sensor = ({
  showText,
  innerRef,
  levelProperties,
  intersectingObjectCountRef,
}: SensorProps) => {
  const ringMaterial = useRef<MeshStandardMaterial | null>(null);

  useFrame(() => {
    if (ringMaterial.current) {
      ringMaterial.current.emissiveIntensity = MathUtils.lerp(
        ringMaterial.current.emissiveIntensity,
        intersectingObjectCountRef.current < 1 ? 1.6 : 0,
        0.1
      );
    }
  });

  return (
    <group position={levelProperties.position}>
      {showText && (
        <Float
          floatingRange={[-2, 2]}
          speed={7}
          position-y={20}
          visible={showText}
        >
          <Text fontSize={4} material={textMaterial}>
            CLEAR
          </Text>
          <mesh
            rotation-z={Math.PI}
            position-y={-5}
            scale={0.1}
            geometry={arrowGeometry}
            material={textMaterial}
          />
        </Float>
      )}
      <mesh
        geometry={levelProperties.boundaryGeometry}
        rotation-x={levelProperties.boundaryRotation}
      >
        <meshStandardMaterial
          ref={ringMaterial}
          color={"#ffffff"}
          roughness={0}
          emissive={"#ffffff"}
          emissiveIntensity={0}
        />
      </mesh>

      <mesh
        ref={innerRef}
        geometry={levelProperties.geometry}
        visible={false}
      />
    </group>
  );
};
