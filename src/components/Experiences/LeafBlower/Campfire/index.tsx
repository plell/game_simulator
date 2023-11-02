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
  return (
    <group position={[0, 30, 90]}>
      <pointLight
        position={[0, 0, 0]}
        castShadow
        intensity={5000}
        color={"orange"}
      />
    </group>
  );
};
