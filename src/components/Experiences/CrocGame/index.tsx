import {
  Fragment,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Group, Vector3 } from "three";
import { Croc } from "./Objects/Croc";
import Counter from "../common/Counter";
import useGame from "../../../Stores/useGame";
import Hammer from "./Objects/Hammer";
import Wall from "./Objects/Wall";
import CrocArch from "./Objects/Arch";
import { experienceProperties } from "../../../Stores/constants";
import { GameProgress } from "../common/GameProgress";

const Lights = () => {
  return (
    <group position={[0, 5, 0]}>
      <pointLight
        color={"pink"}
        intensity={280}
        position={[-9, 4, 4]}
        castShadow
        shadow-bias={-0.001}
        shadow-camera-near={1}
        shadow-camera-far={100}
        shadow-camera-top={100}
        shadow-camera-right={100}
        shadow-camera-bottom={-100}
        shadow-camera-left={-100}
      />
    </group>
  );
};

const max = 20;

export const CrocGame = () => {
  const ref = useRef<Group | null>(null);
  const game = useGame((s) => s.game);
  const damage = useGame((s) => s.damage);
  const score = useGame((s) => s.score);
  const setHit = useGame((s) => s.setHit);
  const setBite = useGame((s) => s.setBite);
  const setDamage = useGame((s) => s.setDamage);
  const setScore = useGame((s) => s.setScore);
  const setLevel = useGame((s) => s.setLevel);
  const level = useGame((s) => s.level);

  useEffect(() => {
    return () => {
      resetGame();
    };
  }, []);

  const resetGame = () => {
    setHit(0);
    setBite(0);
    setDamage(0);
    setScore(0);
  };

  const crocs = useMemo(() => {
    const m = [];

    const amount = 5;
    for (let i = 0; i < amount; i++) {
      const defaultPosition = new Vector3(i * 5 - 10, 0.5, -5);
      const archPosition = new Vector3(i * 5 - 10, 0.5, -7);
      m.push(
        <Fragment key={i + "-croc"}>
          <CrocArch position={archPosition} />
          <Croc id={i + 1} position={defaultPosition} />
        </Fragment>
      );
    }
    return m;
  }, []);

  const walls = useMemo(() => {
    const m = [];

    const amount = 6;
    for (let i = 0; i < amount; i++) {
      const defaultPosition = new Vector3(i * 5 - 12.5, 0.7, -2);
      m.push(<Wall key={i + "-wall"} position={defaultPosition} />);
    }
    return m;
  }, []);

  useEffect(() => {
    if (score - damage < -max) {
      setDamage(0);
      setScore(0);
      setLevel(level - 1);
    }
  }, [damage]);

  return (
    <Suspense fallback={null}>
      <group ref={ref} position={experienceProperties[game]?.gamePosition}>
        <Lights />

        <Hammer />

        <GameProgress
          position={new Vector3(0, 13, 0)}
          type='bar'
          max={max}
          score={score - damage}
          level={level}
          levelPrefix='LEVEL '
          setLevel={() => {
            setLevel(level + 1);
            setScore(0);
            setDamage(0);
          }}
          scale={0.1}
        />

        {crocs}

        {walls}

        <mesh castShadow receiveShadow position={[0, 4.5, -11.5]}>
          <boxGeometry args={[26, 4, 10]} />
          <meshStandardMaterial color={"#0090c8"} />
        </mesh>

        <mesh
          castShadow
          receiveShadow
          position={[0, 3.6, -5]}
          rotation-x={Math.PI * -0.5}
        >
          <planeGeometry args={[26, 3, 10]} />
          <meshStandardMaterial color={"#00923e"} />
        </mesh>

        {/* score and hits */}
        <Counter title={"HITS"} value={score} position={[-6, 4.4, -6.5]} />
        <Counter title={"BITES"} value={damage} position={[6, 4.4, -6.5]} />
        {/* <Counter title={"HI SCORE"} value={9} position={[-1, 4.4, -6.5]} /> */}

        <mesh receiveShadow position-z={-10} rotation-x={Math.PI * -0.5}>
          <planeGeometry args={[26.8, 26]} />
          <meshStandardMaterial color={"#569f3e"} />
        </mesh>
      </group>
    </Suspense>
  );
};
