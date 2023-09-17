import { useRef } from "react";
import { Group, Vector3 } from "three";

import { useGLTF } from "@react-three/drei";

type Props = {
  position: Vector3;
};

export const Wall = ({ position }: Props) => {
  const groupRef = useRef<Group | null>(null);
  const wallModel = useGLTF("./models/crocWall.gltf");

  wallModel.scene.children.forEach((mesh) => {
    mesh.receiveShadow = true;
  });

  return (
    <group castShadow position={position} ref={groupRef} dispose={null}>
      <primitive
        rotation-y={Math.PI * -0.5}
        object={wallModel.scene.clone()}
        scale={0.2}
      />
    </group>
  );
};

useGLTF.preload("./models/crocWall.gltf");

export default Wall;
