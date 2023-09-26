import { Canvas } from "@react-three/fiber";

import { useMemo, useRef } from "react";
import { ShaderMaterial } from "three";
import { fragmentShader, vertexShader } from "./constants";

export const Fire = () => {
  const materialRef = useRef<ShaderMaterial | null>(null);

  const shaderData = useMemo(
    () => ({
      uniforms: {
        time: { value: 1 },
        intensity: { value: 2 },
      },
      fragmentShader,
      vertexShader,
    }),
    []
  );

  return (
    <mesh>
      <coneGeometry args={[1, 5, 32]} />
      <shaderMaterial ref={materialRef} attach='material' {...shaderData} />
    </mesh>
  );
};
