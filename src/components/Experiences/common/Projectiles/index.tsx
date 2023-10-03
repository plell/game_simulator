import { useEffect, useState } from "react";
import { Group, Vector3 } from "three";
import { Bullet } from "./components/Bullet";

type Props = {
  player: React.MutableRefObject<Group | null>;
  launchPosition?: [x: number, y: number, z: number];
};

export const Projectiles = ({ player, launchPosition }: Props) => {
  const [projectiles, setProjectiles] = useState<any>({});

  useEffect(() => {
    window.addEventListener("click", newProjectile);
    return () => {
      window.removeEventListener("click", newProjectile);
    };
  });

  const newProjectile = () => {
    const pCopy = { ...projectiles };
    const id = Object.keys(pCopy).length;

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
      body: null,
      position: position,
      type: "projectile",
      dead: false,
    };

    setProjectiles(pCopy);
  };

  return (
    <group>
      {Object.keys(projectiles).map((p, i) => {
        const self = projectiles[p];
        return <Bullet self={self} key={i} />;
      })}
    </group>
  );
};
