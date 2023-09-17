import { useHelper } from "@react-three/drei";
import { useRef } from "react";
import {
  DirectionalLight,
  DirectionalLightHelper,
  PointLight,
  PointLightHelper,
} from "three";

export const Lights = () => {
  const ref = useRef<DirectionalLight | null>(null);
  const pointRef = useRef<PointLight | null>(null);

  // @ts-ignore
  // useHelper(ref, DirectionalLightHelper, "red");
  // @ts-ignore
  useHelper(pointRef, PointLightHelper, "red");

  return (
    <>
      <pointLight
        ref={pointRef}
        castShadow
        position={[-7, 16, 7]}
        intensity={1000}
        color={"yellow"}
        shadow-bias={-0.001}
        shadow-mapSize-width={1024} // Adjust shadow map size
        shadow-mapSize-height={1024} // Adjust shadow map size
      />

      {/* <directionalLightHelper light={ref} /> */}
      <ambientLight intensity={0.3} />
    </>
  );
};
