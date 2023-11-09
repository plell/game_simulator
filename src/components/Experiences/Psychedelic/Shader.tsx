import { vertexShader } from "./shaders/vertexShader";
import { fragmentShader } from "./shaders/fragmentShader";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { ShaderMaterial } from "three";

const size = 100.0;

type Props = {
  opacity?: number;
};

export const Shader = ({ opacity }: Props) => {
  const ref = useRef<ShaderMaterial | null>(null);

  const uniforms = useMemo(
    () => ({
      uTime: {
        value: 0.0,
      },
      uSize: {
        value: size,
      },
    }),
    []
  );

  useFrame(({ clock }) => {
    if (ref?.current) {
      const elapsed = clock.getElapsedTime();
      ref.current.uniforms.uTime.value = elapsed;
    }
  });

  return (
    <shaderMaterial
      ref={ref}
      transparent
      opacity={opacity}
      fragmentShader={fragmentShader}
      vertexShader={vertexShader}
      uniforms={uniforms}
    />
  );
};
