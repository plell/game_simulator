import { useFrame } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Group, Vector3 } from "three";
import useGame from "../../../../Stores/useGame";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { CrocModel } from "./model";

type Props = {
  position: Vector3;
  delay: number;
  id: number;
};

const reuseableVec = new Vector3();
const reuseableVec2 = new Vector3();

export type Timeout = ReturnType<typeof setTimeout> | null;

export const Croc = ({ position, id, delay }: Props) => {
  const body = useRef<RapierRigidBody | null>(null);
  const [speed, setSpeed] = useState(0);
  const [direction, setDirection] = useState(1);

  const bite = useGame((s) => s.bite);
  const hit = useGame((s) => s.hit);
  const damageUp = useGame((s) => s.damageUp);

  const bonked = useMemo(() => hit === id, [hit, id]);

  useEffect(() => {
    if (bonked) {
      changeSpeed();
    }
  }, [bonked]);

  useEffect(() => {
    if (bite === id) {
      damageUp();
      setDirection(direction * -1);
    }
  }, [bite]);

  const takeDamage = () => {
    console.log("ouch!");
  };

  useEffect(() => {
    changeSpeed();
  }, []);

  const changeSpeed = useCallback(() => {
    const random = Math.floor(Math.random() * 4) * direction + 2;
    setSpeed(random);
  }, [direction]);

  useFrame(({ clock }) => {
    if (body?.current) {
      const elapsedTime = clock.getElapsedTime();

      const z = Math.cos(elapsedTime * speed) * 3;

      const translation = body.current.translation();
      const position = reuseableVec.set(
        translation.x,
        translation.y,
        translation.z
      );

      position.lerp(reuseableVec2.set(position.x, position.y, z), 0.03);

      body.current.setTranslation(position, true);
    }
  });

  return (
    <group>
      <RigidBody
        ref={body}
        position={position}
        type='dynamic'
        userData={{ type: "croc", id }}
      >
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color='yellow' />
        </mesh>
        <CrocModel />
      </RigidBody>
    </group>
  );
};

export default Croc;
