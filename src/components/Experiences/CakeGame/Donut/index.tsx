import { useEffect, useMemo, useRef, useState } from "react";
import { Group, Vector3 } from "three";
import useGame from "../../../../Stores/useGame";
import { useCursorHover } from "../../hooks/useCursorHover";
import { useFrame, useThree } from "@react-three/fiber";
import {
  boxPosition,
  colors,
  focusedScale,
  normalScale,
  regularScale,
} from "../constants";
import gsap from "gsap";

export const Donut = ({ models, position, rotation, id }: DonutProps) => {
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
