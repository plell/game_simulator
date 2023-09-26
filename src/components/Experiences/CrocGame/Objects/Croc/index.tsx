import { useFrame } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Group, Mesh, Vector3 } from "three";
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

const movementRange = 4;

export const Croc = ({ position, id }: Props) => {
  const crocGroupRef = useRef<Group | null>(null);
  const wallRef = useRef<Mesh | null>(null);

  const [speed, setSpeed] = useState(0);
  const [direction, setDirection] = useState(1);

  const setHit = useGame((s) => s.setHit);
  const hit = useGame((s) => s.hit);
  const damageUp = useGame((s) => s.damageUp);

  const bonked = useMemo(() => hit === id, [hit, id]);

  useEffect(() => {
    changeSpeed();
  }, []);

  useEffect(() => {
    if (bonked) {
      takeDamage();
      setHit(0);
    }
  }, [bonked]);

  const { objectsIntersect } = useObjectsIntersect(crocGroupRef, wallRef);

  useEffect(() => {
    if (objectsIntersect) {
      damageUp();
    }
    setDirection(direction * -1);
  }, [objectsIntersect]);

  const takeDamage = () => {
    console.log("ouch!");
    changeSpeed();
  };

  const changeSpeed = useCallback(() => {
    const random = Math.floor(Math.random() * 12) + 1;
    setSpeed(random);
  }, [direction]);

  useFrame(({ clock }) => {
    if (crocGroupRef?.current) {
      const elapsedTime = clock.getElapsedTime();

      const newZ =
        Math.cos(elapsedTime * speed * 0.1) * movementRange + position.z;

      const crocPosition = crocGroupRef?.current.position;

      crocPosition.lerp(
        reuseableVec.set(crocPosition.x, crocPosition.y, newZ),
        0.03
      );

      crocGroupRef.current.position.set(
        crocPosition.x,
        crocPosition.y,
        crocPosition.z
      );
    }
  });

  return (
    <group>
      <group ref={crocGroupRef} position={position}>
        <CrocModel disabled={true} id={id} />
      </group>

      <mesh ref={wallRef} position={[position.x, position.y, 1]}>
        <boxGeometry />
        <meshStandardMaterial transparent opacity={0} />
      </mesh>
    </group>
  );
};

export default Croc;
