import { useGLTF } from "@react-three/drei";
import { useEffect, useMemo } from "react";

type Props = {
  id: number | string;
};

useGLTF.preload("./models/ghost_less.glb");

export const Model = ({ id }: Props) => {
  const model = useGLTF("./models/ghost_less.glb");

  const cloneModel = useMemo(() => {
    model.scene.children.forEach((mesh) => {
      mesh.userData = { type: "ghost", id };
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    });

    return model.scene.clone();
  }, [model]);

  return (
    <primitive rotation-y={Math.PI * -0.5} object={cloneModel} scale={2} />
  );
};
