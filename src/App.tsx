import { Canvas, useThree } from "@react-three/fiber";

import { Physics } from "@react-three/rapier";

import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
import { TextRevealer } from "./components/UI/TextRevealer";

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

  const controlsEnabled = useMemo(
    () => !experienceProperties[game].killCameraControls,
    [game]
  );

  return (
    <CameraControls
      ref={cameraControlsRef}
      dollySpeed={0.08}
      {...cameraProps}
      enabled={controlsEnabled}
    />
  );
};

export const AppWrapper = () => {
  const [showLoading, setShowLoading] = useState(true);
  return (
    <>
      {showLoading && <Loader />}
      <App setShowLoading={setShowLoading} />
    </>
  );
};

const Loader = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const i = setInterval(() => {
      setVisible((v) => !v);
    }, 1000);

    return () => {
      clearInterval(i);
    };
  }, []);

  return (
    <Loading>
      {visible && <TextRevealer>Loading Experience...</TextRevealer>}
    </Loading>
  );
};

const Loading = styled.div`
  display: flex;
  color: #fff;
  justify-content: center;
  align-items: center;
  position: absolute;
  height: 100%;
  width: 100%;
  z-index: 6;
`;

type AppProps = {
  setShowLoading: (b: boolean) => void;
};

const App = ({ setShowLoading }: AppProps) => {
  const game = useGame((s) => s.game);
  const dialogue = useGame((s) => s.dialogue);
  const dialogueIndex = useGame((s) => s.dialogueIndex);
  const setMouseDown = useGame((s) => s.setMouseDown);

  const GameComponent = useMemo(() => experienceProperties[game]?.game, [game]);
  const UIComponent = useMemo(
    () => experienceProperties[game]?.uiComponent,
    [game]
  );

  const [firstClick, setFirstClick] = useState(false);

  useEffect(() => {
    setShowLoading(false);
  }, []);

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

  const setDialogueIndex = useGame((s) => s.setDialogueIndex);
  const setDialogue = useGame((s) => s.setDialogue);

  return (
    <>
      <Anchor id='anchor' />

      {dialogue?.length && (
        <DialogueAnchor
          onClick={() => {
            const nextIndex = dialogueIndex + 1;
            if (dialogue[nextIndex]) {
              setDialogueIndex(nextIndex);
            } else {
              setDialogue(null);
              setDialogueIndex(0);
            }
          }}
        >
          <DialogueBox>
            <TextRevealer sound key={dialogueIndex}>
              {dialogue[dialogueIndex]}
            </TextRevealer>
            <Blinker />
          </DialogueBox>
        </DialogueAnchor>
      )}

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
                  edgeStrength={20}
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

const DialogueAnchor = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  user-select: none;
  height: calc(100% - 100px);
  width: calc(100% - 100px);
  padding: 50px;
  z-index: 5;
`;

const DialogueBox = styled.div`
  padding: 70px;
  font-family: monospace;
  user-select: none;
  font-size: 30px;
  max-width: 40%;
  height: 200px;
  width: calc(100% - 140px);
  background: #00000044;
  color: #ffffff;
  position: relative;
  line-height: 60px;
`;

const DialogueCursor = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  height: 30px;
  width: 30px;
  background: #ffffff;
`;

const Blinker = () => {
  const [visible, setVisible] = useState(false);

  return <DialogueCursor style={{ opacity: visible ? 1 : 0 }} />;
};

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
