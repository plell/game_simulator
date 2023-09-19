import { useEffect, useRef, useState } from "react";
import { Group, Vector3 } from "three";
import { Bullet } from "./components/Bullet";

type Props = {
  player: React.MutableRefObject<Group | null>;
};

export const Projectiles = ({ player }: Props) => {
  const [projectiles, setProjectiles] = useState<any>({});

  useEffect(() => {
    window.addEventListener("click", newProjectile);
    return () => {
      window.removeEventListener("click", newProjectile);
    };
  });

  const newProjectile = () => {
    console.log("new!");
    const pCopy = { ...projectiles };
    const id = Object.keys(pCopy).length;
    pCopy[id] = {
      id,
      body: null,
      position: player?.current?.position.clone() || new Vector3(),
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
