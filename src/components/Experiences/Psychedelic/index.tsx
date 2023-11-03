import { Suspense, useMemo, useState } from "react";
import useGame from "../../../Stores/useGame";
import { experienceProperties } from "../../../Stores/constants";
import { Select } from "@react-three/postprocessing";
import { Shader } from "./Shader";

export const Psychedelic = () => {
  const game = useGame((s) => s.game);

  return (
    <group position={experienceProperties[game]?.gamePosition}>
      <Content />
    </group>
  );
};

const triangleSize = 12.8;
const triangleYAdjust = 1.7;
const Content = () => {
  const [hovered, setHovered] = useState(null);

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

        <Select enabled={!!hovered}>
          <mesh
            visible={!!hovered}
            position-x={hovered?.x}
            position-y={hovered?.y}
          >
            <circleGeometry args={[triangleSize, 0, hovered?.rotation]} />
            <meshBasicMaterial transparent opacity={0} />
          </mesh>
        </Select>
      </group>

      <Select enabled={!hovered}>
        <mesh rotation-x={Math.PI * 0.5} onPointerOut={() => setHovered(null)}>
          <coneGeometry args={[30, 30, 6, undefined, true]} />
          <Shader />
        </mesh>
      </Select>

      <mesh rotation-z={Math.PI * -0.5} position-z={-30}>
        <planeGeometry args={[200, 300]} />
        <Shader />
      </mesh>
    </Suspense>
  );
};
