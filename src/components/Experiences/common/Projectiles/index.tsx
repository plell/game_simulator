import { MutableRefObject, useEffect, useState } from "react";
import { Group, Vector3 } from "three";
import { Bullet } from "./components/Bullet";
import { v4 as uuidv4 } from "uuid";
import { Refs } from "../../SpaceGame";

type Props = {
  player: React.MutableRefObject<Group | null>;
  launchPosition?: [x: number, y: number, z: number];
  refs: MutableRefObject<Refs>;
};

export const Projectiles = ({ refs, player, launchPosition }: Props) => {
  const [projectiles, setProjectiles] = useState<any>({});

  useEffect(() => {
    window.addEventListener("click", newProjectile);
    return () => {
      window.removeEventListener("click", newProjectile);
    };
  });

  const newProjectile = () => {
    const pCopy = { ...projectiles };
    const id = uuidv4();

    const playerPosition = player?.current?.position.clone() || new Vector3();
    const offset: [x: number, y: number, z: number] = launchPosition
      ? launchPosition
      : [0, 0, 0];
    const position = new Vector3(
      playerPosition.x + offset[0],
      playerPosition.y + offset[1],
      playerPosition.z + offset[2]
    );

    pCopy[id] = {
      id,
      position: position,
      type: "projectile",
      dead: false,
    };

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
