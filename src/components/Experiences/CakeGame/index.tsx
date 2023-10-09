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
import { useFrame, useThree } from "@react-three/fiber";
import { useCursorHover } from "../hooks/useCursorHover";
import gsap, { Bounce, Power4 } from "gsap";
import { Lights } from "../../Lights";

const roomSize = 300;

const colors = ["#DABE99", "#CF9F6E", "#9D6538", "#652817", "#33140A"];

export const CakeGame = () => {
  const ref = useRef<Group | null>(null);
  const pointLightRef = useRef<PointLight | null>(null);

  const game = useGame((s) => s.game);
  const setSelectedDonutIds = useGame((s) => s.setSelectedDonutIds);

  useEffect(() => {
    return () => {
      setSelectedDonutIds([]);
    };
  }, []);

  return (
    <>
      <color attach='background' args={["#ffffff"]} />
      <group ref={ref} position={experienceProperties[game]?.gamePosition}>
        <Lights />

        <Room />

        <DonutBox />
        <Donuts />
        <WoodTable />
        <Points />
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

const pointPositions = [-3, -1, 1, 3];

const Points = () => {
  const ref = useRef<Group | null>(null);
  const [animating, setAnimating] = useState(false);
  const selectedDonutIds = useGame((s) => s.selectedDonutIds);
  const setLocked = useGame((s) => s.setLocked);
  const lockClicked = useGame((s) => s.lockClicked);

  const position = useMemo(() => new Vector3(0, 40, 0), []);

  const { camera } = useThree();

  useEffect(() => {
    animate();
  }, [lockClicked]);

  useEffect(() => {
    if (selectedDonutIds.length > 3) {
      complete();
      setLocked(false);
    }
  }, [selectedDonutIds]);

  const complete = () => {
    if (ref.current) {
      setAnimating(true);
      gsap
        .to(ref.current.rotation, {
          duration: 1,
          ease: Power4.easeInOut,
          keyframes: {
            "0%": new Vector3(0, 0, 0),
            "100%": new Vector3(0, Math.PI * 2, 0),
          },
          onComplete: () => {
            setAnimating(false);
          },
        })
        .play();
    }
  };

  const animate = () => {
    if (ref.current && !animating) {
      setAnimating(true);
      gsap
        .to(ref.current.position, {
          duration: 1,
          ease: Bounce.easeOut,
          keyframes: {
            "0%": position,
            "50%": position.clone().lerp(camera.position, 0.2),
            "100%": position,
          },
          onComplete: () => {
            setAnimating(false);
          },
        })
        .play();
    }
  };

  return (
    <group ref={ref} position={position}>
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

const columns = 7;
const rows = 5;
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

const boxPosition = new Vector3(0, 18, 70);

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
  const { nodes } = useGLTF("./models/donut_white_lesser.gltf");

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

const getCoffeeColors = () => {
  const index = Math.floor(Math.random() * colors.length);
  return colors[index];
};

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
      const newScale = ref.current.scale.lerp(normalScale, 0.2);
      ref.current.scale.set(newScale.x, newScale.y, newScale.z);

      if (selected) {
        ref.current.rotation.x += 0.04;
      }
    }
  });

  const rotationY = useMemo(() => Math.random() * 10, []);
  const doughColor = useMemo(() => getCoffeeColors(), []);
  const frostingColor = useMemo(() => getCoffeeColors(), []);
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

  const iHaveSprinkles = useMemo(() => {
    return Math.random() * 10 < 7;
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
        scale={focused ? focusedScale : regularScale}
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

            if (selected || selectedDonutIds.length < 4) {
              setFocused(true);
            }
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
            {iHaveSprinkles && (
              <>
                <models.Torus001_1 color={sprinkleColor[0]} />
                {/* sprinkle */}
                <models.Torus001_2 color={sprinkleColor[1]} />
                {/* sprinkle */}
                <models.Torus001_3 color={sprinkleColor[2]} />
              </>
            )}
          </group>
        )}
      </group>
    </>
  );
};
