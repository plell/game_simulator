import { useEffect, useRef } from "react";
import { Group } from "three";

import { useGLTF } from "@react-three/drei";

export const CrocModel = () => {
  const groupRef = useRef<Group | null>(null);
  const crocModel = useGLTF("./models/croc.gltf");

  crocModel.scene.children.forEach((mesh) => {
    mesh.receiveShadow = true;
  });

  return (
    <group castShadow receiveShadow ref={groupRef} dispose={null}>
      <primitive
        rotation-y={Math.PI * -0.5}
        object={crocModel.scene.clone()}
        scale={0.2}
      />
    </group>
  );
};

useGLTF.preload("./models/croc.gltf");

export default CrocModel;
