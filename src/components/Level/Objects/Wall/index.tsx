import { Vector3 } from "three";

import { useGLTF } from "@react-three/drei";

type Props = {
  position: Vector3;
};

export const Wall = ({ position }: Props) => {
  const wallModel = useGLTF("./models/crocWall.gltf");

  wallModel.scene.children.forEach((mesh) => {
    mesh.receiveShadow = true;
    mesh.castShadow = true;
  });

  return (
    <primitive
      position={position}
      rotation-y={Math.PI * -0.5}
      object={wallModel.scene.clone()}
      scale={0.2}
      scale-z={0.15}
    />
  );
};

useGLTF.preload("./models/crocWall.gltf");

export default Wall;
