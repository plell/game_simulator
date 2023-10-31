import { Vector3 } from "three";

type Props = {
  position: Vector3;
};

export type Timeout = ReturnType<typeof setTimeout> | null;

export const Ring = ({ position }: Props) => {
  return (
    <mesh>
      <torusGeometry />
      <meshBasicMaterial />
    </mesh>
  );
};
