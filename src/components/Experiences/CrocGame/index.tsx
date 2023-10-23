import { Fragment, useEffect, useMemo, useRef } from "react";
import { Group, Vector3 } from "three";
import { Croc } from "./Objects/Croc";
import { Select } from "@react-three/drei";
import Counter from "../common/Counter";
import useGame from "../../../Stores/useGame";
import Hammer from "./Objects/Hammer";
import Wall from "./Objects/Wall";
import CrocArch from "./Objects/Arch";
import { experienceProperties } from "../../../Stores/constants";

const Lights = () => {
  return (
    <group position={[0, 5, 0]}>
      <ambientLight intensity={0.04} />
      <pointLight
        color={"yellow"}
        intensity={200}
        position={[-9, 4, 4]}
        castShadow
        shadow-bias={-0.001}
        shadow-mapSize={[512, 512]}
        shadow-camera-near={1}
        shadow-camera-far={100}
        shadow-camera-top={100}
        shadow-camera-right={100}
        shadow-camera-bottom={-100}
        shadow-camera-left={-100}
      />
      <hemisphereLight args={["red", "pink"]} intensity={0.4} />
    </group>
  );
};

export const CrocGame = () => {
  const ref = useRef<Group | null>(null);
  const game = useGame((s) => s.game);
  const damage = useGame((s) => s.damage);
  const score = useGame((s) => s.score);
  const setHit = useGame((s) => s.setHit);
  const setBite = useGame((s) => s.setBite);
  const setDamage = useGame((s) => s.setDamage);
  const setScore = useGame((s) => s.setScore);

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

  return (
    <group ref={ref} position={experienceProperties[game]?.gamePosition}>
      <Lights />

      <Hammer />

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
  );
};
