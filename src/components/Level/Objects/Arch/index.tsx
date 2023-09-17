import { Vector3 } from "three";

import { useGLTF } from "@react-three/drei";

type Props = {
  position: Vector3;
};

export type Timeout = ReturnType<typeof setTimeout> | null;

export const CrocArch = ({ position }: Props) => {
  const crocArch = useGLTF("./models/crocArch.gltf");

  crocArch.scene.children.forEach((mesh) => {
    mesh.castShadow = true;
    mesh.receiveShadow = true;
  });

  return (
    <primitive
      position={position}
      //   rotation-y={Math.PI * -0.5}
      object={crocArch.scene.clone()}
      scale={0.6}
    />
  );
};

export default CrocArch;
