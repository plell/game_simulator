// import waterVertexShader from "./shaders/water/vertex.glsl";
// import waterFragmentShader from "./shaders/water/fragment.glsl";
import { Color, PlaneGeometry, ShaderMaterial, Vector2 } from "three";

export const Water = () => {
  const debug = {
    depthColor: "#186691",
    surfaceColor: "#9bd8ff",
  };

  const multiplier = 4;

  const waterGeometry = new PlaneGeometry(
    2 * multiplier,
    2 * multiplier,
    512 * multiplier,
    512 * multiplier
  );

  // Material
  const waterMaterial = new ShaderMaterial({
    // wireframe:true,
    // vertexShader: waterVertexShader,
    // fragmentShader: waterFragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uBigWavesElevation: { value: 0.2 },
      uBigWavesFrequency: { value: new Vector2(2, 1.5) },
      uBigWavesSpeed: { value: 0.75 },

      uSmallWavesElevation: { value: 0.2 },
      uSmallWavesFrequency: { value: new Vector2(2, 1.5) },
      uSmallWavesSpeed: { value: 0.15 },
      uSmallWavesIteration: { value: 4 },

      uDepthColor: { value: new Color(debug.depthColor) },
      uSurfaceColor: { value: new Color(debug.surfaceColor) },
      uColorOffset: { value: 0.08 },
      uColorMultiplier: { value: 3 },
    },
  });

  return (
    <group>
      <mesh material={waterMaterial} geometry={waterGeometry} />
    </group>
  );
};
