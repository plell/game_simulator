import { Fragment, useMemo, useRef } from "react";
import { Group, Vector3 } from "three";
import { Croc } from "./Objects/Croc";
import { Select } from "@react-three/drei";
import Counter from "../common/Counter";
import useGame from "../../../Stores/useGame";
import Hammer from "./Objects/Hammer";
import Wall from "./Objects/Wall";
import CrocArch from "./Objects/Arch";
import { experienceProperties } from "../../../Stores/constants";
import { Lights } from "../../Lights";

export const CrocGame = () => {
  const ref = useRef<Group | null>(null);
  const game = useGame((s) => s.game);
  const damage = useGame((s) => s.damage);
  const score = useGame((s) => s.score);
  const scoreUp = useGame((s) => s.scoreUp);
  const setHit = useGame((s) => s.setHit);

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
      const defaultPosition = new Vector3(i * 5 - 12.5, 1, -2);
      m.push(<Wall key={i + "-wall"} position={defaultPosition} />);
    }
    return m;
  }, []);

  return (
    <group ref={ref} position={experienceProperties[game]?.gamePosition}>
      <Lights />

      <Hammer />

      <Select
        onChangePointerUp={(e) => {
          if (e.length) {
            console.log("e", e);
            const id =
              e[0]?.userData?.id ||
              e[1]?.userData?.id ||
              e[2]?.userData?.id ||
              0;

            scoreUp();
            setHit(id);
          }
        }}
      >
        {crocs}
      </Select>

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
      <Counter title={"HITS"} value={score} position={[-11, 4.4, -6.5]} />
      <Counter title={"BITES"} value={damage} position={[-6, 4.4, -6.5]} />
      <Counter title={"HI SCORE"} value={9} position={[-1, 4.4, -6.5]} />

      <mesh receiveShadow position-z={-10} rotation-x={Math.PI * -0.5}>
        <planeGeometry args={[26.8, 26]} />
        <meshStandardMaterial color={"#569f3e"} />
      </mesh>
    </group>
  );
};
