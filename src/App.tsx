import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";

import { Physics } from "@react-three/rapier";

import { Suspense, useEffect, useRef } from "react";
import { Leva, useControls } from "leva";
import { CrocGame } from "./components/Games/CrocGame";

import { Browser } from "./components/UI/Browser";
import useGame from "./Stores/useGame";
import { experienceProperties } from "./Stores/constants";
import { SpaceGame } from "./components/Games/SpaceGame";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { Earth } from "./components/Games/Earth";
import { CameraControls } from "@react-three/drei";
import { TempoGame } from "./components/Games/TempoGame";
import { CakeGame } from "./components/Games/CakeGame";
import styled from "styled-components";
import { Loading } from "./components/Games/common/Loading";

const CameraController = () => {
  const cameraControlsRef = useRef<CameraControls | null>(null);

  const game = useGame((s) => s.game);

  const { camera } = useThree();

  useEffect(() => {
    const position = experienceProperties[game]?.cameraPosition;
    const target = experienceProperties[game]?.cameraTarget;

    if (position && target) {
      camera.position.set(position.x, position.y, position.z);
      camera.lookAt(target);

      if (cameraControlsRef.current) {
        cameraControlsRef.current.setLookAt(
          position.x,
          position.y,
          position.z,
          target.x,
          target.y,
          target.z,
          false
        );
      }
    }
  }, [game]);

  if (experienceProperties[game]?.cameraControls) {
    return (
      <CameraControls
        ref={cameraControlsRef}
        boundaryEnclosesCamera
        makeDefault
        maxDistance={1000}
      />
    );
  }

  return null;
};

const App = () => {
  const game = useGame((s) => s.game);

  const GameComponent = experienceProperties[game]?.game;

  return (
    <>
      <Anchor id='anchor' />

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
          far: 3000,
          position: experienceProperties[0].cameraPosition,
        }}
      >
        <Suspense fallback={null}>
          <EffectComposer>
            <Bloom luminanceThreshold={1} mipmapBlur />
          </EffectComposer>

          <CameraController />
          <Physics gravity={[0, -40, 0]}>
            {GameComponent && <GameComponent />}
          </Physics>
        </Suspense>
      </Canvas>
    </>
  );
};

const Anchor = styled.div`
  position: absolute;
  pointer-events: none;
  user-select: none;
  height: 100%;
  width: 100%;
`;

export default App;
