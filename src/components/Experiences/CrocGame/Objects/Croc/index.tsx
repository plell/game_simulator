import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import { Group, Mesh, Vector3 } from "three";
import useGame from "../../../../../Stores/useGame";
import { CrocModel } from "./model";
import { useObjectsIntersect } from "../../../hooks/useObjectsIntersect";

type Props = {
  position: Vector3;
  id: number;
};

const reuseableVec = new Vector3();

export type Timeout = ReturnType<typeof setTimeout> | null;

const movementRange = {
  min: -10,
  max: 0,
};

const origin = new Vector3(1, 1, 1);
const baseSpeed = 0.3;

export const Croc = ({ position, id }: Props) => {
  const crocGroupRef = useRef<Group | null>(null);
  const wallRef = useRef<Mesh | null>(null);
  const score = useGame((s) => s.score);
  const scoreUp = useGame((s) => s.scoreUp);
  const setHit = useGame((s) => s.setHit);
  const [speed, setSpeed] = useState(baseSpeed);
  const [multiplier, setMultiplier] = useState(0.8);

  const [destination, setDestination] = useState(movementRange.min);

  const hit = useGame((s) => s.hit);
  const damageUp = useGame((s) => s.damageUp);

  const bonked = useMemo(() => hit === id, [hit, id]);

  useEffect(() => {
    if (score > 10 && multiplier !== 1.2) {
      setMultiplier(1.2);
    } else if (score > 20 && multiplier !== 1.8) {
      setMultiplier(1.8);
    } else if (score > 30 && multiplier !== 2.5) {
      setMultiplier(2.5);
    }
  }, [score]);

  useEffect(() => {
    if (bonked) {
      takeDamage();
      setHit(0);
    }
  }, [bonked]);

  const { objectsIntersect } = useObjectsIntersect(crocGroupRef, wallRef);

  useEffect(() => {
    if (objectsIntersect) {
      doDamage();
    }
  }, [objectsIntersect]);

  useEffect(() => {
    if (destination === movementRange.min) {
      setSpeed(3);
    } else {
      const rand = Math.random() * 0.04;
      setSpeed(baseSpeed + rand);
    }
  }, [destination]);

  const takeDamage = () => {
    setDestination(movementRange.min);

    if (crocGroupRef.current) {
      const scale = 0.8;
      crocGroupRef.current.scale.set(1, scale, 1);
    }
  };

  const doDamage = () => {
    damageUp();
    setDestination(movementRange.min);
  };

  useFrame(() => {
    if (crocGroupRef.current) {
      crocGroupRef.current.scale.lerp(origin, 0.1);
    }
    if (crocGroupRef?.current) {
      const crocPosition = crocGroupRef?.current.position;

      crocPosition.lerp(
        reuseableVec.set(crocPosition.x, crocPosition.y, destination),
        0.01 * speed * multiplier
      );

      if (
        destination !== movementRange.max &&
        crocPosition.z < movementRange.min + 1
      ) {
        setDestination(movementRange.max);
      }
    }
  });

  return (
    <group>
      <group ref={crocGroupRef} position={position}>
        <mesh
          onPointerDown={() => {
            scoreUp();
            setHit(id);
          }}
        >
          <boxGeometry args={[2.3, 4, 5]} />
          <meshStandardMaterial color='white' transparent opacity={0} />
        </mesh>
        <CrocModel id={id} />
      </group>

      <mesh ref={wallRef} position={[position.x, position.y, 1]}>
        <boxGeometry />
        <meshStandardMaterial transparent opacity={0} />
      </mesh>
    </group>
  );
};

export default Croc;
