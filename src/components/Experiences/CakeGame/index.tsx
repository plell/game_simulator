import { useEffect, useMemo, useRef, useState } from "react";
import {
  DoubleSide,
  Group,
  Mesh,
  MeshStandardMaterial,
  PointLight,
  PointLightHelper,
  RepeatWrapping,
  Vector2,
  Vector3,
} from "three";

import useGame from "../../../Stores/useGame";
import { experienceProperties } from "../../../Stores/constants";

import { Merged, useGLTF, useHelper, useTexture } from "@react-three/drei";

import gsap, { Bounce, Power4 } from "gsap";
import { Lights } from "../../Lights";

import { boxPosition, colors, regularScale, roomSize } from "./constants";
import { Donut } from "./Donut";
import { GameProgress } from "../common/GameProgress";

export const CakeGame = () => {
  const ref = useRef<Group | null>(null);

  const game = useGame((s) => s.game);
  const setSelectedDonutIds = useGame((s) => s.setSelectedDonutIds);
  const selectedDonutIds = useGame((s) => s.selectedDonutIds);

  useEffect(() => {
    return () => {
      setSelectedDonutIds([]);
    };
  }, []);

  const gameProgressPosition = useMemo(() => new Vector3(0, 40, 0), []);

  return (
    <>
      <group ref={ref} position={experienceProperties[game]?.gamePosition}>
        <Lights />

        <Room />

        <DonutBox />
        <Donuts />
        <WoodTable />
        <GameProgress
          position={gameProgressPosition}
          type='points'
          max={4}
          score={selectedDonutIds.length}
        />
      </group>
    </>
  );
};

const windowWidth = roomSize / 2 - 50;
const Room = () => {
  const diffMap = useTexture("textures/wood/raw_plank_wall_diff_1k.jpg");
  const repeatTile = useMemo(() => new Vector2(4, 4), []);
  diffMap.wrapS = RepeatWrapping;
  diffMap.wrapT = RepeatWrapping;
  diffMap.repeat = repeatTile;

  return (
    <group rotation-y={Math.PI * -0.25}>
      <mesh receiveShadow position-z={roomSize * -0.5}>
        <planeGeometry args={[roomSize, roomSize]} />
        <meshStandardMaterial color={colors[0]} />
      </mesh>

      {/* window */}

      <rectAreaLight
        position-z={roomSize * -0.5 + 0.2}
        position-y={40}
        // rotation-y={Math.PI}
        castShadow
        intensity={1.5}
        width={windowWidth}
        height={120}
      />

      <mesh
        receiveShadow
        castShadow
        position-z={roomSize * -0.5}
        position-y={-20}
      >
        <boxGeometry args={[windowWidth, 1, 60]} />
        <meshStandardMaterial color={"white"} />
      </mesh>

      <mesh
        receiveShadow
        position-x={roomSize * -0.5}
        rotation-y={Math.PI * 0.5}
      >
        <planeGeometry args={[roomSize, roomSize]} />
        <meshStandardMaterial color={"white"} />
      </mesh>

      <mesh
        receiveShadow
        position-y={roomSize * -0.5}
        rotation-x={Math.PI * -0.5}
      >
        <planeGeometry args={[roomSize, roomSize]} />
        <meshStandardMaterial map={diffMap} />
      </mesh>
    </group>
  );
};

const columns = 7;
const rows = 4;
const width = 12;
const height = 12;
const leftPad = -(width * (columns / 2) - width / 2);
const topPad = -(height * (rows / 2) - height / 2);
const tablePadding = 0;

const WoodTable = () => {
  return (
    <group position-y={-5}>
      <mesh>
        <boxGeometry
          args={[
            columns * width + tablePadding,
            4,
            rows * height + tablePadding,
          ]}
        />

        <meshStandardMaterial
          metalness={1}
          roughness={0.6}
          transparent
          // opacity={0.7}
        />
      </mesh>
    </group>
  );
};

const DonutBox = () => {
  const donutBox = useGLTF("./models/donut_box.gltf");

  const ref = useRef<Group | null>(null);

  useEffect(() => {
    animateIn();
  }, []);

  const animateIn = () => {
    const startPosition = new Vector3(0, -100, 40);

    const moveCycle = gsap.to(startPosition, {
      duration: 2,
      keyframes: {
        ease: Bounce.easeOut,
        "0%": startPosition,
        "100%": boxPosition,
      },
      onUpdate: () => {
        if (ref?.current) {
          ref.current.position.copy(startPosition);
        }
      },
    });

    moveCycle.play();
  };

  return (
    <group
      ref={ref}
      position={boxPosition}
      rotation-y={Math.PI * -0.5}
      onClick={(e) => e.stopPropagation()}
    >
      <pointLight position={[0, 0, 0]} intensity={100} />
      <primitive object={donutBox.scene.clone()} scale={regularScale} />
    </group>
  );
};

const Donuts = () => {
  // @ts-ignore
  const { nodes } = useGLTF("./models/donut_white_lesser2.gltf");

  return (
    <Merged meshes={nodes || []}>
      {/* @ts-ignore */}
      {(models) => {
        return <DonutsWrap models={models} />;
      }}
    </Merged>
  );
};

type DonutsWrapProps = {
  models: Mesh;
};

const DonutsWrap = ({ models }: DonutsWrapProps) => {
  const donuts = useMemo(() => {
    const d = [];

    for (let c = 0; c < columns; c += 1) {
      for (let r = 0; r < rows; r += 1) {
        const pos: Vector3 = new Vector3(
          c * width + leftPad,
          0,
          r * height + topPad
        );
        d.push(
          <Donut
            key={`${c}+${r}`}
            models={models}
            position={pos}
            id={`${c}+${r}`}
          />
        );
      }
    }

    return d;
  }, []);

  return donuts;
};
