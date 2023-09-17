import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Group, Vector3 } from "three";
import { Croc } from "./Objects/Croc";
import { MeshReflectorMaterial, Select } from "@react-three/drei";
import Counter from "./Counter";
import useGame from "../../Stores/useGame";
import Boundaries from "./Boundaries";
import Hammer from "./Objects/Hammer";
import Wall from "./Objects/Wall";

export const Level = () => {
  const ref = useRef<Group | null>(null);

  const damage = useGame((s) => s.damage);
  const score = useGame((s) => s.score);
  const scoreUp = useGame((s) => s.scoreUp);
  const setHit = useGame((s) => s.setHit);

  const crocs = useMemo(() => {
    const m = [];

    const amount = 5;
    for (let i = 0; i < amount; i++) {
      const defaultPosition = new Vector3(i * 5 - 10, 0.5, -5);
      m.push(
        <Croc
          key={i + "-croc"}
          id={i + 1}
          delay={Math.floor(Math.random())}
          position={defaultPosition}
        />
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
    <group ref={ref}>
      <Boundaries />
      {/* score and hits */}
      <Counter title={"HITS"} value={score} position={[-12, 5, -5]} />
      <Counter title={"BITES"} value={damage} position={[-5, 5, -5]} />
      <Counter title={"HI SCORE"} value={9} position={[2, 5, -5]} />

      <Hammer />

      <Select
        onChangePointerUp={(e) => {
          if (e.length) {
            const id = e[0]?.userData?.id || 0;
            scoreUp();
            setHit(id);
          }
        }}
      >
        {crocs}
      </Select>

      {walls}

      <mesh castShadow position={[0, 5.6, -10.5]}>
        <boxGeometry args={[30, 6, 10]} />
        <meshStandardMaterial color={"orange"} />
      </mesh>

      <mesh receiveShadow rotation-x={Math.PI * -0.5}>
        <planeGeometry args={[30, 10]} />
        <MeshReflectorMaterial
          blur={[0, 0]} // Blur ground reflections (width, height), 0 skips blur
          mixBlur={0.5} // How much blur mixes with surface roughness (default = 1)
          mixStrength={0.6} // Strength of the reflections
          mixContrast={0.5} // Contrast of the reflections
          resolution={1056} // Off-buffer resolution, lower=faster, higher=better quality, slower
          mirror={0.9} // Mirror environment, 0 = texture colors, 1 = pick up env colors
        />
      </mesh>
    </group>
  );
};

export default Level;
