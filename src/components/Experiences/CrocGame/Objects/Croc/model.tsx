import { useGLTF } from "@react-three/drei";
import { useEffect } from "react";

type Props = {
  id: number | string;
  disabled: boolean;
};

export const CrocModel = ({ id, disabled }: Props) => {
  const crocModel = useGLTF("./models/croc.gltf");

  crocModel.scene.children.forEach((mesh) => {
    mesh.userData = { type: "croc", id };
    mesh.castShadow = true;
    mesh.receiveShadow = true;
  });

  return (
    <primitive
      rotation-y={Math.PI * -0.5}
      object={crocModel.scene.clone()}
      scale={0.2}
    />
  );
};

useGLTF.preload("./models/croc.gltf");

export default CrocModel;