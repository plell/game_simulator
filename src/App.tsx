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

const CameraController = () => {
  const cameraControlsRef = useRef<CameraControls | null>(null);

  const game = useGame((s) => s.game);

  useEffect(() => {
    const position = experienceProperties[game]?.cameraPosition;
    const target = experienceProperties[game]?.cameraTarget;

    if (cameraControlsRef.current && position && target) {
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
  }, [game]);

  return (
    <CameraControls
      ref={cameraControlsRef}
      boundaryEnclosesCamera
      makeDefault
      maxDistance={1000}
    />
  );
};

const App = () => {
  const game = useGame((s) => s.game);

  const games: Record<number, any> = {
    0: <CrocGame />,
    1: <SpaceGame />,
    2: <Earth />,
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
          <Physics gravity={[0, 0, 0]}>{games[game]}</Physics>
        </Suspense>
      </Canvas>
    </>
  );
};

export default App;
