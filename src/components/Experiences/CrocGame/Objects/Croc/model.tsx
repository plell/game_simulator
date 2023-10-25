import { useGLTF } from "@react-three/drei";
import { useEffect } from "react";

type Props = {
  id: number | string;
};

useGLTF.preload("./models/croc_less.gltf");

export const CrocModel = ({ id }: Props) => {
  const crocModel = useGLTF("./models/croc_less.gltf");

  useEffect(() => {
    crocModel.scene.children.forEach((mesh) => {
      mesh.userData = { type: "croc", id };
      if (!mesh.name.includes("Plane")) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
  }, []);

  return (
    <primitive
      rotation-y={Math.PI * -0.5}
      object={crocModel.scene.clone()}
      scale={0.2}
    />
  );
};

export default CrocModel;
