import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";

import styled from "styled-components";
import { Vector3 } from "three";

import { Lights } from "./components/Lights";
import { Physics } from "@react-three/rapier";

import { Suspense, useEffect } from "react";
import { Leva, useControls } from "leva";
import { CrocGame } from "./components/Games/CrocGame";

import Browser from "./components/UI/Browser";
import useGame from "./Stores/useGame";
import { gamePositions } from "./Stores/constants";
import SpaceGame from "./components/Games/SpaceGame";
import { Bloom, EffectComposer } from "@react-three/postprocessing";

const CameraController = () => {
  const { camera } = useThree();

  const game = useGame((s) => s.game);

  useFrame(() => {
    const position = gamePositions[game]?.cameraPosition;
    const target = gamePositions[game]?.cameraTarget;
    if (camera && position && target) {
      camera.position.lerp(position, 0.04);
      camera.lookAt(target);
    }
  });

  return null;
};

const App = () => {
  const game = useGame((s) => s.game);

  const games: Record<number, any> = {
    0: <CrocGame />,
    1: <SpaceGame />,
  };

  return (
    <>
      <Browser />

      <Leva />
      <Canvas
        shadows
        gl={
          {
            // toneMappingExposure: 2,
            // toneMapping: THREE.ACESFilmicToneMapping,
          }
        }
        camera={{
          fov: 45,
          near: 0.1,
          far: 200,
        }}
      >
        <Suspense fallback={null}>
          <EffectComposer>
            <Bloom luminanceThreshold={1} mipmapBlur />
          </EffectComposer>

          <CameraController />
          <Lights />
          <Physics gravity={[0, 0, 0]}>{games[game]}</Physics>
        </Suspense>
      </Canvas>
    </>
  );
};

export default App;
