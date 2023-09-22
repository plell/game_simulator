import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Group, MeshBasicMaterial, Vector3 } from "three";

import { SpriteAnimator } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import {
  MOVEMENT_DAMPING,
  defaultTempo,
  getMovement,
  grid,
} from "../../Stores/constants";
import { Player, Players, Timeout } from "../../Stores/types";
import useGame from "../../Stores/useGame";
import { Damage } from "../Effects/Damage";
import { dieSound } from "../Sounds/Tone";
import { HealthBar } from "../UI/HealthBar";
import { useOuch } from "../hooks/useOuch";

const reuseableVector3a = new Vector3();
const reuseableVector3b = new Vector3();
const reuseableVector3c = new Vector3();

const movementInterval = 1000;
const speed = 1;

const padding = 1;
const getEnemyStartPosition = () => {
  let x =
    Math.random() - 0.5 < 0
      ? -(grid.width / 2) + padding
      : grid.width / 2 - padding;
  let y =
    Math.random() - 0.5 < 0
      ? -(grid.height / 2) + padding
      : grid.height / 2 - padding;

  const side = Math.random() - 0.5;
  if (side < 1) {
    x = Math.random() * grid.width - grid.width / 2;
  } else {
    y = Math.random() * grid.height - grid.height / 2;
  }

  return new Vector3(x, y, 0);
};

export const Enemy = (props: Player) => {
  const players = useGame((s) => s.players);
  const enemies = useGame((s) => s.enemies);
  const setEnemies = useGame((s) => s.setEnemies);
  const body = useRef<RapierRigidBody | null>(null);
  const material = useRef<MeshBasicMaterial | null>(null);
  const group = useRef<Group | null>(null);

  const [flipX, setFlipX] = useState(true);

  const health = useMemo(
    () => enemies[props.id]?.health || 0,
    [enemies, props.id]
  );

  const ouch = useOuch(health);

  let timeout: Timeout = null;

  const startPosition = useMemo(() => getEnemyStartPosition(), []);

  useEffect(() => {
    if (!enemies[props.id]) {
      return;
    }

    if (health < 1 && !enemies[props.id].dead) {
      const enemiesCopy = { ...enemies };
      enemiesCopy[props.id].dead = true;
      dieSound();
      setEnemies(enemiesCopy);
    }
  }, [health]);

  useLayoutEffect(() => {
    const enemiesCopy = { ...enemies };
    if (enemiesCopy[props.id]) {
      enemiesCopy[props.id].body = body;
      setEnemies(enemiesCopy);
    }
  }, []);

  useFrame(() => {
    if (group?.current && body?.current) {
      const pos = body.current.translation();
      const currentPosition = reuseableVector3c.set(pos.x, pos.y, pos.z);
      group?.current.position.copy(currentPosition);
    }
  });

  useEffect(() => {
    doMovementTimeout();

    return function cleanup() {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, []);

  const doMovementTimeout = () => {
    const t = useGame.getState().tempo;
    const ratio = defaultTempo / (t || 1);

    timeout = setTimeout(() => {
      applyForce();
      doMovementTimeout();
    }, movementInterval * ratio);
  };

  const getClosestMeshPosition = (
    sourceRigidBody: React.MutableRefObject<RapierRigidBody | null>,
    surroundingRigidBodies: Players
  ) => {
    const closest: any = {
      key: "",
      distance: null,
      position: null,
    };

    const enemyPosition = sourceRigidBody?.current?.translation();

    const sourcePosition = reuseableVector3b.set(
      enemyPosition?.x || 0,
      enemyPosition?.y || 0,
      enemyPosition?.z || 0
    );

    Object.keys(surroundingRigidBodies).forEach((key) => {
      const player = surroundingRigidBodies[key];

      if (player?.dead) {
        return;
      }

      const meshBodyRef = player.body;

      const aPosition = meshBodyRef?.current?.translation();

      if (aPosition !== undefined && enemyPosition !== undefined) {
        const targetPosition = reuseableVector3a.set(
          aPosition?.x,
          aPosition?.y,
          aPosition?.z
        );

        const distance = sourcePosition.distanceTo(targetPosition);

        if (!closest.distance || closest.distance > distance) {
          closest.key = key;
          closest.distance = distance;
          closest.position = targetPosition;
        }
      }
    });

    if (closest.position) {
      return closest.position;
    }

    return null;
  };

  const applyForce = () => {
    if (body.current) {
      const pos = body.current.translation();
      const currentPosition = reuseableVector3c.set(pos.x, pos.y, pos.z);

      const impulse = { x: 0, y: 0, z: 0 };

      const destination = getClosestMeshPosition(body, players);

      if (!destination) {
        return;
      }

      const { tempo } = useGame.getState();

      const movement = getMovement(
        currentPosition,
        destination,
        speed * 0.2,
        tempo
      );

      impulse.x = movement.x;
      impulse.y = movement.y;

      let orientation = false;
      if (impulse.x < 0) {
        orientation = true;
      }

      setFlipX(orientation);

      body.current.applyImpulse(impulse, true);
    }
  };

  return (
    <>
      <group ref={group}>
        <HealthBar health={health} />
      </group>

      <Damage active={ouch} body={body} />

      <RigidBody
        ref={body}
        gravityScale={0}
        restitution={1}
        friction={1}
        position={startPosition}
        canSleep={false}
        lockRotations
        colliders='ball'
        linearDamping={MOVEMENT_DAMPING}
        angularDamping={MOVEMENT_DAMPING}
        userData={{
          type: "enemy",
        }}
      >
        <mesh castShadow>
          <sphereGeometry args={[0.4]} />
          <meshBasicMaterial ref={material} transparent opacity={0} />
          <SpriteAnimator
            flipX={flipX}
            position={[0, 0, 0]}
            startFrame={1}
            fps={10}
            autoPlay
            loop
            numberOfFrames={4}
            alphaTest={0.01}
            textureImageURL={"sprites/enemy_sprites.png"}
            textureDataURL={"sprites/enemy_sprites.json"}
          />
        </mesh>
      </RigidBody>
    </>
  );
};

export default Enemy;
