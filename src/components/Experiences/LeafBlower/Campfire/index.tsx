import {
  BufferAttribute,
  BufferGeometry,
  DoubleSide,
  MathUtils,
  Mesh,
  PlaneGeometry,
  Vector4,
} from "three";
import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { fireVertexShader, fireFragmentShader } from "./shaders/new";

const fireGeometry = () => {
  // Create the BufferGeometry and add position attribute
  const geometry = new BufferGeometry();

  geometry.setAttribute(
    "orientation",
    new BufferAttribute(new Float64Array([0, 0, 0]), 1)
  );

  geometry.setAttribute(
    "offset",
    new BufferAttribute(new Float64Array([10, 2, 0]), 1)
  );

  geometry.setAttribute(
    "scale",
    new BufferAttribute(new Float64Array([10, 10]), 1)
  );

  geometry.setAttribute(
    "life",
    new BufferAttribute(new Float64Array([2.5]), 1)
  );

  geometry.setAttribute(
    "random",
    new BufferAttribute(new Float64Array([7.5]), 1)
  );

  return geometry;
};

export const Campfire = () => {
  const ref = useRef<Mesh | null>(null);

  const [hover, setHover] = useState(false);

  const uniforms = useMemo(
    () => ({
      uTime: {
        value: 0.0,
      },
      uColor1: {
        value: [255, 0, 0],
      },
      uColor2: {
        value: [100, 100, 100],
      },
    }),
    []
  );

  useFrame(({ clock }, delta) => {
    if (ref?.current) {
      ref.current.material.uniforms.uTime.value = 0.2 * clock.getElapsedTime();

      //   ref.current.material.uniforms.u_intensity.value = MathUtils.lerp(
      //     ref.current.material.uniforms.u_intensity.value,
      //     hover ? 0.95 : 0.25,
      //     0.3
      //   );

      //   ref.current.material.uniforms.u_color.value = MathUtils.lerp(
      //     ref.current.material.uniforms.u_color.value,
      //     hover ? 1.5 : 1,
      //     0.3
      //   );
    }
  });

  return (
    <group position={[0, 30, 90]}>
      <pointLight
        position={[0, 0, 0]}
        castShadow
        intensity={7000}
        color={"orange"}
      />
      <mesh
        ref={ref}
        // geometry={fireGeometry()}
        scale={4}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
      >
        <shaderMaterial
          fragmentShader={fireFragmentShader}
          vertexShader={fireVertexShader}
          uniforms={uniforms}
          wireframe={false}
        />
      </mesh>
    </group>
  );
};
