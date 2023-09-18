import { Text } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import { Group, Vector3 } from "three";

type Props = {
  position: [x: number, y: number, z: number];
  value?: number | string;
  title: string;
};

export const Counter = ({ position, value, title }: Props) => {
  const ref = useRef<Group | null>(null);

  return (
    <group ref={ref} position={position}>
      <Text position-y={1} fontSize={0.8}>
        {title}
      </Text>
      <Text>{value}</Text>
    </group>
  );
};

export default Counter;
