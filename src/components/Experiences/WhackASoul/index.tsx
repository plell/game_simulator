import { useEffect, useMemo, useRef, useState } from "react";
import { Group, MathUtils, PointLight, Vector3 } from "three";
import { Skull, movementRange } from "./Objects/Skull";

import Counter from "./Counter";
import useGame from "../../../Stores/useGame";
import { Stars, useGLTF, useTexture } from "@react-three/drei";
import { experienceProperties } from "../../../Stores/constants";
import { useFrame } from "@react-three/fiber";
import { GameProgress } from "../common/GameProgress";

const Lights = () => {
  return (
    <group>
      <Stars />
      <pointLight
        color={"#47fdf0"}
        intensity={200}
        position={[-9, 9, 4]}
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
      {/* <hemisphereLight args={["#47fdf0", "#fefdae"]} intensity={1} /> */}
    </group>
  );
};

const intensityScale = {
  min: 5,
  max: 30,
};

const Pumpkin = () => {
  const pumpkin = useGLTF("./models/pumpkin_less.glb");

  const lightRef = useRef<PointLight | null>(null);

  const [intensity, setIntensity] = useState(intensityScale.max);

  useEffect(() => {
    const interval = setInterval(() => {
      setIntensity(
        Math.floor(
          Math.random() * (intensityScale.max - intensityScale.min) +
            intensityScale.min
        )
      );
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  });

  useFrame(() => {
    if (lightRef.current) {
      lightRef.current.intensity = MathUtils.lerp(
        lightRef.current.intensity,
        intensity,
        0.02
      );
    }
  });
  return (
    <group>
      <pointLight ref={lightRef} intensity={60} position-y={1.3} />
      <primitive object={pumpkin.scene.clone()} scale={20} />
    </group>
  );
};

const maxScore = 40;

export const WhackASoul = () => {
  const ref = useRef<Group | null>(null);
  const game = useGame((s) => s.game);
  const damage = useGame((s) => s.damage);
  const score = useGame((s) => s.score);
  const setHit = useGame((s) => s.setHit);
  const setBite = useGame((s) => s.setBite);
  const setDamage = useGame((s) => s.setDamage);
  const setScore = useGame((s) => s.setScore);
  const setWin = useGame((s) => s.setWin);

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

  const [skulls, positions] = useMemo(() => {
    const rows = 3;
    const columns = 3;
    const padding = 2.6;
    const positions: Vector3[] = [];

    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < columns; c += 1) {
        const position = new Vector3(
          c * padding - padding,
          Math.random() * movementRange.min - 1,
          r * padding - padding
        );
        positions.push(position);
      }
    }

    const skulls: any[] = [];

    positions.forEach((p, i) => {
      skulls.push(<Skull key={i + "-skull"} id={i + 1} position={p} />);
    });

    return [skulls, positions];
  }, []);

  useEffect(() => {
    if (score - damage > maxScore - 1) {
      setWin(true);
    }
  }, [score, damage]);

  return (
    <group ref={ref} position={experienceProperties[game]?.gamePosition}>
      <Lights />
      <fog attach='fog' args={["#17171b", 2, 10]} />

      <GameProgress
        position={new Vector3(0, 9, 0)}
        type='bar'
        scale={0.1}
        max={maxScore}
        score={score - damage}
        intensity={4}
      />

      <group position={[0, 0, -2]}>
        <group position={[-8, 0, 0]} rotation-y={Math.PI * -0.3}>
          <Pumpkin />
        </group>
        <group position={[8, 0, 0]} rotation-y={Math.PI * -0.7}>
          <Pumpkin />
        </group>
      </group>

      {skulls}

      {/* score and hits */}
      <Counter title={"HITS"} value={score} position={[-2, 6.4, -3.2]} />
      <Counter title={"HAUNTS"} value={damage} position={[2, 6.4, -3.2]} />

      <Terrain />
    </group>
  );
};

const Terrain = () => {
  const alphaMap = useTexture("./images/holes.png");

  return (
    <group>
      <mesh
        receiveShadow
        position={[0, 4, -6]}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <boxGeometry args={[9, 9, 2]} />
        <meshStandardMaterial />
      </mesh>

      <mesh
        receiveShadow
        onPointerDown={(e) => e.stopPropagation()}
        position-y={-5.2}
      >
        <boxGeometry args={[9, 12, 10]} />
        <meshStandardMaterial alphaMap={alphaMap} transparent opacity={1} />
      </mesh>

      <mesh receiveShadow rotation-x={Math.PI * -0.5} position-y={0.8}>
        <planeGeometry args={[9, 10]} />
        <meshStandardMaterial color={"black"} />
      </mesh>

      <mesh receiveShadow rotation-x={Math.PI * -0.5}>
        <planeGeometry args={[300, 100]} />
        <meshStandardMaterial color={"slategray"} />
      </mesh>
    </group>
  );
};
