import { Canvas, useThree } from "@react-three/fiber";

import { Physics } from "@react-three/rapier";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Leva } from "leva";

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

import { CameraControls, KeyboardControls, Preload } from "@react-three/drei";
import { Perf } from "r3f-perf";

import styled from "styled-components";

import { ACESFilmicToneMapping, Color, PCFSoftShadowMap } from "three";

const color = new Color("#000000");

const CameraController = () => {
  const cameraControlsRef = useRef<CameraControls | null>(null);

  const game = useGame((s) => s.game);
  const [enabled, setEnabled] = useState(true);

  const { camera, scene } = useThree();

  useEffect(() => {
    const { backgroundColor } = experienceProperties[game];
    scene.background = backgroundColor ? color.set(backgroundColor) : null;
  }, [game]);

  useEffect(() => {
    const {
      cameraPosition,
      cameraTarget,
      cameraControls,
      cameraNear,
      cameraFar,
    } = experienceProperties[game] || {};

    setEnabled(cameraControls);

    camera.near = cameraNear;
    camera.far = cameraFar;
    camera.updateProjectionMatrix();

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
            minDistance: 2,
            maxDistance: 500,
          }
        : {
            polarRotateSpeed: 0,
            azimuthRotateSpeed: 0,
            smoothTime: 3,
            minDistance: 2,
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

  const GameComponent = useMemo(() => experienceProperties[game]?.game, [game]);
  const UIComponent = useMemo(
    () => experienceProperties[game]?.uiComponent,
    [game]
  );

  const [firstClick, setFirstClick] = useState(false);

  useEffect(() => {
    setFirstClick(false);
  }, [game]);

  useEffect(() => {
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchstart", handleMouseDown);
    window.addEventListener("touchend", handleMouseDown);
    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchstart", handleMouseDown);
      window.removeEventListener("touchend", handleMouseUp);
    };
  });

  const handleMouseDown = () => {
    if (!firstClick) {
      setFirstClick(true);
    }

    setMouseDown(true);
  };

  const handleMouseUp = () => {
    setMouseDown(false);
  };

  return (
    <>
      <Anchor id='anchor' />

      {experienceProperties[game]?.instructions && !firstClick && (
        <ClickMe>{experienceProperties[game]?.instructions}</ClickMe>
      )}

      <Browser />

      <Leva hidden={!isDevelopment} />

      <KeyboardControls
        map={[
          {
            name: "forward",
            keys: ["ArrowUp", "KeyW"],
          },
          {
            name: "backward",
            keys: ["ArrowDown", "KeyS"],
          },
          {
            name: "left",
            keys: ["ArrowLeft", "KeyA"],
          },
          {
            name: "right",
            keys: ["ArrowRight", "KeyD"],
          },
          {
            name: "jump",
            keys: ["Space"],
          },
        ]}
      >
        {UIComponent && <UIComponent />}
        <Canvas
          gl={{
            toneMappingExposure: 3,
            toneMapping: ACESFilmicToneMapping,
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

            <Preload all />

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
      </KeyboardControls>
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

const ClickMe = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  font-size: 26px;
  font-weight: 300;
  color: #f1f1f1;
  align-items: center;
  user-select: none;
  pointer-events: none;
  height: 100%;
  width: 100%;
  z-index: 100;
`;

export default App;
