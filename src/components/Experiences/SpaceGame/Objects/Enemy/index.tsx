import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import {
  MutableRefObject,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { Timeout } from "../../../CrocGame/Objects/Croc";
import { useGLTF } from "@react-three/drei";
import { Color, Group, MeshStandardMaterial, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";
import { Refs } from "../..";
import {
  useObjectIntersectsManyB,
  useObjectsIntersect,
} from "../../../hooks/useObjectsIntersect";

const width = 30;

const getRandomX = () => {
  return Math.random() * width - width / 2;
};

const getRandomY = () => {
  return 20 + Math.random() * 34 - 14 / 2;
};

type Props = {
  projectilesRef: MutableRefObject<Refs>;
  playerRef: MutableRefObject<Group | null>;
};

export const Enemy = ({ projectilesRef, playerRef }: Props) => {
  const ref = useRef<Group | null>(null);
  const materialRef = useRef<MeshStandardMaterial | null>(null);
  const [color, setColor] = useState(new Color("red"));

  const [spawnPosition, setSpawnPosition] = useState({
    x: getRandomX(),
    y: getRandomY(),
  });

  const reset = () => {
    if (ref?.current) {
      ref.current.position.y = 30;
      setSpawnPosition({ x: getRandomX(), y: getRandomY() });
      setColor(new Color("red"));
    }
  };

  const { objectsIntersect } = useObjectsIntersect(ref, playerRef);

  useEffect(() => {
    if (objectsIntersect) {
      setColor(new Color("black"));
    }
  }, [objectsIntersect]);

  const intersect = useObjectIntersectsManyB(ref, projectilesRef);

  useFrame((_, delta) => {
    if (ref?.current) {
      ref.current.position.y -= delta * 5;

      if (intersect.current.length > 0) {
        const id = intersect.current[0];
        projectilesRef.current[id].position.set(0, 400, 0);
        hit();
      }

      if (ref.current.position.y < -30) {
        reset();
      }
    }

    if (materialRef.current) {
      materialRef.current.color = color;
      // MathUtils.lerp(
      //     ref.current.material.uniforms.u_color.value,
      //     hover ? 1.5 : 1,
      //     0.3
      //   );
    }
  });

  const hit = () => {
    reset();
  };

  return (
    <group ref={ref} position={[spawnPosition.x, spawnPosition.y, 0]}>
      <mesh>
        <boxGeometry args={[2, 1, 1]} />
        <meshStandardMaterial ref={materialRef} color={"red"} />
      </mesh>
    </group>
  );
};

useGLTF.preload("./models/bird.gltf");
