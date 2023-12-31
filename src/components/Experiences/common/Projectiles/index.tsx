import { MutableRefObject, useEffect, useState } from "react";
import { Group, Vector3 } from "three";
import { Bullet } from "./components/Bullet";
import { v4 as uuidv4 } from "uuid";
import { Refs } from "../../SpaceGame";
import { Projectile } from "../../../../Stores/types";

type Props = {
  player: React.MutableRefObject<Group | null>;
  launchPosition?: [x: number, y: number, z: number];
  refs: MutableRefObject<Refs>;
  level: number;
};

export const Projectiles = ({ refs, player, launchPosition, level }: Props) => {
  const [projectiles, setProjectiles] = useState<Record<string, Projectile>>(
    {}
  );

  useEffect(() => {
    window.addEventListener("mousedown", newProjectile);
    return () => {
      window.removeEventListener("mousedown", newProjectile);
    };
  });

  const newProjectile = () => {
    const pCopy = { ...projectiles };

    const playerPosition = player?.current?.position.clone() || new Vector3();
    const offset: [x: number, y: number, z: number] = launchPosition
      ? launchPosition
      : [0, 0, 0];
    const position = new Vector3(
      playerPosition.x + offset[0],
      playerPosition.y + offset[1],
      playerPosition.z + offset[2]
    );

    const id = uuidv4();
    pCopy[id] = {
      id,
      position: position,
      type: "projectile",
      dead: false,
      direction: new Vector3(0, 0.3, 0),
    };

    const id2 = uuidv4();
    pCopy[id2] = {
      id: id2,
      position: position,
      type: "projectile",
      dead: false,
      direction: new Vector3(0.1, 0.2, 0),
    };

    const id3 = uuidv4();
    pCopy[id3] = {
      id: id3,
      position: position,
      type: "projectile",
      dead: false,
      direction: new Vector3(-0.1, 0.2, 0),
    };

    if (level < 2) {
      delete pCopy[id2];
      delete pCopy[id3];
    } else if (level < 3) {
      delete pCopy[id];
    }

    setProjectiles(pCopy);
  };

  const removeProjectile = (id: string) => {
    const pCopy = { ...projectiles };
    delete pCopy[id];
    setProjectiles(pCopy);
  };

  return (
    <group>
      {Object.keys(projectiles).map((p) => {
        const self = projectiles[p];
        if (self) {
          return (
            <Bullet
              self={self}
              refs={refs}
              removeMe={removeProjectile}
              key={self.id}
            />
          );
        }
        return null;
      })}
    </group>
  );
};
