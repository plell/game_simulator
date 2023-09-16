import { Canvas } from "@react-three/fiber";

import styled from "styled-components";
import { Vector3 } from "three";

import { Level } from "./components/Level";

import { Lights } from "./components/Lights";
import { Physics } from "@react-three/rapier";
import { Environment, EnvironmentCube, Stage } from "@react-three/drei";
import * as THREE from "three";

const cameraPosition = new Vector3(0, 10, 10);

const App = () => {
  return (
    <>
      {/* <Overlay></Overlay> */}

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
          position: [0, 16, 20],
        }}
      >
        <EnvironmentCube preset='sunset' />
        <Lights />
        <Physics gravity={[0, 0, 0]}>
          <Level />
        </Physics>
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
