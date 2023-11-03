import * as THREE from "three";
import {
  InstancedRigidBodies,
  RapierRigidBody,
  RigidBody,
} from "@react-three/rapier";
import { useState, useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useTexture } from "@react-three/drei";
import useGame from "./stores/useGame";
import { TextureLoader } from "three";
import { Shader } from "../Psychedelic/Shader";

const loader = new TextureLoader();

const holes = loader.load("./images/holes.png");

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const floor1Material = new THREE.MeshStandardMaterial({
  color: "#ffffff",
  opacity: 0.3,
  transparent: true,
});

const floorEnd = new THREE.MeshStandardMaterial({
  color: "white",
  transparent: true,
  emissive: "#fff",
  emissiveIntensity: 0.7,
});
const floor2Material = new THREE.MeshStandardMaterial({
  color: "#ffffff",
});
const obstacleMaterial = new THREE.MeshStandardMaterial({
  color: "orangered",
  transparent: true,
  opacity: 0.9,
});
const wallMaterial = new THREE.MeshStandardMaterial({
  color: "white",
  emissive: "white",
  emissiveIntensity: 0.9,
});

function BlockStart({ position = [0, 0, 0], scaleX = 1 }) {
  return (
    <group position={position}>
      {/* floor */}
      <mesh
        geometry={boxGeometry}
        material={floor1Material}
        position-y={-0.1}
        scale={[4 + scaleX, 0.1, 2]}
        receiveShadow
      />
    </group>
  );
}

useGLTF.preload("./models/hamburger.glb");

function BlockEnd({ position = [0, 0, 0] }) {
  const phase = useGame((s) => s.phase);

  const ref = useRef(null);

  useFrame(({ clock }, delta) => {
    if (ref.current) {
      ref.current.rotation.y += 1 * delta;
      ref.current.rotation.z = Math.sin(clock.getElapsedTime() * 8) * 0.1;
      if (phase === "ended") {
        const scale = THREE.MathUtils.lerp(ref.current.scale.x, 0, 0.2);
        ref.current.scale.set(scale, scale, scale);
      } else {
        ref.current.scale.set(0.2, 0.2, 0.2);
      }
    }
  });

  const hamburger = useGLTF("./models/hamburger.glb");

  return (
    <group position={position}>
      {/* floor */}
      <mesh
        geometry={boxGeometry}
        material={floorEnd}
        position-y={-0.1}
        scale={[4, 0.2, 4]}
        receiveShadow
      />

      <primitive ref={ref} object={hamburger.scene} scale={0.2} />
    </group>
  );
}

function BlockSpinner({ position = [0, 0, 0] }) {
  const [speed] = useState(
    () => (Math.random() + 0.2) * (Math.random() < 0.5 ? -1 : 1)
  );
  const obstacle = useRef();
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const rotation = new THREE.Quaternion();
    rotation.setFromEuler(new THREE.Euler(0, time * speed, 0));
    if (obstacle?.current) {
      obstacle.current.setNextKinematicRotation(rotation);
    }
  });

  return (
    <group position={position}>
      {/* floor */}
      <mesh
        geometry={boxGeometry}
        material={floor2Material}
        position-y={-0.1}
        scale={[4, 0.2, 4]}
        receiveShadow
      />
      <RigidBody
        ref={obstacle}
        type={"kinematicPosition"}
        position={[0, 0.3, 0]}
        restitution={0.2}
        friction={0}
      >
        <mesh
          scale={[3.5, 0.3, 0.3]}
          geometry={boxGeometry}
          material={obstacleMaterial}
          castShadow
          receiveShadow
        />
      </RigidBody>
    </group>
  );
}

function BlockLimbo({ position = [0, 0, 0] }) {
  const [timeOffset] = useState(() => Math.random() * Math.PI * 2);
  const obstacle = useRef();
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const y = Math.sin(time + timeOffset) + 1.2;
    obstacle.current.setNextKinematicTranslation({
      x: position[0],
      y: position[1] + y,
      z: position[2],
    });
  });

  return (
    <group position={position}>
      {/* floor */}
      <mesh
        geometry={boxGeometry}
        material={floor2Material}
        position-y={-0.1}
        scale={[4, 0.2, 4]}
        receiveShadow
      />
      <RigidBody
        ref={obstacle}
        type={"kinematicPosition"}
        position={[0, 0.3, 0]}
        restitution={0.2}
        friction={0}
      >
        <mesh
          scale={[3.5, 0.3, 0.3]}
          geometry={boxGeometry}
          material={obstacleMaterial}
          castShadow
          receiveShadow
        />
      </RigidBody>
    </group>
  );
}

