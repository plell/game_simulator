import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import {
  MutableRefObject,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  BoxGeometry,
  Color,
  Group,
  MathUtils,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Vector3,
} from "three";
import { useFrame } from "@react-three/fiber";
import { Refs } from "../..";
import {
  useObjectIntersectsManyB,
  useObjectsIntersect,
} from "../../../hooks/useObjectsIntersect";
import gsap from "gsap";

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

const baseColor = new Color("#aaaaaa");
const boxGeo = new BoxGeometry(2, 1, 1);

export const Enemy = ({ projectilesRef, playerRef }: Props) => {
  const ref = useRef<Group | null>(null);
  const materialRef = useRef<MeshBasicMaterial | null>(null);
  const [color, setColor] = useState(baseColor.clone());
  const [scale, setScale] = useState(1);
  const [animating, setAnimating] = useState(false);

  const [spawnPosition, setSpawnPosition] = useState({
    x: getRandomX(),
    y: getRandomY(),
  });

  const reset = () => {
    setAnimating(false);
    if (ref?.current) {
      ref.current.position.y = 30;
      ref.current.rotation.z = 0;

      if (materialRef.current) {
        materialRef.current.opacity = 1;
      }
      setSpawnPosition({ x: getRandomX(), y: getRandomY() });
      setColor(color.set(baseColor));
      setScale(1);
    }
  };

  const { objectsIntersect } = useObjectsIntersect(ref, playerRef);

  useEffect(() => {
    if (objectsIntersect) {
      setColor(color.set("red"));
      setScale(0);
    }
  }, [objectsIntersect]);

  const intersect = useObjectIntersectsManyB(ref, projectilesRef);

  useFrame((_, delta) => {
    if (ref?.current) {
      ref.current.position.y -= delta * 4;

      const scl = MathUtils.lerp(ref.current.scale.x, scale, 0.2);
      ref.current.scale.set(scl, scl, scl);

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
      materialRef.current.color.lerp(color, 0.4);
    }
  });

  const hit = () => {
    if (!animating && ref.current) {
      setAnimating(true);
      setColor(color.set("red"));
      gsap
        .to(ref.current.rotation, {
          duration: 0.3,
          keyframes: {
            "0%": new Vector3(0, 0, 0),
            "100%": new Vector3(0, Math.PI * 2, 0),
          },
          onComplete: () => {
            reset();
          },
        })
        .play();

      const opacity = {
        value: 1,
      };

      gsap
        .to(opacity, {
          duration: 0.2,
          keyframes: {
            "0%": { value: 1 },
            "100%": { value: 0 },
          },
          onUpdate: () => {
            if (materialRef.current) {
              materialRef.current.opacity = opacity.value;
            }
          },
        })
        .play();
    }
  };

  return (
    <group ref={ref} position={[spawnPosition.x, spawnPosition.y, 0]}>
      <mesh geometry={boxGeo}>
        <meshBasicMaterial ref={materialRef} transparent />
      </mesh>
    </group>
  );
};
