import { useFrame } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Group, MathUtils, Mesh, Vector3 } from "three";
import useGame from "../../../../../Stores/useGame";
import { CrocModel } from "./model";
import { useObjectsIntersect } from "../../../hooks/useObjectsIntersect";
import { ImpactCloud } from "../../../common/ImpactCloud";

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

export const Croc = ({ position, id }: Props) => {
  const crocGroupRef = useRef<Group | null>(null);
  const wallRef = useRef<Mesh | null>(null);
  const scoreUp = useGame((s) => s.scoreUp);
  const setHit = useGame((s) => s.setHit);

  const [destination, setDestination] = useState(movementRange.min);

  const hit = useGame((s) => s.hit);
  const damageUp = useGame((s) => s.damageUp);

  const bonked = useMemo(() => hit === id, [hit, id]);

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

  const takeDamage = () => {
    setDestination(movementRange.min);
    if (crocGroupRef.current) {
      const scale = 0.7;
      crocGroupRef.current.scale.set(1, scale, 1);
    }
  };

  const doDamage = () => {
    damageUp();
    setDestination(movementRange.min);
  };

  useFrame(() => {
    if (crocGroupRef.current) {
      crocGroupRef.current.scale.lerp(origin, 0.08);
    }
    if (crocGroupRef?.current) {
      const crocPosition = crocGroupRef?.current.position;

      crocPosition.lerp(
        reuseableVec.set(crocPosition.x, crocPosition.y, destination),
        0.015
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
