import { Text } from "@react-three/drei";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Color, Group, MeshStandardMaterial, Vector3 } from "three";
import { Timeout } from "../../../../Stores/types";
import { useFrame } from "@react-three/fiber";

type Props = {
  position: [x: number, y: number, z: number];
  value: number;
  title: string;
};

let timeout: Timeout = null;

const countSpeed = 200;

const material = new MeshStandardMaterial();

export const Counter = ({ position, value, title }: Props) => {
  const ref = useRef<Group | null>(null);
  const [_value, _setValue] = useState(0);

  const color = useMemo(() => new Color("orange"), []);
  const emissiveMaterial = useMemo(
    () =>
      new MeshStandardMaterial({
        emissive: color,
        emissiveIntensity: 10,
      }),
    []
  );
  const emissiveMaterialRef = useRef(emissiveMaterial);

  useEffect(() => {
    if (emissiveMaterialRef.current) {
      emissiveMaterialRef.current.emissive.set("red");
    }

    return () => clearCount();
  }, [value]);

  useFrame(() => {
    emissiveMaterialRef.current.emissive.lerp(color, 0.08);
  });

  const clearCount = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };

  const count = () => {
    timeout = setTimeout(() => {
      let increment = 1;

      if (_value > value) {
        increment = -1;
      }

      const newValue = _value + increment;

      _setValue(newValue);

      if (newValue !== value) {
        count();
      } else {
        clearCount();
      }
    }, countSpeed);
  };

  return (
    <group ref={ref} position={position}>
      <Text position-y={1} fontSize={0.8} material={material}>
        {title}
      </Text>

      <Text material={emissiveMaterialRef.current}>{value}</Text>

      <mesh position-z={0.01}>
        <planeGeometry args={[2, 1.2]} />
        <meshStandardMaterial color='black' transparent opacity={0.7} />
      </mesh>
    </group>
  );
};

export default Counter;
