import { useHelper } from "@react-three/drei";
import { useControls } from "leva";
import { useEffect, useMemo, useRef } from "react";
import {
  DirectionalLight,
  DirectionalLightHelper,
  DoubleSide,
  Mesh,
  PointLight,
  PointLightHelper,
  RectAreaLight,
  SpotLight,
  SpotLightHelper,
  Vector3,
} from "three";
import { useBasicDebug } from "../Experiences/hooks/useBasicDebug";
import { useFrame } from "@react-three/fiber";

const center = new Vector3();

export const Lights = () => {
  const pointRef = useRef<PointLight>(null);
  const directionalRef = useRef<DirectionalLight>(null);
  const rectAreaRef = useRef<RectAreaLight>(null);
  const spotRef = useRef<SpotLight>(null);
  const rectAreaHelper = useRef<Mesh>(null);

  const spotLight = useBasicDebug("spotLight", {
    position: [0, 0, 0],
  });

  const directionalLight = useBasicDebug("directionalLight", {
    position: [0, 0, 0],
  });

  const pointLight = useControls("pointLight", {
    position: {
      value: [-52, 41, -47],
      step: 4,
    },
    intensity: 4300,
    visible: true,
    color: { value: "#fff9d6" },
  });

  const rectLightParams = useControls("rectLight", {
    position: {
      value: [40, 230, -44],
      step: 4,
    },
    intensity: 100,
    height: 10,
    width: 200,
    visible: true,
    color: { value: "#fff7d6" },
  });

  // @ts-ignore
  // useHelper(pointRef, PointLightHelper, 10, "red");
  // @ts-ignore
  useHelper(directionalRef, DirectionalLightHelper, 10, "green");
  // @ts-ignore
  useHelper(spotRef, SpotLightHelper, 10, "blue");

  useFrame(() => {
    if (rectAreaRef.current) {
      rectAreaRef.current.lookAt(center);
      if (rectAreaHelper.current) {
        rectAreaHelper.current.position.copy(rectAreaRef.current.position);
        rectAreaHelper.current.rotation.copy(rectAreaRef.current.rotation);
      }
    }
  });

  return (
    <>
      <pointLight ref={pointRef} {...pointLight} />

      <rectAreaLight ref={rectAreaRef} {...rectLightParams} />

      <mesh ref={rectAreaHelper}>
        <planeGeometry args={[rectLightParams.width, rectLightParams.height]} />
        <meshBasicMaterial side={DoubleSide} wireframe color={"#fff"} />
      </mesh>

      <ambientLight intensity={0.4} />
    </>
  );
};
