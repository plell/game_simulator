import { Canvas, useFrame, useThree } from "@react-three/fiber";

import { Physics } from "@react-three/rapier";

import { Suspense, useEffect, useRef } from "react";
import { Leva, useControls } from "leva";

import { Browser } from "./components/UI/Browser";
import useGame from "./Stores/useGame";
import { experienceProperties, isDevelopment } from "./Stores/constants";

import {
  Bloom,
  EffectComposer,
  Outline,
  Selection,
} from "@react-three/postprocessing";
import { BlendFunction, Resolution } from "postprocessing";

import { CameraControls } from "@react-three/drei";
import { Perf } from "r3f-perf";

import styled from "styled-components";

import { ACESFilmicToneMapping, PCFSoftShadowMap, Vector3 } from "three";
import { useGooseNeck } from "./components/Experiences/hooks/useGooseNeck";

const CameraController = () => {
  const cameraControlsRef = useRef<CameraControls | null>(null);

  const game = useGame((s) => s.game);

  const { camera } = useThree();

  useGooseNeck();

  useFrame(() => {
    // console.log(camera.position);
  });

  // const { cameraPosition, cameraTarget } = useControls("camera", {
  //   cameraPosition: { value: { x: 0, y: 0, z: 0 }, step: 1 },
  //   cameraTarget: { value: { x: 0, y: 0, z: 0 }, step: 1 },
  // });

  // useEffect(() => {
  //   camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
  //   const look = new Vector3(cameraTarget.x, cameraTarget.y, cameraTarget.z);
  //   camera.lookAt(look);

  //   if (cameraControlsRef.current) {
  //     cameraControlsRef.current.setLookAt(
  //       cameraPosition.x,
  //       cameraPosition.y,
  //       cameraPosition.z,
  //       cameraTarget.x,
  //       cameraTarget.y,
  //       cameraTarget.z,
  //       false
  //     );
  //   }
  // }, [cameraPosition, cameraTarget]);

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
      {isDevelopment && <Leva />}
      {/* {isDevelopment && <Perf />} */}
      <Canvas
        gl={{
          toneMappingExposure: 3,
          toneMapping: ACESFilmicToneMapping,
          antialias: true,
        }}
        shadows={{
          type: PCFSoftShadowMap,
        }}
        camera={{
          fov: 45,
          near: 10,
          far: 900,
          position: experienceProperties[0].cameraPosition,
        }}
      >
        <Suspense fallback={null}>
          <CameraController />
          <Selection>
            <EffectComposer autoClear={false} multisampling={8}>
              <Bloom
                luminanceThreshold={1}
                mipmapBlur
                resolutionX={Resolution.AUTO_SIZE} // The horizontal resolution.
                resolutionY={Resolution.AUTO_SIZE} // The vertical resolution.
              />
              <Outline
                blur
                edgeStrength={4}
                blendFunction={BlendFunction.SCREEN} // set this to BlendFunction.ALPHA for dark outlines
                hiddenEdgeColor={0xffffff}
                visibleEdgeColor={0xffffff}
              />
            </EffectComposer>

            <Physics gravity={[0, -40, 0]}>
              {GameComponent && <GameComponent />}
            </Physics>
          </Selection>
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