function BlockAxe({ position = [0, 0, 0] }) {
  const [timeOffset] = useState(() => Math.random() * Math.PI * 2);
  const obstacle = useRef();
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const x = Math.sin(time + timeOffset) * 1.25;
    if (obstacle?.current) {
      obstacle.current.setNextKinematicTranslation({
        x: position[0] + x,
        y: position[1] + 0.7,
        z: position[2],
      });
    }
  });

  return (
    <group position={position}>
      {/* floor */}
      <mesh
        geometry={boxGeometry}
        material={floor2Material}
        position-y={-0.1}
        scale={[4, 0.2, 4]}
        receiveShadow
      />
      <RigidBody
        ref={obstacle}
        type={"kinematicPosition"}
        position={[0, 0.3, 0]}
        restitution={0.2}
        friction={0}
      >
        <mesh
          scale={[1.5, 1.1, 0.3]}
          geometry={boxGeometry}
          material={obstacleMaterial}
          castShadow
          receiveShadow
        />
      </RigidBody>
    </group>
  );
}

const useVec1 = new THREE.Vector3();
const useVec2 = new THREE.Vector3();

function Bounds({ length = 1 }) {
  const wall1 = useRef<RapierRigidBody | null>(null);
  const wall2 = useRef<RapierRigidBody | null>(null);

  useFrame(({ camera }) => {
    if (wall1.current) {
      const { x, z } = wall1.current.translation();
      const pos = useVec1.set(x, camera.position.y, z);
      wall1.current.setTranslation(pos, true);
    }
    if (wall2.current) {
      const { x, z } = wall2.current.translation();
      const pos = useVec2.set(x, camera.position.y, z);
      wall2.current.setTranslation(pos, true);
    }
  });

  return (
    <group position-y={20}>
      <mesh
        scale={[0.3, 80, 4 * length]}
        // rotation-y={0.4}
        position={[6.15, 0.75, -(length * 2) + 2]}
        geometry={boxGeometry}
        material={wallMaterial}
        castShadow
      >
        <Shader />
      </mesh>

      <mesh
        scale={[0.3, 80, 4 * length]}
        // rotation-y={-0.4}
        position={[-6.15, 0.75, -(length * 2) + 2]}
        geometry={boxGeometry}
        receiveShadow
      >
        <Shader />
      </mesh>

      <group>
        <RigidBody
          ref={wall1}
          type={"fixed"}
          friction={0}
          restitution={0.2}
          userData={{ name: "right" }}
        >
          <mesh
            scale={[0.4, 5, 1]}
            position={[4.15, 0, 0]}
            geometry={boxGeometry}
            material={wallMaterial}
            castShadow
          ></mesh>
        </RigidBody>

        <RigidBody
          ref={wall2}
          type={"fixed"}
          friction={0}
          restitution={0.2}
          userData={{ name: "left" }}
        >
          <mesh
            scale={[0.4, 5, 1]}
            position={[-4.15, 0, 0]}
            geometry={boxGeometry}
            material={wallMaterial}
            receiveShadow
          />
        </RigidBody>
      </group>
    </group>
  );
}

function Level({ count = 4, types = [BlockSpinner, BlockAxe, BlockLimbo] }) {
  const instancedRigidBodiesRef = useRef<RapierRigidBody[] | null>(null);

  const floorCount = useMemo(() => 20, []);

  const floorInstances = useMemo(() => {
    const instances = [];

    for (let i = 0; i < floorCount; i += 1) {
      const direction = Math.random() < 0.5 ? -1 : 1;
      instances.push({
        key: i,
        position: [Math.random() * 3 * direction, i * 1.3, 0],
        scaleX: i < 1 ? 10 : Math.random() * 2,
      });
    }
    return instances;
  }, []);

  const floors = useMemo(() => {
    const floors = floorInstances.map((f, i) => {
      return (
        <RigidBody type='fixed' key={`${i}-rigid`} colliders={"hull"}>
          <BlockStart position={f.position} scaleX={f.scaleX} />
        </RigidBody>
      );
    });
    return floors;
  }, [floorInstances]);

  return (
    <>
      {floors}

      <Bounds length={count + 2} />
    </>
  );
}

export { Level, BlockSpinner, BlockAxe, BlockLimbo };
