import { useEffect, useMemo, useRef, useState } from "react";
import { Group, Mesh, Vector3 } from "three";

import useGame from "../../../Stores/useGame";
import { experienceProperties } from "../../../Stores/constants";

import { Merged, useGLTF, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useCursorHover } from "../hooks/useCursorHover";
import gsap, { Bounce } from "gsap";

export const CakeGame = () => {
  const ref = useRef<Group | null>(null);

  const game = useGame((s) => s.game);
  const setSelectedDonutIds = useGame((s) => s.setSelectedDonutIds);

  useEffect(() => {
    return () => {
      setSelectedDonutIds([]);
    };
  }, []);

  return (
    <group ref={ref} position={experienceProperties[game]?.gamePosition}>
      <directionalLight position={[0, 80, 100]} intensity={2} />
      <ambientLight intensity={0.6} />

      <DonutBox />
      <Donuts />
      <WoodTable />
      <Points />
    </group>
  );
};

const pointPositions = [-3, -1, 1, 3];

const Points = () => {
  const ref = useRef<Group | null>(null);
  const selectedDonutIds = useGame((s) => s.selectedDonutIds);

  return (
    <group ref={ref} position-y={40}>
      {pointPositions.map((d, i) => {
        const fill = i + 1 <= selectedDonutIds.length;
        const complete = selectedDonutIds.length > 3;
        return (
          <group key={i} position-x={pointPositions[i] * 10}>
            <mesh>
              <torusGeometry args={[5, 0.2]} />
              <meshBasicMaterial
                color={complete ? "skyblue" : "#ffffff"}
                transparent
                opacity={complete ? 1 : 0.04}
              />
            </mesh>

            {fill && (
              <mesh>
                <circleGeometry args={[3, 40]} />
                <meshBasicMaterial color={"#ffffff"} />
              </mesh>
            )}
          </group>
        );
      })}
    </group>
  );
};

const columns = 12;
const rows = 8;
const width = 12;
const height = 12;
const leftPad = -(width * (columns / 2) - width / 2);
const topPad = -(height * (rows / 2) - height / 2);
const tablePadding = 12;

const WoodTable = () => {
  const diffMap = useTexture("textures/wood/raw_plank_wall_diff_1k.jpg");
  const dispMap = useTexture("textures/wood/raw_plank_wall_disp_1k.jpg");

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
          roughnessMap={dispMap}
          map={diffMap}
          displacementMap={dispMap}
        />
      </mesh>
    </group>
  );
};

const boxPosition = new Vector3(0, 20, 70);

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
      <primitive object={donutBox.scene.clone()} scale={regularScale} />
    </group>
  );
};

const Donuts = () => {
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

type DonutProps = {
  id: string;
  models: Record<string, any>;
  position: Vector3;
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

const focusedScale = 11;
const regularScale = 10;
const normalScale = new Vector3(regularScale, regularScale, regularScale);

const Donut = ({ models, position, rotation, id }: DonutProps) => {
  const [focused, setFocused] = useState(false);

  const [animating, setAnimating] = useState(false);
  const ref = useRef<Group | null>(null);

  const selectedDonutIds = useGame((s) => s.selectedDonutIds);
  const setSelectedDonutIds = useGame((s) => s.setSelectedDonutIds);

  useCursorHover(focused);

  useEffect(() => {
    goTo(true);
  }, []);

  const selected: boolean = useMemo(() => {
    return !!selectedDonutIds.includes(id);
  }, [selectedDonutIds, id]);

  const { camera } = useThree();

  useFrame(() => {
    if (ref?.current) {
      if (!selected) {
        const newScale = ref.current.scale.lerp(normalScale, 0.2);
        ref.current.scale.set(newScale.x, newScale.y, newScale.z);
      } else {
        ref.current.rotation.x += 0.04;
      }
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

  const goTo = (reverse?: boolean) => {
    const myBoxPosition = new Vector3(
      boxPosition.x + selectedDonutIds.length * 5 - 7.3,
      boxPosition.y + 0.5,
      boxPosition.z + -0.2
    );
    const origin = reverse ? myBoxPosition.clone() : position.clone();
    const destination = reverse ? position.clone() : myBoxPosition.clone();
    const cameraPosition = position.clone().lerp(camera.position, 0.5);

    if (ref?.current) {
      setAnimating(true);
      gsap
        .to(ref.current.position, {
          duration: 0.4,
          keyframes: {
            "0%": origin,
            "30%": cameraPosition,
            "100%": destination,
          },
          onComplete: () => {
            setAnimating(false);
          },
        })
        .play();

      const start = reverse
        ? new Vector3(0, 0, Math.PI * 0.5)
        : new Vector3(0, 0, 0);
      const end = reverse
        ? new Vector3(0, 0, 0)
        : new Vector3(0, 0, Math.PI * 0.5);

      gsap
        .to(ref.current.rotation, {
          duration: 0.4,
          keyframes: {
            "0%": start,
            "100%": end,
          },
        })
        .play();
    }
  };

  return (
    <>
      <group
        ref={ref}
        position={position}
        rotation={rotation}
        rotation-y={rotationY}
        scale={selected ? regularScale : focused ? focusedScale : regularScale}
      >
        <group
          onClick={(e) => {
            if (!animating) {
              e.stopPropagation();
              const selectedIdsClone = [...selectedDonutIds];
              if (!selected) {
                if (selectedIdsClone.length < 4) {
                  setSelectedDonutIds([...selectedIdsClone, id]);
                  goTo(false);
                }
              } else {
                const myIndex = selectedDonutIds.findIndex((f) => f === id);
                if (myIndex > -1) {
                  selectedIdsClone.splice(myIndex, 1);

                  setSelectedDonutIds(selectedIdsClone);
                  goTo(true);
                }
              }
            }
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
          <mesh rotation-x={Math.PI * -0.5}>
            <planeGeometry args={[0.2, 0.2]} />
            <meshBasicMaterial transparent opacity={0} />
          </mesh>
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
