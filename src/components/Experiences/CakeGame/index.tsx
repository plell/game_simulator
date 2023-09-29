import { Fragment, MutableRefObject, useMemo, useRef, useState } from "react";
import { Color, Group, Mesh, Vector3 } from "three";

import useGame from "../../../Stores/useGame";
import { experienceProperties } from "../../../Stores/constants";

import { useStartButton } from "../hooks/useStartButton";
import { Loading } from "../common/Loading";

import { Merged, Select, useGLTF, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

export const CakeGame = () => {
  const ref = useRef<Group | null>(null);

  const game = useGame((s) => s.game);

  return (
    <group ref={ref} position={experienceProperties[game]?.gamePosition}>
      <directionalLight position={[0, 80, 100]} intensity={3} />
      {/* <pointLight position={[0, 8, 0]} intensity={5} /> */}
      {/* <color attach='background' args={[white]} /> */}

      <CakeLayer />

      <WoodTable />
    </group>
  );
};

const columns = 8;
const rows = 12;
const width = 12;
const height = 12;
const leftPad = -(width * (columns / 2) - width / 2);
const topPad = -(height * (rows / 2) - height / 2);
const tablePadding = 12;

const WoodTable = () => {
  const dispMap = useTexture(
    "textures/wood/wood_cabinet_worn_long_disp_1k.jpg"
  );
  const diffMap = useTexture(
    "textures/wood/wood_cabinet_worn_long_diff_1k.jpg"
  );
  return (
    <group position-y={-5} receiveShadow>
      <mesh>
        <boxGeometry
          args={[
            columns * width + tablePadding,
            4,
            rows * height + tablePadding,
          ]}
        />
        <meshStandardMaterial
          color='pink'
          map={diffMap}
          roughnessMap={dispMap}
          displacementMap={dispMap}
        />
      </mesh>
    </group>
  );
};

const CakeLayer = () => {
  // @ts-ignore
  const { nodes } = useGLTF("./models/donut_white.gltf");

  return (
    <Merged meshes={nodes || []}>
      {/* @ts-ignore */}
      {(models) => <DonutsWrap models={models} />}
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
        const pos: [x: number, y: number, z: number] = [
          c * width + leftPad,
          0,
          r * height + topPad,
        ];
        d.push(<Donut key={`${c}+${r}`} models={models} position={pos} />);
      }
    }

    return d;
  }, []);

  return (
    <Select
      onChange={() => {
        console.log("hi!");
      }}
      onChangePointerUp={() => {
        console.log("onChangePointerUp!");
      }}
    >
      {donuts}
    </Select>
  );
};

type DonutProps = {
  models: Record<string, any>;
  position?: [x: number, y: number, z: number];
  rotation?: [x: number, y: number, z: number];
};

const frostingColors = ["#F3E5AB", "#7B3F00", "#FF496C", "#A04000"];

const doughColors = [
  "#FFDAB9",
  "#FFC3A0",
  "#FFB6C1",
  "#FFA07A",
  "#F0E68C",
  "#E0FFFF",
  "#FF6347",
  "#FFE4B5",
  "#FF4500",
  "#DAA520",
  "#D2691E",
  "#8B4513",
  "#CD853F",
  "#A0522D",
  "#FFA500",
  "#BDB76B",
];

const sprinkleColors = [
  "#FF5733",
  "#FFBD33",
  "#FF33D1",
  "#33FF7A",
  "#336BFF",
  "#FF33A1",
  "#FF3333",
  "#33FFD1",
  "#FF5733",
  "#D633FF",
  "#FF33C7",
  "#33FFBA",
  "#33B5FF",
  "#FF5733",
  "#FF33D1",
  "#FFBD33",
  "#FFA07A",
  "#FFD700",
  "#FF6347",
  "#FF4500",
  "#D2691E",
  "#8B4513",
  "#CD5C5C",
  "#20B2AA",
  "#40E0D0",
  "#3CB371",
];

const getRandomFrostingColor = () => {
  const index = Math.floor(Math.random() * frostingColors.length);
  return frostingColors[index];
};

const getRandomDoughColor = () => {
  const index = Math.floor(Math.random() * doughColors.length);
  return doughColors[index];
};

const getRandomSprinkleColor = () => {
  const index = Math.floor(Math.random() * sprinkleColors.length);
  return sprinkleColors[index];
};

const Donut = ({ models, position, rotation }: DonutProps) => {
  const [speed, setSpeed] = useState(1);
  const ref = useRef<Group | null>(null);

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    if (ref?.current) {
      // ref.current.rotation.z = Math.sin(elapsedTime * speed);
    }
  });

  const mySprinkleColors = useMemo(() => {
    return [
      getRandomSprinkleColor(),
      getRandomSprinkleColor(),
      getRandomSprinkleColor(),
    ];
  }, []);

  return (
    <group
      ref={ref}
      position={position}
      rotation={rotation}
      rotation-y={Math.random() * 10}
      scale={10}
      castShadow
      // receiveShadow
      // onPointerEnter={() => setSpeed(6)}
      // onPointerLeave={() => setSpeed(2)}
    >
      <models.Dough color={getRandomDoughColor()} />
      <group position-y={-0.42}>
        {/* frosting */}
        <models.Torus001 color={getRandomFrostingColor()} />
        {/* sprinkle */}
        <models.Torus001_1 color={mySprinkleColors[0]} />
        {/* sprinkle */}
        <models.Torus001_2 color={mySprinkleColors[1]} />
        {/* sprinkle */}
        <models.Torus001_3 color={mySprinkleColors[2]} />
      </group>
    </group>
  );
};
