import { Line } from "@react-three/drei";

import { Vector3 } from "three";

type Props = {
  points: Vector3[];
};

export const CurvedLine = ({ points }: Props) => {
  if (!points.length) {
    return null;
  }

  return (
    <Line
      color={"crimson"}
      // dashed={false} // Default
      lineWidth={5} // In pixels (default)
      points={points} // Array of points, Array<Vector3 | Vector2 | [number, number, number] | [number, number] | number>
    />
  );
};
