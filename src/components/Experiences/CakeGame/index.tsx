import { useEffect, useMemo, useRef, useState } from "react";
import {
  DoubleSide,
  Group,
  Mesh,
  MeshStandardMaterial,
  PointLight,
  PointLightHelper,
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
  const pointLightRef = useRef<PointLight | null>(null);

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

const Room = () => {
  const diffMap = useTexture("textures/wood/raw_plank_wall_diff_1k.jpg");
  const dispMap = useTexture("textures/wood/raw_plank_wall_disp_1k.jpg");
  return (
    <group rotation-y={Math.PI * -0.25}>
      <mesh position-z={roomSize * -0.5}>
        <planeGeometry args={[roomSize, roomSize]} />
        <meshStandardMaterial color={colors[0]} />
      </mesh>

      <mesh position-z={roomSize * -0.5}>
        <boxGeometry args={[roomSize / 2, 10, 7]} />
        <meshStandardMaterial color={"white"} transparent opacity={0.6} />
      </mesh>

      <mesh position-x={roomSize * -0.5} rotation-y={Math.PI * 0.5}>
        <planeGeometry args={[roomSize, roomSize]} />
        <meshStandardMaterial color={colors[0]} />
      </mesh>

      <mesh position-y={roomSize * -0.5} rotation-x={Math.PI * -0.5}>
        <planeGeometry args={[roomSize, roomSize]} />
        <meshStandardMaterial
          color={colors[0]}
          roughnessMap={dispMap}
          map={diffMap}
          displacementMap={dispMap}
        />
      </mesh>
    </group>
  );
};

const columns = 6;
const rows = 4;
const width = 12;
const height = 12;
const leftPad = -(width * (columns / 2) - width / 2);
const topPad = -(height * (rows / 2) - height / 2);
const tablePadding = 5;

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
          roughness={0.8}
          transparent
          opacity={0.7}
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
