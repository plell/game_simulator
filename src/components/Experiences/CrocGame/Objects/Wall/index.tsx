import { Vector3 } from "three";

import { useGLTF } from "@react-three/drei";
import { useEffect } from "react";

type Props = {
  position: Vector3;
};

useGLTF.preload("./models/crocWallLess.gltf");

export const Wall = ({ position }: Props) => {
  const wallModel = useGLTF("./models/crocWallLess.gltf");

  useEffect(() => {
    wallModel.scene.children.forEach((mesh) => {
      mesh.receiveShadow = true;
      mesh.castShadow = true;
    });
  }, []);

  return (
    <primitive
      position={position}
      rotation-y={Math.PI * -0.5}
      object={wallModel.scene.clone()}
      scale={0.2}
      scale-x={0.3}
    />
  );
};

export default Wall;
