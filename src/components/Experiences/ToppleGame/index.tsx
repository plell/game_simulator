import {
  MutableRefObject,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  BoxGeometry,
  CylinderGeometry,
  Group,
  MathUtils,
  Mesh,
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
  useRapier,
} from "@react-three/rapier";
import { Sky, Stars, useTexture } from "@react-three/drei";
import { useControls } from "leva";
import { useObjectIntersectsMany } from "../hooks/useObjectsIntersect";
import { GameProgress } from "../common/GameProgress";

const mouseVec3 = new Vector3();
const pointLightVec3 = new Vector3();

const translationVec = new Vector3();
const forceVec = new Vector3();

const radius = 20;

const firstLevel = 6;
const lastLevel = 12;

type LevelProps = {
  color: string;
  dimensions: number[];
  position: number[];
  geometry: CylinderGeometry | BoxGeometry;
  boundaryGeometry: TorusGeometry | BoxGeometry;
  boundaryRotation: number;
};

export const ToppleGame = () => {
  const ref = useRef<Group | null>(null);
  const cursorRef = useRef<Group | null>(null);
  const mouseRef = useRef<Vector3>(mouseVec3);
  const pointLightRef = useRef<PointLight | null>(null);
  const blowerPower = useMemo(() => 8, []);

  const instancedRigidBodiesRef = useRef<RapierRigidBody[] | null>(null);
  const ballBodyRef = useRef<RapierRigidBody | null>(null);

  const game = useGame((s) => s.game);

  const mouseDown = useGame((s) => s.mouseDown);

  const [level, setLevel] = useState(firstLevel);

  const levelProperties: LevelProps = useMemo(() => {
    const randomZ = 40 + (Math.random() - 1) * 100;
    const randFactor = Math.random() - 0.5 < 0 ? -1 : 1;
    const randomX = (Math.random() - 0.5) * 60 + randomZ * randFactor * 0.2;

    const bigSquare = 400;

    const props = {
      color: "#ff5757",
      dimensions: [bigSquare, bigSquare, 40, 20],
      position: [randomX, 5, randomZ],
      geometry: new CylinderGeometry(bigSquare, bigSquare, 1, 20),
      boundaryGeometry: new TorusGeometry(bigSquare + 5, 1, 4),
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
        if (level > 11) {
          pointLightRef.current.intensity = 10;
        }
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

  const wallCount = useMemo(() => 10, []);

  const wallInstances = useMemo(() => {
    const instances = [];

    const center = levelProperties.position;
    const radius = levelProperties.dimensions[0];

    for (let i = 0; i < wallCount; i += 1) {
      instances.push({
        key: i,
        position: [
          center[0] + (Math.random() - 0.5) * radius,
          25,
          center[2] + (Math.random() - 0.5) * radius,
        ],
        rotation: [0, Math.PI * Math.random(), 0],
      });
    }
    return instances;
  }, [levelProperties]);

  const { rapier, world } = useRapier();

  useFrame((_, delta) => {
    if (ballBodyRef.current) {
      const origin = ballBodyRef.current.translation();
      origin.y -= 0.31;
      const direction = { x: 0, y: -1, z: 0 };
      const ray = new rapier.Ray(origin, direction);
      const hit = world.castRay(ray, 10, true);

      console.log("hit?.toi", hit?.toi);

      if (hit?.toi > 1) {
        return;
      }

      const { x, y, z } = ballBodyRef.current.translation();
      const position = translationVec.set(x, y, z);

      const impulse = { x: 0, y: 0, z: 0 };
      const torque = { x: 0, y: 0, z: 0 };

      const xDirection = mouseRef.current.x - x;
      const zDirection = mouseRef.current.z - z;

      const torqueStrength = (mouseDown ? 3 * 500 : 500) * delta;
      const impulseStrength = (mouseDown ? 3 * 8000 : 8000) * delta;
      const distance = position.distanceTo(mouseRef.current);

      if (distance > 20) {
        torque.x = torqueStrength * zDirection * -1;
        torque.z = torqueStrength * xDirection * -1;

        impulse.x = impulseStrength * xDirection;
        impulse.z = impulseStrength * zDirection;
      }

      ballBodyRef.current.applyImpulse(impulse, true);
      ballBodyRef.current.applyTorqueImpulse(torque, true);
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

  const atmosphere: any = useMemo(() => {
    return {
      sky: {
        position: [0.7, 0.1504999999999995, -8.760353553682876e-17],
      },
      ambientLight: {
        intensity: 0.4,
      },
      directionalLight: {
        intensity: 0.4,
        position: [0, 0, 0],
      },
      fog: {
        color: "white",
        near: 100,
        far: 5000,
      },
    };
  }, [level]);

  return (
    <Suspense>
      {/* <fog
        attach='fog'
        color={"white"}
        near={100}
        far={5000}
        {...atmosphere?.fog}
      /> */}

      <group ref={ref} position={experienceProperties[game]?.gamePosition}>
        <directionalLight castShadow intensity={1} position={[0, 100, 0]} />
        <ambientLight intensity={0.2} />

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

        <pointLight
          ref={pointLightRef}
          castShadow
          intensity={2000}
          color={mouseDown ? "white" : "gold"}
          {...atmosphere?.pointLight}
        />

        <InstancedRigidBodies
          gravityScale={1}
          //   restitution={2}
          instances={wallInstances}
          ref={instancedRigidBodiesRef}
        >
          <instancedMesh
            castShadow
            receiveShadow
            args={[null, null, wallCount]}
          >
            <boxGeometry args={[30, 40, 2]} />
            <meshStandardMaterial
              color={levelProperties.color}
              transparent
              opacity={0.9}
            />
          </instancedMesh>
        </InstancedRigidBodies>

        <RigidBody
          position={[0, 80, 0]}
          colliders='ball'
          restitution={0.1}
          gravityScale={8}
          friction={4}
          linearDamping={0.5}
          angularDamping={0.5}
          ref={ballBodyRef}
        >
          <mesh castShadow receiveShadow scale={30}>
            <icosahedronGeometry args={[0.3, 1]} />
            <meshStandardMaterial flatShading color='mediumpurple' />
          </mesh>
        </RigidBody>

        <group ref={cursorRef}>
          <mesh rotation-x={Math.PI * -0.5}>
            <torusGeometry args={[radius, 0.5]} />
            <meshBasicMaterial
              color={mouseDown ? "white" : "gold"}
              transparent
              opacity={level > 11 ? 0.1 : 0.3}
            />
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

        <Sensor
          innerRef={sensorRef}
          levelProperties={levelProperties}
          intersectingObjectCountRef={intersectingObjectCountRef}
        />

        <mesh
          receiveShadow
          rotation-x={Math.PI * -0.5}
          position-y={0.8}
          onPointerMove={(e) => {
            const { x, y, z } = e.point;
            mouseRef.current.set(x, y, z);
          }}
        >
          <boxGeometry args={[4000, 5000, 10]} />
          <meshStandardMaterial map={diffMap} color={groundParams.color} />
        </mesh>

        <RigidBody friction={5} type={"fixed"}>
          <mesh rotation-x={Math.PI * -0.5}>
            <boxGeometry args={[1000, 1000, 10]} />
            <meshBasicMaterial transparent opacity={0} />
          </mesh>
        </RigidBody>
      </group>
    </Suspense>
  );
};

type SensorProps = {
  innerRef: MutableRefObject<Mesh | null>;
  levelProperties: LevelProps;
  intersectingObjectCountRef: MutableRefObject<number>;
};

const Sensor = ({
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

      <mesh ref={innerRef} geometry={levelProperties.geometry}>
        <meshBasicMaterial transparent opacity={0} wireframe />
      </mesh>
    </group>
  );
};
