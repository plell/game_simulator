import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";

import styled from "styled-components";
import { Vector3 } from "three";

import { Level } from "./components/Level";

import { Lights } from "./components/Lights";
import { Physics } from "@react-three/rapier";

import { Suspense, useRef } from "react";
import { Leva, useControls } from "leva";

const origin = new Vector3();

const CameraController = () => {
  const { camera } = useThree();

  const { cameraPosition, lookAtTarget } = useControls("camera", {
    cameraPosition: { value: { x: 0, y: 20, z: 16 }, step: 0.5 },
    lookAtTarget: { value: { x: 0, y: 7, z: 0 }, step: 0.5 },
  });

  useFrame(() => {
    if (camera) {
      camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
      camera.lookAt(origin.set(lookAtTarget.x, lookAtTarget.y, lookAtTarget.z));
    }
  });

  return null;
};

const App = () => {
  return (
    <>
      {/* <Overlay></Overlay> */}
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
            <Level />
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
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  user-select: none;
  pointer-events: none;
  font-size: 40px;
  font-weight: 900;
  color: #fff;
  z-index: 10;
`;
