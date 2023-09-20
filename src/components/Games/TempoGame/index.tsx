import { MdCake } from "react-icons/md";

import { ReactElement, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { Vector3 } from "three";
import { v4 as uuidv4 } from "uuid";
import { ALL_NOTES, columnLimit, controls } from "./Stores/constants";
import { Interval, Patterns } from "./Stores/types";
import useGame from "./Stores/useGame";
import { Enemy } from "./components/Enemy";
import { LevelManager } from "./components/LevelManager";
import { Lights } from "./components/Lights";
import { Player } from "./components/Player";
import { Loop } from "./components/Sounds/Loop";
import { Terrain } from "./components/Terrain";
import { Cursor } from "./components/UI/Cursor";

import {
  DepthOfField,
  EffectComposer,
  Pixelation,
} from "@react-three/postprocessing";
import { useOuch } from "./components/hooks/useOuch";
import { experienceProperties } from "../../../Stores/constants";

let enemyGeneratorTimeout: Interval = null;

const generatorSpeed = 2000;

export const TempoGame = () => {
  const enemies = useGame((s) => s.enemies);
  const players = useGame((s) => s.players);
  const restartGame = useGame((s) => s.restartGame);

  const setEnemies = useGame((s) => s.setEnemies);

  const setNextWorldTile = useGame((s) => s.setNextWorldTile);
  const discoveredWorldTiles = useGame((s) => s.discoveredWorldTiles);
  const worldTile = useGame((s) => s.worldTile);
  const patterns = useGame((s) => s.patterns);
  const setPatterns = useGame((s) => s.setPatterns);

  const world = useGame((s) => s.world);

  const [tick, setTick] = useState(false);

  useEffect(() => {
    if (enemyGeneratorTimeout) {
      clearInterval(enemyGeneratorTimeout);
    }

    enemyGeneratorTimeout = setInterval(() => {
      setTick((prevTick) => !prevTick);
    }, generatorSpeed);

    return function cleanup() {
      setEnemies({});
    };
  }, []);

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

  const mapTiles = useMemo(
    () =>
      world.map((t, i) => {
        const { row, column } = t.position;
        const selected =
          worldTile.position.row === row &&
          worldTile.position.column === column;
        const discovered = discoveredWorldTiles.includes(t.id);
        const hasShrine = !!t.shrine;
        return (
          <TileIcon
            key={`tile-${i}`}
            onPointerDown={() =>
              setNextWorldTile({
                worldTile: t,
                relativeDirection: "top",
              })
            }
            discovered={discovered}
            selected={selected}
            background={t.color}
          >
            {hasShrine && <MdCake />}
          </TileIcon>
        );
      }),
    [worldTile]
  );

  const placeNoteAtPlayersPosition = () => {
    if (players.p1?.body?.current) {
      if (players.p1?.dead) {
        return;
      }
      const translation = players.p1?.body?.current.translation();
      const patternsCopy: Patterns = { ...patterns };
      const { notes } = patternsCopy[worldTile.patternId];

      const randomStep = Math.floor(
        Math.random() * (Object.keys(notes).length - 1)
      );

      const id = uuidv4();

      const pitch =
        ALL_NOTES[Math.floor(Math.random() * Object.keys(notes).length)];

      patternsCopy[worldTile.patternId].notes[id] = {
        id,
        body: null,
        step: randomStep,
        position: new Vector3(
          translation.x,
          translation.y - 0.5,
          translation.z
        ),
        pitch,
      };

      setPatterns(patternsCopy);
    }
  };

  const ouch = useOuch(players.p1?.health);

  const p1IsDead = players.p1?.dead;

  const toggledEffects: ReactElement<any, any> = useMemo(() => {
    const te: ReactElement<any, any>[] = [];

    if (p1IsDead) {
      te.push(
        <DepthOfField
          key='depth-of-field'
          focusDistance={0.01}
          focalLength={0.02}
          bokehScale={20}
          height={280}
        />
      );
    }

    if (ouch) {
      te.push(<Pixelation key='pixelation' granularity={10} />);
    }

    return <>{te}</>;
  }, [ouch, p1IsDead]);

  return (
    <group
      position={experienceProperties[3].gamePosition}
      onPointerDown={() => {
        placeNoteAtPlayersPosition();
      }}
    >
      <EffectComposer>{toggledEffects}</EffectComposer>

      <color attach='background' args={[worldTile.color || "#fff"]} />

      <Lights />

      <LevelManager />

      <Cursor />

      <Player />
      <Loop />
      <Terrain />

      {Object.values(enemies).map((e, i) => {
        if (e.dead) {
          return null;
        }
        return <Enemy key={`enemy-${i}`} {...e} />;
      })}

      {/* <MapWrapWrap>
        <MapWrap width={(columnLimit + 1) * 14}>{mapTiles}</MapWrap>
      </MapWrapWrap> */}
    </group>
  );
};

const MapWrapWrap = styled.div`
  position: fixed;
  top: 30px;
  right: 30px;
  padding: 7px;
  border-radius: 4px;
  opacity: 0.7;
`;

type MapWrapProps = {
  width: number;
};
const MapWrap = styled.div<MapWrapProps>`
  display: flex;
  flex-grow: 0;
  flex-wrap: wrap;
  width: ${(p) => `${p.width}`}px;
  height: 200px;
`;

type TileIconProps = {
  selected: boolean;
  discovered: boolean;
  background: string;
};
const TileIcon = styled.div<TileIconProps>`
  flex-grow: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 9px;
  font-weight: 900;
  border-radius: 2px;
  margin: 0 2px 2px 0;
  width: 10px;
  height: 10px;
  border: 1px solid;
  border-color: ${(p) =>
    p.selected ? p.background : p.discovered ? `${p.background}44` : "#000"};
  background: ${(p) =>
    p.selected ? p.background : p.discovered ? `${p.background}44` : "#fff"};
`;

const Restart = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 40px;
  font-weight: 900;
  color: #fff;
  z-index: 10;
`;
