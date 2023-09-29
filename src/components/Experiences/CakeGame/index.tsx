import { Fragment, MutableRefObject, useMemo, useRef, useState } from "react";
import { Color, Group, Mesh, Vector3 } from "three";

import useGame from "../../../Stores/useGame";
import { experienceProperties } from "../../../Stores/constants";

import {
  EnvironmentCube,
  Merged,
  MeshReflectorMaterial,
  useGLTF,
  useTexture,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

export const CakeGame = () => {
  const ref = useRef<Group | null>(null);

  const game = useGame((s) => s.game);

  return (
    <group ref={ref} position={experienceProperties[game]?.gamePosition}>
      <directionalLight position={[0, 80, 100]} intensity={3} />
      <pointLight position={[0, 8, 0]} intensity={2} />

      {/* <mesh position={[0, 0, 100]} rotation-y={Math.PI}>
        <planeGeometry args={[200, 200]} />
        <MeshReflectorMaterial
          blur={[0, 0]} // Blur ground reflections (width, height), 0 skips blur
          mixBlur={0} // How much blur mixes with surface roughness (default = 1)
          mixStrength={1} // Strength of the reflections
          mixContrast={1} // Contrast of the reflections
          resolution={1024} // Off-buffer resolution, lower=faster, higher=better quality, slower
          mirror={1} // Mirror environment, 0 = texture colors, 1 = pick up env colors
          depthScale={0} // Scale the depth factor (0 = no depth, default = 0)
          minDepthThreshold={0.9} // Lower edge for the depthTexture interpolation (default = 0)
          maxDepthThreshold={1} // Upper edge for the depthTexture interpolation (default = 0)
          // depthToBlurRatioBias={0.25} // Adds a bias factor to the depthTexture before calculating the blur amount [blurFactor = blurTexture * (depthTexture + bias)]. It accepts values between 0 and 1, default is 0.25. An amount > 0 of bias makes sure that the blurTexture is not too sharp because of the multiplication with the depthTexture
          distortion={0.1} // Amount of distortion based on the distortionMap texture
          reflectorOffset={0.2} // Offsets the virtual camera that projects the reflection. Useful when the reflective surface is some distance from the object's origin (default = 0)
        />
      </mesh> */}

      {/* <EnvironmentCube preset='city' /> */}

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
  const armMap = useTexture("textures/wood/raw_plank_wall_arm_1k.jpg");
  const diffMap = useTexture("textures/wood/raw_plank_wall_diff_1k.jpg");
  const dispMap = useTexture("textures/wood/raw_plank_wall_disp_1k.jpg");
  const normalMap = useTexture("textures/wood/raw_plank_wall_nor_gl_1k.jpg");

  return (
    <group position-y={-5}>
      <mesh receiveShadow>
        <boxGeometry
          args={[
            columns * width + tablePadding,
            4,
            rows * height + tablePadding,
          ]}
        />

        <meshStandardMaterial
          aoMap={armMap}
          roughnessMap={armMap}
          metalnessMap={armMap}
          map={diffMap}
          displacementMap={dispMap}
          normalMap={normalMap}
        />
      </mesh>
    </group>
  );
};

const CakeLayer = () => {
  // @ts-ignore
  const { nodes } = useGLTF("./models/donut_white.gltf");
  // @ts-ignore
  Object.values(nodes).forEach((mesh: Mesh) => {
    if (mesh.name === "Dough") {
      mesh.castShadow = true;
    }
  });

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

  return donuts;
};

type DonutProps = {
  models: Record<string, any>;
  position?: [x: number, y: number, z: number];
  rotation?: [x: number, y: number, z: number];
};

const frostingColors = [
  "#F3E5AB",
  "#7B3F00",
  "#FF496C",
  "#39191C",
  "#532529",
  "#21DC9A",
];

const doughColors = ["", "", "", "", "#8B4513", "#A0522D"];

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
  const [focused, setFocused] = useState(false);
  const [selected, setSelected] = useState(false);
  const [speed, setSpeed] = useState(1);
  const ref = useRef<Group | null>(null);

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    if (ref?.current) {
      if (selected) {
        ref.current.position.y += 0.2;
        ref.current.rotation.y += 0.1;
      }
      // ref.current.rotation.z = Math.sin(elapsedTime * speed);
    }
  });

  const rotationY = useMemo(() => Math.random() * 10, []);
  const doughColor = useMemo(() => getRandomDoughColor(), []);
  const frostingColor = useMemo(() => getRandomFrostingColor(), []);
  const sprinkleColor = useMemo(() => {
    return [
      getRandomSprinkleColor(),
      getRandomSprinkleColor(),
      getRandomSprinkleColor(),
    ];
  }, []);

  const iAmNakedCake = useMemo(() => {
    return Math.random() * 10 < 2;
  }, []);

  return (
    <>
      <group
        ref={ref}
        position={position}
        rotation={rotation}
        rotation-y={rotationY}
        scale={10}
      >
        <group
          onPointerDown={(e) => {
            e.stopPropagation();
            setSelected(true);
          }}
          onPointerEnter={(e) => {
            e.stopPropagation();
            setFocused(true);
          }}
          onPointerLeave={(e) => {
            e.stopPropagation();
            setFocused(false);
          }}
        >
          <models.Dough color={doughColor} />
        </group>

        {!iAmNakedCake && (
          <group position-y={-0.42}>
            {/* frosting */}
            <models.Torus001 color={frostingColor} />
            {/* sprinkle */}
            <models.Torus001_1 color={sprinkleColor[0]} />
            {/* sprinkle */}
            <models.Torus001_2 color={sprinkleColor[1]} />
            {/* sprinkle */}
            <models.Torus001_3 color={sprinkleColor[2]} />
          </group>
        )}
      </group>
    </>
  );
};
