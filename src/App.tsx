import { Canvas, useFrame, useThree } from "@react-three/fiber";

import { Physics } from "@react-three/rapier";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
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
  const [enabled, setEnabled] = useState(true);

  // useGooseNeck(cameraControlsRef);

  useFrame(() => {
    // console.log(camera.position);
  });

  useEffect(() => {
    const { cameraPosition, cameraTarget, cameraControls } =
      experienceProperties[game] || {};

    setEnabled(cameraControls);

    if (cameraPosition && cameraTarget) {
      if (cameraControlsRef.current) {
        cameraControlsRef.current.setPosition(
          cameraPosition.x,
          cameraPosition.y,
          cameraPosition.z,
          false
        );
        cameraControlsRef.current.setLookAt(
          cameraPosition.x,
          cameraPosition.y,
          cameraPosition.z,
          cameraTarget.x,
          cameraTarget.y,
          cameraTarget.z,
          false
        );
      }
    }
  }, [game]);

  const cameraProps = useMemo(
    () =>
      enabled
        ? {
            polarRotateSpeed: 1,
            azimuthRotateSpeed: 1,
            smoothTime: 3,
            minDistance: 30,
            maxDistance: 500,
          }
        : {
            polarRotateSpeed: 0,
            azimuthRotateSpeed: 0,
            smoothTime: 3,
            minDistance: 90,
            maxDistance: 500,
          },
    [enabled]
  );

  return (
    <CameraControls
      ref={cameraControlsRef}
      dollySpeed={0.08}
      {...cameraProps}
    />
  );
};

const App = () => {
  const game = useGame((s) => s.game);
  const setMouseDown = useGame((s) => s.setMouseDown);
  const setLocked = useGame((s) => s.setLocked);

  const GameComponent = experienceProperties[game]?.game;

  useEffect(() => {
    // setLocked(true);
  }, [game]);

  useEffect(() => {
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  });

  const handleMouseDown = () => {
    setMouseDown(true);
  };

  const handleMouseUp = () => {
    setMouseDown(false);
  };

  return (
    <>
      <Anchor id='anchor' />

      <Browser />
      <Leva hidden={!isDevelopment} />

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
          far: 2500,
          position: experienceProperties[0].cameraPosition,
        }}
      >
        <Suspense fallback={null}>
          {isDevelopment && <Perf position='top-left' />}

          <CameraController />

          <color
            attach='background'
            args={[experienceProperties[game]?.backgroundColor || "#000000"]}
          />

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
