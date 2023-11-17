import { useEffect, useMemo } from "react";

import {
  MeshBasicMaterial,
  MeshStandardMaterial,
  PlaneGeometry,
  Vector3,
} from "three";
import { v4 as uuidv4 } from "uuid";
import { ALL_NOTES, grid } from "./Stores/constants";
import { Patterns } from "./Stores/types";
import useGame from "./Stores/useGame";
import { LevelManager } from "./components/LevelManager";
import { Lights } from "./components/Lights";
import { Player } from "./components/Player";
import { Loop } from "./components/Sounds/Loop";
import { Terrain } from "./components/Terrain";

import { experienceProperties } from "../../../Stores/constants";
import { useStartButton } from "../hooks/useStartButton";
import { Loading } from "../common/Loading";
import { Enemies } from "./components/Enemies";
import { Select } from "@react-three/postprocessing";
import { Float, Text } from "@react-three/drei";

export const TempoGame = () => {
  const { ready } = useStartButton();

  if (!ready) {
    return (
      <Loading
        position={new Vector3(0, 21, -64)}
        text='This game plays synthesizers'
      />
    );
  }

  return <TempoGameCore />;
};

const boxGeo = new PlaneGeometry(0.6, 0.6);
const shrineMaterial = new MeshStandardMaterial({
  emissive: "gold",
  emissiveIntensity: 2,
});

const mapMaterial = new MeshBasicMaterial({
  color: "#000000",
  transparent: true,
  opacity: 0,
});

const TempoGameCore = () => {
  const players = useGame((s) => s.players);

  const discoveredWorldTiles = useGame((s) => s.discoveredWorldTiles);
  const worldTile = useGame((s) => s.worldTile);
  const restartGame = useGame((s) => s.restartGame);
  const patterns = useGame((s) => s.patterns);
  const setPatterns = useGame((s) => s.setPatterns);

  const world = useGame((s) => s.world);

  useEffect(() => {
    window.addEventListener("pointerdown", placeNoteAtPlayersPosition);
    return () => {
      window.removeEventListener("pointerdown", placeNoteAtPlayersPosition);
    };
  });

  const playerIsDead = useMemo(() => players["p1"]?.dead, [players]);

  const mapTiles = useMemo(
    () =>
      world.map((t, i) => {
        const { row, column } = t.position;
        const selected =
          worldTile.position.row === row &&
          worldTile.position.column === column;
        const discovered = discoveredWorldTiles.includes(t.id);
        const hasShrine = !!t.shrine;

        const selectedIsShrine = !!worldTile.shrine;

        const scale = 0.4;

        return (
          <group
            key={`tile-${i}`}
            position={[column * scale, -row * scale, 5]}
            scale={0.4}
          >
            {hasShrine && (
              <mesh
                scale={0.3}
                visible={!selectedIsShrine || (selectedIsShrine && selected)}
                position-z={0.01}
                geometry={boxGeo}
                material={shrineMaterial}
              />
            )}
            <Select enabled={selected}>
              <mesh geometry={boxGeo} material={mapMaterial} />
            </Select>
          </group>
        );
      }),
    [worldTile]
  );

  const placeNoteAtPlayersPosition = () => {
    if (players.p1?.body?.current) {
      if (worldTile.shrine || players.p1?.dead) {
        return;
      }
      const translation = players.p1?.body?.current.translation();
      const patternsCopy: Patterns = { ...patterns };
      const { notes } = patternsCopy[worldTile.patternId];

      const randomStep = Math.floor(
        Math.random() * (Object.keys(notes).length - 1)
      );

      const id = uuidv4();

      const pitch = Math.floor(translation.y + grid.height / 2);

      patternsCopy[worldTile.patternId].notes[id] = {
        id,
        body: null,
        step: randomStep,
        position: new Vector3(translation.x, translation.y, translation.z),
        pitch,
      };

      setPatterns(patternsCopy);
    }
  };

  return (
    <group position={experienceProperties[3].gamePosition}>
      <color attach='background' args={[worldTile.color || "#fff"]} />
      {playerIsDead && (
        <Float position={[0, 0, 16]} speed={3}>
          <group>
            <Text>You lost conciousness...</Text>
          </group>
        </Float>
      )}
      <Lights />

      <LevelManager />

      <Player />

      <Loop />
      <Terrain />

      <group position={[-3, 2.4, 17]}>{mapTiles}</group>
    </group>
  );
};
