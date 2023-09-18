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

const origin = new Vector3();

const CameraController = () => {
  const { camera } = useThree();

  const cameraPosition = useGame((s) => s.cameraPosition);

  const { position, lookAtTarget } = useControls("camera", {
    position: { value: { x: 0, y: 20, z: 16 }, step: 0.5 },
    lookAtTarget: { value: { x: 0, y: 7, z: 0 }, step: 0.5 },
  });

  useEffect(() => {
    console.log("cameraPosition", cameraPosition);
  }, [cameraPosition]);

  useFrame(() => {
    if (camera) {
      camera.position.set(position.x, position.y, position.z);
      camera.lookAt(origin.set(lookAtTarget.x, lookAtTarget.y, lookAtTarget.z));
    }
  });

  return null;
};

const App = () => {
  return (
    <>
      <Overlay>
        <Browser />
      </Overlay>
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
          <CameraController />
          <Lights />

          <Physics gravity={[0, 0, 0]}>
            <CrocGame />
          </Physics>
        </Suspense>
      </Canvas>
    </>
  );
};

export default App;

const Overlay = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  width: calc(100% - 100px);
  height: calc(100% - 100px);
  padding: 50px;
  display: flex;
  justify-content: flex-end;
  align-items: center;

  user-select: none;
  pointer-events: none;
  font-size: 40px;
  font-weight: 900;
  color: #fff;
  z-index: 10;
`;
