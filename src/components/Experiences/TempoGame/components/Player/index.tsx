import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Group, Vector3 } from "three";
import { MOVEMENT_DAMPING, getMovement, grid } from "../../Stores/constants";
import useGame from "../../Stores/useGame";
import { HealthBar } from "../UI/HealthBar";

import { RigidBodyData } from "../../Stores/types";
import { dieSound } from "../Sounds/Tone";
import { SnapRadius } from "./Effects/SnapToRadius";

import { useOuch } from "../hooks/useOuch";
import Cursor from "../UI/Cursor";

export const playerSpeed = 0.12;

const reuseableVector3a = new Vector3();
const reuseableVector3b = new Vector3();
const mouseVec3 = new Vector3();

export const Player = () => {
  const players = useGame((s) => s.players);
  const setPlayers = useGame((s) => s.setPlayers);
  const mouseRef = useRef<Vector3>(mouseVec3);

  const nextWorldTile = useGame((s) => s.nextWorldTile);

  const pause = useMemo(() => {
    if (nextWorldTile) {
      return true;
    }
    return false;
  }, [nextWorldTile]);

  const playerTexture = useTexture("sprites/tomo.png");

  const [playerId, setPlayerId] = useState<string>("init");

  const body = useRef<RapierRigidBody | null>(null);
  const group = useRef<Group | null>(null);

  const health = useMemo(() => {
    const currentHealth = players[playerId]?.health || 0;
    return currentHealth;
  }, [players, playerId]);

  useOuch(health);

  const teleport = () => {
    if (nextWorldTile && body.current) {
      const currentTranslation = body.current.translation();
      let { x, y } = currentTranslation;
      const { z } = currentTranslation;
      const { relativeDirection } = nextWorldTile;

      const pad = 5;

      switch (relativeDirection) {
        case "top":
          y = grid.bottom + pad;
          break;
        case "bottom":
          y = grid.top - pad;
          break;
        case "left":
          x = grid.right - pad;
          break;
        case "right":
          x = grid.left + pad;
          break;
        default:
      }

      body.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
      body.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
      body.current.setTranslation({ x, y, z }, true);
    }
  };

  useEffect(() => {
    if (health < 0 && !players[playerId].dead) {
      const playersCopy = { ...players };
      playersCopy[playerId].dead = true;
      dieSound();
      setPlayers(playersCopy);
    }
  }, [health, players]);

  useLayoutEffect(() => {
    const id = "p1";

    setPlayerId(id);

    setPlayers({
      ...players,
      [id]: {
        id,
        body,
        health: 100,
        type: "player",
        dead: false,
      },
    });
  }, []);

  const dead = useMemo(() => players[playerId]?.dead, [players, playerId]);

  useFrame(() => {
    if (dead) {
      return;
    }

    if (nextWorldTile) {
      teleport();
    } else if (!pause && body.current) {
      const currentTranslation = body.current.translation();

      const currentPosition = reuseableVector3a.set(
        currentTranslation.x,
        currentTranslation.y,
        0
      );

      const mousePosition = reuseableVector3b.set(
        mouseRef.current.x,
        mouseRef.current.y,
        0
      );

      const impulse = { x: 0, y: 0, z: 0 };

      const movement = getMovement(
        currentPosition,
        mousePosition,
        playerSpeed,
        false
      );

      impulse.x = movement.x;
      impulse.y = movement.y;

      body.current.applyImpulse(impulse, true);

      if (group?.current) {
        group?.current.position.lerp(currentPosition, 0.8);
      }
    }
  });

  const takeDamage = (damage: number) => {
    const playersCopy = { ...players };

    playersCopy[playerId].health -= damage;

    setPlayers(playersCopy);
  };

  return (
    <>
      {!dead && (
        <group ref={group}>
          {/* <HealthBar health={health} /> */}
          <SnapRadius />
        </group>
      )}

      <RigidBody
        ref={body}
        gravityScale={0}
        type='dynamic'
        position={[0, 0, 0]}
        lockRotations
        canSleep={false}
        restitution={0.2}
        // mass={1}
        friction={0}
        colliders={"ball"}
        linearDamping={MOVEMENT_DAMPING * 3}
        angularDamping={MOVEMENT_DAMPING * 2}
        onCollisionEnter={({ other }: any) => {
          const object = other.rigidBodyObject?.userData as RigidBodyData;
          if (object?.type === "enemy") {
            const damage = object?.strength || 10;
            takeDamage(damage);
          }
        }}
        userData={{
          type: "player",
          name: "p1",
        }}
      >
        <mesh>
          <planeGeometry />
          <meshBasicMaterial
            transparent
            map={playerTexture}
            opacity={dead ? 0 : 1}
          />
        </mesh>
      </RigidBody>

      <Cursor mouseRef={mouseRef} />

      <mesh
        onPointerMove={(e) => {
          const { x, y, z } = e.point;
          mouseRef.current.set(x, y, z);
        }}
      >
        <planeGeometry args={[145, 80]} />
        <meshStandardMaterial transparent opacity={0} wireframe />
      </mesh>
    </>
  );
};
