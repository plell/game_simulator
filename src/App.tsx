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

  const games: Record<number, any> = {
    0: <CrocGame />,
    1: <SpaceGame />,
    2: <Earth />,
    3: <TempoGame />,
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
          position: experienceProperties[0].cameraPosition,
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
