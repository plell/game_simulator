import { MutableRefObject, useEffect, useMemo, useRef, useState } from "react";
import {
  CircleGeometry,
  Group,
  Mesh,
  MeshStandardMaterial,
  TorusGeometry,
  Vector3,
} from "three";
import useGame from "../../../../Stores/useGame";
import { useFrame, useThree } from "@react-three/fiber";
import gsap, { Bounce, Power4 } from "gsap";
import { Text } from "@react-three/drei";

const pointPositions = [-3, -1, 1, 3];

type Props = {
  type: "bar" | "points";
  max: number;
  score: number;
  position: Vector3;
  scoreRef?: MutableRefObject<number>;
  scoreInverted?: boolean;
  level?: number;
  setLevel?: (level: number) => void;
  levelSuffix?: string;
  levelPrefix?: string;
  hideText?: boolean;
  scale?: number;
  intensity?: number;
};

const circleGeo = new CircleGeometry(2, 40);
const circleMaterial = new MeshStandardMaterial({
  color: "white",
  roughness: 0,
  emissive: "white",
  emissiveIntensity: 2,
});

const torusGeo = new TorusGeometry(5, 0.2);
const torusMaterial = new MeshStandardMaterial({
  color: "white",
  roughness: 0,
  emissive: "white",
  emissiveIntensity: 2,
});
const torusBasicMaterial = new MeshStandardMaterial({
  color: "white",
  transparent: true,
  opacity: 0.4,
});

export const GameProgress = ({
  type,
  max,
  score,
  intensity,
  scoreRef,
  position,
  scoreInverted,
  level,
  setLevel,
  levelSuffix,
  levelPrefix,
  hideText,
  scale = 1,
}: Props) => {
  const ref = useRef<Group | null>(null);
  const [animating, setAnimating] = useState(false);
  const setLocked = useGame((s) => s.setLocked);
  const lockClicked = useGame((s) => s.lockClicked);

  const [refScoreComplete, setRefScoreComplete] = useState(false);

  const { camera } = useThree();

  const [initialized, setInitialized] = useState(false);

  const scoreComplete = useMemo(() => score > max - 1, [score, max]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setInitialized(true);
    }, 400);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    animate();
  }, [lockClicked]);

  useEffect(() => {
    if (score > max - 1) {
      complete();
      setLocked(false);
    }
  }, [score]);

  useEffect(() => {
    if (refScoreComplete) {
      complete();
      setLocked(false);
    }
  }, [refScoreComplete]);

  const complete = () => {
    if (ref.current && !animating) {
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
            if (setLevel && (level === 0 || level)) {
              setLevel((level += 1));
            }
            setTimeout(() => {
              setRefScoreComplete(false);
              setAnimating(false);
            }, 300);
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
            "50%": position.clone().lerp(camera.position, 0.2 * scale),
            "100%": position,
          },
          onComplete: () => {
            setAnimating(false);
          },
        })
        .play();
    }
  };

  const progressRef = useRef<Mesh | null>(null);

  useFrame(() => {
    const s = score || scoreRef?.current;
    if (type === "bar" && (s || s === 0) && progressRef?.current) {
      const xScale = s ? (scoreInverted ? (max - s) / max : s / max) : 1;

      const yScale = scoreComplete || refScoreComplete ? 2 : 1;
      progressRef.current.scale.set(xScale, yScale, 1);

      if (initialized && !(scoreComplete || refScoreComplete)) {
        const s_ = scoreInverted ? max - s : s;

        if (s_ > max - 1) {
          setRefScoreComplete(true);
        }
      }
    }
  });

  return (
    <group ref={ref} position={position} scale={scale}>
      {!hideText && (
        <group position-y={5}>
          <Text fontSize={7}>
            {levelPrefix}
            {level}
            {levelSuffix}
          </Text>
        </group>
      )}
      {type === "points" ? (
        <group position-y={-9}>
          {pointPositions.map((_, i) => {
            const fill = i + 1 <= score;

            return (
              <group key={i} position-x={pointPositions[i] * 10}>
                <mesh
                  geometry={torusGeo}
                  material={scoreComplete ? torusMaterial : torusBasicMaterial}
                />

                {fill && (
                  <mesh geometry={circleGeo} material={circleMaterial} />
                )}
              </group>
            );
          })}
        </group>
      ) : (
        <group>
          <group position-y={-2}>
            <mesh>
              <planeGeometry args={[90, 1]} />
              <meshStandardMaterial transparent opacity={0.6} />
            </mesh>

            {initialized && max > 1 && (
              <mesh position-z={0.1} ref={progressRef} scale-x={0}>
                <planeGeometry args={[90, 1]} />
                <meshStandardMaterial
                  color={"white"}
                  emissive={
                    refScoreComplete || scoreComplete
                      ? "white"
                      : score < 0
                      ? "red"
                      : "purple"
                  }
                  emissiveIntensity={
                    refScoreComplete || scoreComplete ? 1 : intensity || 40
                  }
                />
              </mesh>
            )}
          </group>
        </group>
      )}
    </group>
  );
};
