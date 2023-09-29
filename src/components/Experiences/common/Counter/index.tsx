import { Text } from "@react-three/drei";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Group, Vector3 } from "three";
import { Timeout } from "../../../../Stores/types";

type Props = {
  position: [x: number, y: number, z: number];
  value: number;
  title: string;
};

let timeout: Timeout = null;

const countSpeed = 200;

export const Counter = ({ position, value, title }: Props) => {
  const ref = useRef<Group | null>(null);
  const [_value, _setValue] = useState(0);

  useEffect(() => {
    if (!timeout) {
      // count();
    }

    return () => clearCount();
  }, [value]);

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
      <Text position-y={1} fontSize={0.8}>
        {title}
      </Text>
      <Text>{value}</Text>
    </group>
  );
};

export default Counter;
