import { useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Mesh } from "three";
import useGame from "../../../Stores/useGame";
import { experienceProperties } from "../../../Stores/constants";

import { vertexShader } from "./shaders/vertexShader";
import { fragmentShader } from "./shaders/fragmentShader";

export const Psychedelic = () => {
  const game = useGame((s) => s.game);

  return (
    <group position={experienceProperties[game]?.gamePosition}>
      <Content />
    </group>
  );
};

const size = 100.0;

const triangleSize = 13.8;
const triangleYAdjust = 1.7;
const Content = () => {
  const ref = useRef<Mesh | null>(null);
  const [hovered, setHovered] = useState(null);

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
      ref.current.material.uniforms.uTime.value = elapsed;
    }
  });

  const triangles = useMemo(() => {
    return [
      { x: triangleSize, y: 0, rotation: Math.PI },
      { x: -triangleSize, y: 0, rotation: Math.PI * 2 },
      {
        x: -triangleSize * 0.5,
        y: -triangleSize + triangleYAdjust,
        rotation: Math.PI * 3,
      },
      {
        x: triangleSize * 0.5,
        y: triangleSize - triangleYAdjust,
        rotation: Math.PI * 4,
      },
      {
        x: -triangleSize * 0.5,
        y: triangleSize - triangleYAdjust,
        rotation: Math.PI * 5,
      },
      {
        x: triangleSize * 0.5,
        y: -triangleSize + triangleYAdjust,
        rotation: Math.PI * 6,
      },
    ];
  }, []);

  return (
    <Suspense fallback={null}>
      <group position-z={15}>
        {triangles.map((t, i) => {
          return (
            <mesh
              key={`${i}-sensor`}
              position-x={t.x}
              position-y={t.y}
              onPointerEnter={() => setHovered(t)}
            >
              <circleGeometry args={[triangleSize, 0, t.rotation]} />
              <meshBasicMaterial color='blue' transparent opacity={0.01} />
            </mesh>
          );
        })}

        <mesh
          visible={!!hovered}
          position-x={hovered?.x}
          position-y={hovered?.y}
        >
          <circleGeometry args={[triangleSize, 0, hovered?.rotation]} />
          <meshStandardMaterial
            emissive={"mediumpurple"}
            emissiveIntensity={4.48}
          />
        </mesh>
      </group>

      <group position-z={10}></group>

      <mesh
        rotation-x={Math.PI * 0.5}
        ref={ref}
        onPointerOut={() => setHovered(null)}
      >
        <coneGeometry args={[30, 30, 6, undefined, true]} />
        <shaderMaterial
          fragmentShader={fragmentShader}
          vertexShader={vertexShader}
          uniforms={uniforms}
          wireframe={false}
        />
      </mesh>

      <mesh rotation-z={Math.PI * -0.5} position-z={-30}>
        <planeGeometry args={[200, 300]} />
        <shaderMaterial
          fragmentShader={fragmentShader}
          vertexShader={vertexShader}
          uniforms={uniforms}
        />
      </mesh>
    </Suspense>
  );
};
