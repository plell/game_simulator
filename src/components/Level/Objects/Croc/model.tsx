import { useFrame } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CylinderGeometry, Group, Vector3 } from "three";

import { useGLTF } from "@react-three/drei";

export const CrocModel = () => {
  const crocModel = useGLTF("./models/croc.gltf");

  return (
    <group dispose={null}>
      <primitive
        rotation-y={Math.PI * -0.5}
        object={crocModel.scene}
        scale={0.2}
      />
    </group>
  );
};

export default CrocModel;
