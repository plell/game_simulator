import { MutableRefObject, useEffect, useMemo, useRef, useState } from "react";
import { Group, Mesh, Vector3 } from "three";
import useGame from "../../../../Stores/useGame";
import { useFrame, useThree } from "@react-three/fiber";
import gsap, { Bounce, Power4 } from "gsap";

const pointPositions = [-3, -1, 1, 3];

type Props = {
  type: "bar" | "points";
  max: number;
  score: number;
  position: Vector3;
  scoreRef?: MutableRefObject<number>;
  scoreInverted?: boolean;
};

export const GameProgress = ({
  type,
  max,
  score,
  scoreRef,
  position,
  scoreInverted,
}: Props) => {
  const ref = useRef<Group | null>(null);
  const [animating, setAnimating] = useState(false);
  const setLocked = useGame((s) => s.setLocked);
  const lockClicked = useGame((s) => s.lockClicked);

  const [refScoreComplete, setRefScoreComplete] = useState(false);

  const { camera } = useThree();

  const [initialized, setInitialized] = useState(false);

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

  const progressRef = useRef<Mesh | null>(null);

  useFrame(() => {
    if (
      type === "bar" &&
      (scoreRef?.current || scoreRef?.current === 0) &&
      progressRef?.current
    ) {
      const xScale = scoreInverted
        ? (max - scoreRef?.current) / max
        : scoreRef?.current / max;

      const yScale = refScoreComplete ? 4 : 1;
      progressRef.current.scale.set(xScale, yScale, 1);

      if (initialized && !refScoreComplete) {
        const s = scoreInverted ? max - scoreRef?.current : scoreRef?.current;

        if (s > max - 1) {
          setRefScoreComplete(true);
        }
      }
    }
  });

  return (
    <group ref={ref} position={position}>
      {type === "points" ? (
        <>
          {pointPositions.map((_, i) => {
            const fill = i + 1 <= score;
            const complete = score > max - 1;
            return (
              <group key={i} position-x={pointPositions[i] * 10}>
                <mesh>
                  <torusGeometry args={[5, 0.2]} />
                  {complete ? (
                    <meshStandardMaterial
                      color={"#ffffff"}
                      roughness={0}
                      emissive={"white"}
                      emissiveIntensity={2}
                    />
                  ) : (
                    <meshBasicMaterial
                      color={"#ffffff"}
                      transparent
                      opacity={0.4}
                    />
                  )}
                </mesh>

                {fill && (
                  <mesh>
                    <circleGeometry args={[2, 40]} />
                    <meshStandardMaterial
                      color={"white"}
                      roughness={0}
                      emissive={"gold"}
                      emissiveIntensity={3}
                    />
                  </mesh>
                )}
              </group>
            );
          })}
        </>
      ) : (
        <group>
          <mesh>
            <planeGeometry args={[90, 1]} />
            <meshStandardMaterial transparent opacity={0.6} />
          </mesh>

          <mesh position-z={0.1} ref={progressRef}>
            <planeGeometry args={[90, 1]} />
            <meshStandardMaterial
              color={"white"}
              emissive={refScoreComplete ? "white" : "purple"}
              emissiveIntensity={refScoreComplete ? 1 : 40}
            />
          </mesh>
        </group>
      )}
    </group>
  );
};
