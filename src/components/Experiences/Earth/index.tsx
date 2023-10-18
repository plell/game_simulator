import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import { Mesh, MathUtils } from "three";
import useGame from "../../../Stores/useGame";
import { experienceProperties } from "../../../Stores/constants";

import vertexShader from "./shaders/vertexShader";
import fragmentShader from "./shaders/fragmentShader";

export const Earth = () => {
  const game = useGame((s) => s.game);

  return (
    <group position={experienceProperties[game]?.gamePosition}>
      {/* <directionalLight ref={lightRef} intensity={3} position={[0, 0, 90]} /> */}

      <Planet />
    </group>
  );
};

const Planet = () => {
  // This reference will give us direct access to the mesh
  const ref = useRef<Mesh | null>(null);
  const [hover, setHover] = useState(false);

  const uniforms = useMemo(
    () => ({
      u_intensity: {
        value: 0.3,
      },
      u_time: {
        value: 0.0,
      },
      u_color: {
        value: 0.0,
      },
    }),
    []
  );

  useFrame(({ clock }, delta) => {
    if (ref?.current) {
      const elapsed = clock.getElapsedTime();
      ref.current.material.uniforms.u_time.value = 0.2 * elapsed;

      const value = Math.sin(elapsed) + 0.5;

      ref.current.material.uniforms.u_intensity.value = MathUtils.lerp(
        ref.current.material.uniforms.u_intensity.value,
        value,
        0.3
      );

      ref.current.material.uniforms.u_color.value = MathUtils.lerp(
        ref.current.material.uniforms.u_color.value,
        1,
        0.3
      );

      ref.current.rotation.y += delta * 0.6;
    }
  });

  return (
    <mesh
      ref={ref}
      position={[0, 0, 0]}
      scale={4}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <icosahedronGeometry args={[2, 20]} />
      <shaderMaterial
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms}
        wireframe={false}
      />
    </mesh>
  );
};
