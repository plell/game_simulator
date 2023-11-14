import { useEffect, useMemo, useState } from "react";
import { Interval } from "../../Stores/types";
import useGame from "../../Stores/useGame";
import Enemy from "./Enemy";
import { v4 as uuidv4 } from "uuid";

let enemyGeneratorTimeout: Interval = null;

const generatorSpeed = 2000;

export const Enemies = () => {
  const setEnemies = useGame((s) => s.setEnemies);
  const enemies = useGame((s) => s.enemies);
  const worldTile = useGame((s) => s.worldTile);
  const players = useGame((s) => s.players);

  const [tick, setTick] = useState(false);

  const playerIsDead = useMemo(() => players["p1"]?.dead, [players]);

  useEffect(() => {
    if (playerIsDead && enemyGeneratorTimeout) {
      clearInterval(enemyGeneratorTimeout);
    } else {
      enemyGeneratorTimeout = setInterval(() => {
        setTick((prevTick) => !prevTick);
      }, generatorSpeed);
    }

    return function cleanup() {
      setEnemies({});
      if (enemyGeneratorTimeout) {
        clearInterval(enemyGeneratorTimeout);
      }
    };
  }, [playerIsDead]);

  useEffect(() => {
    addNewEnemy();
  }, [tick]);

  const addNewEnemy = () => {
    if (worldTile.shrine) return;
    const enemiesCopy = { ...enemies };
    const newEnemyId = uuidv4();
    enemiesCopy[newEnemyId] = {
      id: newEnemyId,
      body: null,
      health: 100,
      type: "enemy",
      dead: false,
    };

    setEnemies(enemiesCopy);
  };

  return (
    <group>
      {Object.values(enemies).map((e, i) => {
        if (e.dead) {
          return null;
        }
        return <Enemy key={`enemy-${i}`} {...e} />;
      })}
    </group>
  );
};
